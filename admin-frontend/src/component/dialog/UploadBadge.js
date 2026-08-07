import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import ReactDropzone from "react-dropzone";
import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";
import { CLOSE_DIALOGUE_UPLOAD_BADGE } from "../../store/uploadBadge/type";
import {
  createUploadBadge,
  updateUploadBadge,
} from "../../store/uploadBadge/action";

const UploadBadgeDialog = (props) => {
  const dispatch = useDispatch();
  const { Dialogue, DialogueData } = useSelector((state) => state.uploadBadge);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [errors, setErrors] = useState({});

  // Reset when dialog closes
  useEffect(() => {
    if (!Dialogue) {
      setName("");
      setType("image");
      setFile(null);
      setTextValue("");
      setErrors({});
      setMongoId("");
    }
  }, [Dialogue]);

  // Edit Mode Data Load
  useEffect(() => {
    if (DialogueData) {
      setMongoId(DialogueData?._id || "");
      setName(DialogueData?.name || "");
      setType(DialogueData?.type || "image");

      if (DialogueData?.type === "text") {
        setTextValue(DialogueData?.text || "");
      } else if (DialogueData?.frame) {
        setFile({
          preview: baseURL + DialogueData.frame,
          name: "existing",
          isSvga: DialogueData.type === "svga",
          existing: true,
        });
      }
    }
  }, [DialogueData]);

  const closePopup = () => {
    dispatch({ type: CLOSE_DIALOGUE_UPLOAD_BADGE });
  };

  const handleSubmit = async () => {
    const errs = {};
    if (!name) errs.name = "Name is required";

    if (type === "text" && !textValue) errs.file = "Text is required";

    if ((type === "image" || type === "svga") && !file)
      errs.file = "Please upload a file";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);

    // ✅ IMPORTANT CHANGE
    if (type === "text") {
      formData.append("text", textValue); // sending text key
    } else if (file && file instanceof File) {
      formData.append("file", file);
    }

    let success = false;

    if (mongoId) {
      success = await props.updateUploadBadge(mongoId, formData);
    } else {
      success = await props.createUploadBadge(formData);
    }

    if (success) closePopup();
  };

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split(".").pop().toLowerCase();
    const isSvga = ext === "svga";
    const preview = URL.createObjectURL(uploadedFile);

    setFile(Object.assign(uploadedFile, { preview, isSvga }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const removeFile = () => {
    setFile(null);
  };

  // SVGA Preview
  useEffect(() => {
    if (file && file.isSvga && file.preview && !file.existing) {
      const container = document.getElementById("svga-player");
      if (container) {
        const player = new SVGA.Player(container);
        const parser = new SVGA.Parser(container);
        parser.load(file.preview, (videoItem) => {
          player.setVideoItem(videoItem);
          player.startAnimation();
        });
      }
    }
  }, [file]);

  return (
    <Dialog open={Dialogue} onClose={closePopup} fullWidth maxWidth="xs">
      <DialogTitle>
        <span className="text-danger font-weight-bold h4">Upload Badge</span>
      </DialogTitle>

      <IconButton
        style={{ position: "absolute", right: 10, top: 10 }}
        onClick={closePopup}
      >
        <Tooltip title="Close">
          <Cancel className="text-danger" />
        </Tooltip>
      </IconButton>

      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <form>
            {/* Name */}
            <div className="form-group mt-4">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* Type */}
            <div className="form-group mt-4">
              <label>Select Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setFile(null);
                  setTextValue("");
                }}
              >
                <option value="image">Image</option>
                <option value="svga">SVGA</option>
              </select>
            </div>

            {/* TEXT INPUT */}
            {type === "text" && (
              <div className="form-group mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter text..."
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                    setErrors((prev) => ({ ...prev, file: "" }));
                  }}
                />
                {errors.file && (
                  <small className="text-danger">{errors.file}</small>
                )}
              </div>
            )}

            {/* FILE UPLOAD */}
            {(type === "image" || type === "svga") && (
              <div className="form-group mt-4">
                <label>Upload {type === "image" ? "Image" : "SVGA"} File</label>

                <ReactDropzone
                  onDrop={onDrop}
                  accept={
                    type === "image"
                      ? { "image/*": [".png", ".jpg", ".jpeg"] }
                      : { "application/octet-stream": [".svga"] }
                  }
                  multiple={false}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div
                        style={{
                          height: 130,
                          width: 130,
                          border: "2px dashed gray",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className="fas fa-plus"
                          style={{ paddingTop: 30, fontSize: 70 }}
                        ></i>
                      </div>
                    </section>
                  )}
                </ReactDropzone>

                {errors.file && (
                  <small className="text-danger">{errors.file}</small>
                )}

                {file && (
                  <div style={{ marginTop: 15 }}>
                    {file.isSvga ? (
                      <div
                        id="svga-player"
                        style={{ width: 100, height: 100 }}
                      />
                    ) : (
                      <img
                        src={file.preview}
                        alt="preview"
                        height="100"
                        width="100"
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="btn btn-sm btn-danger mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-5 text-end">
              <button
                type="button"
                className="btn btn-outline-info me-2"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, {
  createUploadBadge,
  updateUploadBadge,
})(UploadBadgeDialog);
