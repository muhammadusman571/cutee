import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  updateAvatarFrame,
  crateAvatarFrame,
} from "../../store/AvatarFrame/action";
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
import { CLOSE_DIALOGUE_SVIP } from "../../store/Svip/type";
import SVGA from "svgaplayerweb";
import { crateSvip, updateSvip } from "../../store/Svip/action";
const MAX_FILES = 8;

const SvipDialogue = (props) => {
  const dispatch = useDispatch();
  const { Dialogue, DialogueData } = useSelector((state) => state.svip);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [diamond, setDiamond] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Reset on open/close
  useEffect(() => {
    if (!Dialogue) {
      setName("");
      setImages([]);
      setDiamond("");
      setImagePreview(null);
      setErrors({});
    }
  }, [Dialogue]);

  // Edit mode data
  useEffect(() => {
    if (DialogueData) {
      setMongoId(DialogueData?._id || "");
      setName(DialogueData?.name || "");
      setValidity(DialogueData?.validity);
      setValidityType(DialogueData?.validityType);
      setDiamond(DialogueData?.diamond);
      if (DialogueData?.frame) setImagePreview(baseURL + DialogueData.frame);
    }
  }, [DialogueData]);

  const closePopup = () => {
    dispatch({ type: CLOSE_DIALOGUE_SVIP });
  };

  const handleSubmit = async () => {
    if (!name || (!mongoId && images.length === 0)) {
      const errs = {};
      if (!name) errs.name = "Name is required";
      if (!mongoId && images.length === 0)
        errs.images = "Please select at least one file!";
      if (validity < 0) errs.validity = "invalid value of validity";
      if (!validity) errs.validity = "Validity is required!";
      if (!diamond) errs.diamond = "Diamond is required";
      if (diamond < 0) errs.diamond = "Invalid Diamond ";
      setErrors(errs);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("diamond", diamond);
    formData.append("validity", validity);
    formData.append("validityType", validityType ? validityType : "day");
    images.forEach((file) => formData.append("files", file));

    let success = false;

    if (mongoId) {
      success = await props.updateSvip(mongoId, formData);
    } else {
      success = await props.crateSvip(formData);
    }

    // ✅ Close only if success
    if (success) closePopup();
  };

  // ✅ Handle image and SVGA uploads
  const onPreviewDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const isSvga = ext === "svga";
      const preview = URL.createObjectURL(file);
      return Object.assign(file, { preview, isSvga });
    });

    // ✅ Merge with previous files safely (no duplicates)
    setImages((prev) => {
      const all = [...prev];
      newFiles.forEach((nf) => {
        // Prevent duplicate previews by comparing file.name
        if (!all.some((f) => f.name === nf.name)) {
          all.push(nf);
        }
      });
      return all;
    });

    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (file) => {
    setImages((prev) => prev.filter((f) => f.preview !== file.preview));
  };

  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages([file]);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // ✅ Render SVGA previews
  useEffect(() => {
    images.forEach((file, idx) => {
      if (file.isSvga && file.preview) {
        const container = document.getElementById(`svga-player-${idx}`);
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
    });

    // ❗Don't revoke here on re-render
    return () => {};
  }, [images]);

  useEffect(() => {
    if (!Dialogue) {
      images.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setImages([]);
    }
  }, [Dialogue]);

  return (
    <Dialog
      open={Dialogue}
      aria-labelledby="responsive-dialog-title"
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="responsive-dialog-title">
        <span className="text-danger font-weight-bold h4">Svip</span>
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
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-gray mb-2">Validity</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    placeholder="1"
                    min="0"
                    value={validity}
                    onChange={(e) => {
                      setValidity(e.target.value);
                      if (!e.target.value) {
                        return setErrors((prev) => ({
                          ...prev,
                          validity: "Validity is Required!",
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, validity: "" }));
                      }
                    }}
                  />
                  {errors.validity && (
                    <div className="ml-2 mt-1">
                      {errors.validity && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.validity}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="text-gray mb-2">Validity Type</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    value={validityType}
                    onChange={(e) => {
                      setValidityType(e.target.value);
                    }}
                  >
                    <option value="day">Day</option>
                    <option value="Month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="mb-2 text-gray">diamond</label>
              <input
                type="number"
                className="form-control"
                required=""
                min="0"
                placeholder="20"
                value={diamond}
                onChange={(e) => {
                  setDiamond(e.target.value);
                  if (!e.target.value) {
                    return setErrors((prev) => ({
                      ...prev,
                      diamond: "diamond is Required!",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, diamond: "" }));
                  }
                }}
              />
              {errors.diamond && (
                <div className="ml-2 mt-1">
                  {errors.diamond && (
                    <div className="pl-1 text__left">
                      <span className="text-red">{errors.diamond}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Name Field */}
            <div className="form-group mt-4">
              <label className="text-gray mb-2">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Baron"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value)
                    setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {errors.name && (
                <small className="text-red">{errors.name}</small>
              )}
            </div>

            {/* Upload Section */}
            <div className="form-group mt-4">
              <label className="text-gray mb-2">
                Upload Multiple Images (.png, .jpg, .gif, .svga)
              </label>
              <ReactDropzone
                onDrop={onPreviewDrop}
                accept={{
                  "image/*": [".jpeg", ".png", ".jpg", ".gif"],
                  "application/octet-stream": [".svga"],
                }}
                multiple
                maxFiles={8}
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

              {errors.images && (
                <small className="text-red">{errors.images}</small>
              )}

              <div className="d-flex flex-wrap mt-3">
                {images.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    {file.isSvga ? (
                      <div
                        id={`svga-player-${index}`}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      ></div>
                    ) : (
                      <img
                        src={file.preview}
                        alt="preview"
                        height="70"
                        width="70"
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
                        right: -6,
                        top: -6,
                        cursor: "pointer",
                        background: "#fff",
                        borderRadius: "50%",
                      }}
                      onClick={() => removeImage(file)}
                    />
                  </div>
                ))}
              </div>
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

export default connect(null, { updateSvip, crateSvip })(SvipDialogue);
