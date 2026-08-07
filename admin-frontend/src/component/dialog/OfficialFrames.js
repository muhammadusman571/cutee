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
import {
  createOfficialFrame,
  updateOfficialFrame,
} from "../../store/OfficialFrames/action";
import { CLOSE_DIALOGUE_OFFICIAL_FRAME } from "../../store/OfficialFrames/type";

const OfficialFrameDialog = (props) => {
  const dispatch = useDispatch();
  const { Dialogue, DialogueData } = useSelector(
    (state) => state.officialFrames
  );

  // Local state
  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  // const [rankType, setRankType] = useState("room");
  // const [rankNumber, setRankNumber] = useState("1st");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset form when dialog closes
  useEffect(() => {
    if (!Dialogue) {
      setName("");
      // setRankType("room");
      // setRankNumber("1st");
      setFile(null);
      setErrors({});
    }
  }, [Dialogue]);

  // Edit mode data
  useEffect(() => {
    if (DialogueData) {
      setMongoId(DialogueData?._id || "");
      setName(DialogueData?.name || "");
      // setRankType(DialogueData?.rankType || "room");
      // setRankNumber(DialogueData?.rankNumber || "1st");

      if (DialogueData?.frame) {
        setFile({
          preview: baseURL + DialogueData.frame,
          name: "existing",
          isSvga: true,
          existing: true,
        });
      }
    }
  }, [DialogueData]);

  const closePopup = () => {
    dispatch({ type: CLOSE_DIALOGUE_OFFICIAL_FRAME });
  };

  // Submit handler
  const handleSubmit = async () => {
    const errs = {};
    if (!name) errs.name = "Name is required";
    if (!file) errs.file = "Please upload a frame SVGA file";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const formData = new FormData();
    formData.append("name", name);
    // formData.append("rankType", rankType);
    // formData.append("rankNumber", rankNumber);

    if (file && file instanceof File) {
      formData.append("file", file);
    }

    let success = false;
    if (mongoId) {
      success = await props.updateOfficialFrame(mongoId, formData);
    } else {
      success = await props.createOfficialFrame(formData);
    }

    if (success) closePopup();
  };

  // Handle file drop (only one file)
  const onPreviewDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split(".").pop().toLowerCase();
    const isSvga = ext === "svga";
    const preview = URL.createObjectURL(uploadedFile);
    setFile(Object.assign(uploadedFile, { preview, isSvga }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  // Remove uploaded file
  const removeImage = () => {
    setFile(null);
  };

  // Render SVGA preview
  useEffect(() => {
    if (file && file.isSvga && file.preview && !file.existing) {
      const container = document.getElementById("svga-player");
      if (container) {
        const player = new SVGA.Player(container);
        const parser = new SVGA.Parser(container);
        try {
          parser.load(file.preview, (videoItem) => {
            player.setVideoItem(videoItem);
            player.startAnimation();
          });
        } catch (err) {
          console.warn("SVGA parse error:", err);
        }
      }
    }
  }, [file]);

  return (
    <Dialog
      open={Dialogue}
      aria-labelledby="official-frame-dialog"
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="official-frame-dialog">
        <span className="text-danger font-weight-bold h4">Official Frame</span>
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
            {/* Rank Type + Rank Number */}
            {/* <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-gray mb-2">Rank Type</label>
                  <select
                    className="form-select form-control"
                    value={rankType}
                    onChange={(e) => setRankType(e.target.value)}
                  >
                    <option value="room">Room</option>
                    <option value="gift">Gift</option>
                    <option value="charm">Charm</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-gray mb-2">Rank Number</label>
                  <select
                    className="form-select form-control"
                    value={rankNumber}
                    onChange={(e) => setRankNumber(e.target.value)}
                  >
                    <option value="1st">First Rank</option>
                    <option value="2nd">Second Rank</option>
                    <option value="3rd">Third Rank</option>
                  </select>
                </div>
              </div>
            </div> */}

            {/* Name Field */}
            <div className="form-group mt-4">
              <label className="text-gray mb-2">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Baron Frame"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value)
                    setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {errors.name && <small className="text-red">{errors.name}</small>}
            </div>

            {/* SVGA Upload */}
            <div className="form-group mt-4">
              <label className="text-gray mb-2">
                Upload Official Frame SVGA (.svga)
              </label>
              <ReactDropzone
                onDrop={onPreviewDrop}
                accept={{
                  "application/octet-stream": [".svga"],
                }}
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <section {...getRootProps()} className="dropzone">
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

              {errors.file && <small className="text-red">{errors.file}</small>}

              {/* Preview */}
              {file && (
                <div
                  style={{
                    position: "relative",
                    marginTop: 15,
                    maxWidth: "max-content",
                  }}
                >
                  {file.isSvga ? (
                    <div
                      id="svga-player"
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    ></div>
                  ) : (
                    <img
                      src={file.preview}
                      alt="preview"
                      height="100"
                      width="100"
                      style={{
                        borderRadius: 10,
                        objectFit: "contain",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    />
                  )}
                  <i
                    className="fas fa-times-circle text-danger"
                    style={{
                      position: "absolute",
                      right: -8,
                      top: -8,
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "50%",
                    }}
                    onClick={removeImage}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-5 text-end">
              <button
                type="button"
                className="btn btn-outline-info btn-round me-2"
                onClick={closePopup}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger btn-round"
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

export default connect(null, { createOfficialFrame, updateOfficialFrame })(
  OfficialFrameDialog
);
