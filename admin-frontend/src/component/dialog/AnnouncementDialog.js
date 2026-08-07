import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { connect, useDispatch, useSelector } from "react-redux";
import ReactDropzone from "react-dropzone";

import {
  createAnnouncement,
  editAnnouncement,
} from "../../store/Announcement/announcement.action";
import { CLOSE_ANNOUNCEMENT_DIALOG } from "../../store/Announcement/announcement.type";

const AnnouncementDialog = (props) => {
  const dispatch = useDispatch();
  const { dialog: open, dialogData } = useSelector(
    (state) => state.announcement,
  );

  const [type, setType] = useState("text"); // 'text', 'image', 'video'
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [sendNow, setSendNow] = useState(true);
  const [scheduledTime, setScheduledTime] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setTitle(dialogData.title || "");
      setText(dialogData.text || "");
      setSendNow(dialogData.sendNow ?? true);
      setScheduledTime(dialogData.scheduledTime || "");
      setType(dialogData.type || "text");
      setMediaPreview(dialogData.media || []);
    } else {
      clearForm();
    }
  }, [dialogData]);

  const clearForm = () => {
    setType("text");
    setTitle("");
    setText("");
    setMediaFiles([]);
    setMediaPreview([]);
    setSendNow(true);
    setScheduledTime("");
    setMongoId("");
    setErrors({});
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_ANNOUNCEMENT_DIALOG });
  };

  const onDropMedia = (files) => {
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles([...mediaFiles, ...files]);
    setMediaPreview([...mediaPreview, ...previews]);
  };

  const removeMedia = (preview) => {
    setMediaPreview(mediaPreview.filter((p) => p.preview !== preview));
    setMediaFiles(mediaFiles.filter((f) => URL.createObjectURL(f) !== preview));
  };

  const validateForm = () => {
    const errs = {};
    if (!title) errs.title = "Title is required!";
    if (type === "text" && !text) errs.text = "Text is required!";
    if (
      (type === "image" || type === "video") &&
      mediaFiles.length === 0 &&
      mediaPreview.length === 0
    )
      errs.media = "Media is required!";
    if (!sendNow && !scheduledTime)
      errs.scheduledTime = "Scheduled time required!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("type", type);
    formData.append("sendNow", sendNow);
    if (!sendNow) formData.append("scheduledTime", scheduledTime);

    mediaFiles.forEach((file) => formData.append("media", file));

    if (!mongoId) {
      props.createAnnouncement(formData);
    } else {
      props.editAnnouncement(formData, mongoId);
    }
    clearForm();
  };

  return (
    <Dialog open={open} onClose={closePopup} fullWidth maxWidth="sm">
      <DialogTitle>
        <span className="text-danger font-weight-bold h4">Announcement</span>
        <IconButton style={{ position: "absolute", right: 0 }}>
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form>
          {/* Type Selector */}
          <div className="form-group">
            <label style={{ color: "white" }}>Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label style={{ color: "white" }}>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="text-red">{errors.title}</span>}
          </div>

          {/* Text field only for Text type */}
          {type === "text" && (
            <div className="form-group">
              <label style={{ color: "white" }}>Text</label>
              <textarea
                className="form-control"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {errors.text && <span className="text-red">{errors.text}</span>}
            </div>
          )}

          {/* Media field only for Image or Video */}
          {(type === "image" || type === "video") && (
            <div className="form-group">
              <label style={{ color: "white" }}>Media ({type})</label>
              <ReactDropzone
                onDrop={onDropMedia}
                accept={type === "image" ? "image/*" : "video/*"}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      height: 120,
                      border: "2px dashed gray",
                      textAlign: "center",
                    }}
                  >
                    <input {...getInputProps()} />
                    <i
                      className="fas fa-plus"
                      style={{ fontSize: 50, paddingTop: 30 }}
                    ></i>
                  </div>
                )}
              </ReactDropzone>
              <div className="mt-2 d-flex flex-wrap">
                {mediaPreview.map((m, idx) => (
                  <div
                    key={idx}
                    style={{ position: "relative", marginRight: 10 }}
                  >
                    {m.file?.type.startsWith("video") ? (
                      <video width={80} height={80} src={m.preview} />
                    ) : (
                      <img
                        width={80}
                        height={80}
                        src={m.preview}
                        alt="preview"
                      />
                    )}
                    <i
                      className="fas fa-times-circle text-danger"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => removeMedia(m.preview)}
                    ></i>
                  </div>
                ))}
              </div>
              {errors.media && <span className="text-red">{errors.media}</span>}
            </div>
          )}

          {/* Send Now / Schedule */}
          <div className="form-group">
            <label style={{ color: "white" }}>Send Now?</label>
            <select
              className="form-select"
              value={sendNow}
              onChange={(e) => setSendNow(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No (Schedule)</option>
            </select>
          </div>

          {!sendNow && (
            <div className="form-group">
              <label style={{ color: "white" }}>Scheduled Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              {errors.scheduledTime && (
                <span className="text-red">{errors.scheduledTime}</span>
              )}
            </div>
          )}

          <div className="mt-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-info mr-2"
              onClick={closePopup}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { createAnnouncement, editAnnouncement })(
  AnnouncementDialog,
);
