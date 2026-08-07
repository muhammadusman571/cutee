import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { CLOSE_DIALOGUE_CP_REWARD } from "../../store/CPReward/type";

import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";
import { Typography } from "antd";
import html2canvas from "html2canvas";
import { Cropper } from "react-advanced-cropper";
import { updateCPReward, createCPReward } from "../../store/CPReward/action";

const CPRewardDialogue = ({ usedPositions = [], ...props }) => {
  const { Dialogue, DialogueData } = useSelector((state) => state.cpReward);
  const dispatch = useDispatch();

  const [name, setName] = useState("");

  // --- Start Time
  const [startValidityType, setStartValidityType] = useState("days");
  const [startTimeValue, setStartTimeValue] = useState(0);
  const [startMinutes, setStartMinutes] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [rules, setRules] = useState("");
  const [position, setPosition] = useState(1);

  // --- End Time
  const [endValidityType, setEndValidityType] = useState("days");
  const [endTimeValue, setEndTimeValue] = useState(0);
  const [endMinutes, setEndMinutes] = useState(0);
  const [endSeconds, setEndSeconds] = useState(0);

  const [imagePath, setImagePath] = useState("");
  const [imageData, setImageData] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  const [isSvga, setIsSvga] = useState(true);
  const [image, setImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(true);

  const [errors, setErrors] = useState({});
  const [mongoId, setMongoId] = useState("");
  const imageRef = useRef();

  const [startHours, setStartHours] = useState(0);
  const [endHours, setEndHours] = useState(0);
  // State for inputs
  const [validity, setValidity] = useState(1);
  const [validityType, setValidityType] = useState("day");

  const [cropper, setCropper] = useState();

  // --- Reset on dialogue close ---
  useEffect(() => {
    if (!Dialogue) {
      setName("");
      setStartValidityType("days");
      setStartTimeValue(0);
      setStartMinutes(0);
      setStartSeconds(0);
      setEndValidityType("days");
      setEndTimeValue(0);
      setEndMinutes(0);
      setEndSeconds(0);
      setImagePath("");
      setImageData(null);

      setIsSvga(true);
      setImage(null);
      setIsSubmit(true);
      setErrors({});
      setRules("");
      setPosition(1);
      setImages([]); // ✅ empty array
      setImagePaths([]);
    }
  }, [Dialogue]);

  // --- Load DialogueData ---
  useEffect(() => {
    if (DialogueData) {
      setName(DialogueData?.name || "");
      setMongoId(DialogueData?._id);

      // Start Time
      setStartValidityType(DialogueData?.startValidityType || "days");
      const startValue =
        DialogueData?.startValidityType === "days"
          ? DialogueData?.startDays || 0
          : DialogueData?.startValidityType === "hours"
            ? DialogueData?.startHours || 0
            : DialogueData?.startMinutes || 0;
      setStartTimeValue(startValue);
      setStartMinutes(DialogueData?.startMinutes || 0);
      setStartSeconds(DialogueData?.startSeconds || 0);
      setRules(DialogueData?.rules || "");
      setPosition(DialogueData?.position || 1);

      // End Time
      setEndValidityType(DialogueData?.endValidityType || "days");
      const endValue =
        DialogueData?.endValidityType === "days"
          ? DialogueData?.endDays || 0
          : DialogueData?.endValidityType === "hours"
            ? DialogueData?.endHours || 0
            : DialogueData?.endMinutes || 0;
      setEndTimeValue(endValue);
      setEndMinutes(DialogueData?.endMinutes || 0);
      setEndSeconds(DialogueData?.endSeconds || 0);

      setImagePath(baseURL + DialogueData?.image);
      setImageData(baseURL + DialogueData?.image);

      setValidity(DialogueData?.validity || "");
      setValidityType(DialogueData?.validityType || "day");
      setIsSvga(DialogueData?.imageVideo?.split(".").pop() === "svga");
    }
  }, [DialogueData]);

  // --- Image upload ---
  const handleInputImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // append instead of overwrite
    setImages((prev) => [...prev, ...files]);
    setImagePaths((prev) => [...prev, ...newPreviews]);

    e.target.value = null; // reset input so same file can be reselected
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // --- SVGA handling ---
  useEffect(() => {
    if (isSvga && imagePath) {
      const player = new SVGA.Player(`div[attr="${mongoId}"]`);
      const parser = new SVGA.Parser(`div[attr="${mongoId}"]`);
      const src = imageData?.preview || baseURL + DialogueData?.image;

      parser.load(src, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
        setTimeout(() => captureAndSendImage(player, mongoId), 3000);
      });
    } else setIsSubmit(false);
  }, [imageData, isSvga, imagePath]);

  const captureAndSendImage = (player, index) =>
    new Promise((resolve) => {
      player.pauseAnimation();
      const container = document.querySelector(`div[attr="${index}"]`);
      html2canvas(container, {
        scale: 1,
        useCORS: true,
        backgroundColor: "rgba(0,0,0,0)",
      }).then((canvas) => {
        canvas.toBlob((blob) => {
          setImage(blob);
          setIsSubmit(false);
          resolve(blob);
        }, "image/png");
      });
    });

  const closePopup = () => {
    dispatch({
      type: CLOSE_DIALOGUE_CP_REWARD,
      payload: { DialogueType: "", Dialog: false, DialogueData: "" },
    });
  };
  useEffect(() => {
    imagePaths.forEach((img, index) => {
      const player = new SVGA.Player(`#svga-${index}`);
      const parser = new SVGA.Parser(`#svga-${index}`);

      parser.load(img.preview, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    });

    if (imagePaths.length) {
      setIsSubmit(false);
    }
  }, [imagePaths]);

  // --- Form Submit ---
  const handleSubmit = () => {
    const err = {};
    if (!name) err.name = "Name is required!";

    if (startTimeValue < 0)
      err.startTimeValue = `Enter valid start ${startValidityType}`;
    if (startMinutes < 0 || startMinutes > 59)
      err.startMinutes = "Start Minutes must be 0-59";
    if (startSeconds < 0 || startSeconds > 59)
      err.startSeconds = "Start Seconds must be 0-59";

    if (endTimeValue < 0)
      err.endTimeValue = `Enter valid end ${endValidityType}`;
    if (endMinutes < 0 || endMinutes > 59)
      err.endMinutes = "End Minutes must be 0-59";
    if (endSeconds < 0 || endSeconds > 59)
      err.endSeconds = "End Seconds must be 0-59";

    if (!images) err.image = "Please select an image/SVGA!";
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    if (!validity) err.validity = "Validity is required!";

    const formData = new FormData();
    formData.append("thumbnail", image);
    formData.append("name", name);

    // Start Time
    formData.append("startValidityType", startValidityType);
    formData.append(
      "startDays",
      startValidityType === "days" ? Number(startTimeValue) : 0,
    );
    formData.append("validity", Number(validity));
    formData.append("validityType", validityType);
    formData.append(
      "startHours",
      startValidityType === "hours" ? Number(startTimeValue) : 0,
    );
    formData.append("startMinutes", Number(startMinutes));
    formData.append("startSeconds", Number(startSeconds));

    // End Time
    formData.append("endValidityType", endValidityType);
    formData.append(
      "endDays",
      endValidityType === "days" ? Number(endTimeValue) : 0,
    );
    formData.append(
      "endHours",
      endValidityType === "hours" ? Number(endTimeValue) : 0,
    );
    formData.append("endMinutes", Number(endMinutes));
    formData.append("endSeconds", Number(endSeconds));
    images.forEach((file) => {
      formData.append("imageVideo", file);
    });

    formData.append("rules", JSON.stringify(rules));
    formData.append("position", Number(position));

    if (DialogueData) props.updateCPReward(mongoId, formData);
    else props.createCPReward(formData);

    closePopup();
  };

  // ye edit mode handle karega
  const availablePositions = [...Array(10)]
    .map((_, i) => i + 1)
    .filter((pos) => {
      if (DialogueData && DialogueData.position === pos) return true;

      return !usedPositions.includes(pos);
    });
  return (
    <Dialog
      open={Dialogue}
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle>
          <span className="text-danger font-weight-bold h4">CP Reward</span>
        </DialogTitle>
        <IconButton onClick={closePopup}>
          <Tooltip title="Close">
            <Cancel />
          </Tooltip>
        </IconButton>
      </div>

      <DialogContent>
        {/* Cropper hidden */}
        <div style={{ display: "none" }}>
          <Cropper
            defaultCoordinates={{ height: 221, left: 77, top: 192, width: 192 }}
            src={image}
            onChange={setCropper}
          />
          <img
            ref={imageRef}
            src={image}
            alt="Original"
            style={{ display: "none" }}
          />
        </div>

        <form>
          <div className="row">
            <div className="col-6">
              <label className="mb-2 mt-3 text-gray">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="text-red">{errors.name}</span>}
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <label className="text-gray mb-2">Validity</label>
              <input
                type="number"
                className="form-control"
                placeholder="1"
                min="0"
                value={validity}
                onChange={(e) => {
                  setValidity(e.target.value);
                }}
              />
              {errors.validity && (
                <div className="ml-2 mt-1 pl-1 text-left">
                  <span className="text-red">{errors.validity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Validity Type */}
          <div className="col-md-6 col-12">
            <div className="form-group">
              <label className="text-gray mb-2">Validity Type</label>
              <select
                className="form-select form-control"
                value={validityType}
                onChange={(e) => setValidityType(e.target.value)}
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <label className="mb-2 mt-3 text-gray">Position</label>
              <select
                className="form-control"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
              >
                {availablePositions.length === 0 ? (
                  <option value="">No Position Available</option>
                ) : (
                  availablePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <label className="mb-2 mt-3 text-gray">Rules</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Rules (comma separated)"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>

          {/* Start Time */}
          {/* Start Time */}
          <div className="row mt-2">
            <div className="col-12">
              <label className="mb-2 mt-3 text-gray">
                Start Time Validity Type
              </label>

              <select
                className="form-control"
                value={startValidityType}
                onChange={(e) => setStartValidityType(e.target.value)}
              >
                <option value="days">Days</option>
                <option value="hours">Hours</option>
                <option value="minutes">Minutes</option>
              </select>

              <input
                type="number"
                min="0"
                className="form-control mt-2"
                value={startTimeValue}
                onChange={(e) => setStartTimeValue(Number(e.target.value))}
                placeholder={startValidityType}
              />
            </div>
          </div>

          {/* DAYS */}
          {startValidityType === "days" && (
            <div className="row mt-2">
              <div className="col-4">
                <label class="text-white">Start Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="form-control"
                  value={startHours}
                  onChange={(e) => setStartHours(Number(e.target.value))}
                />
              </div>

              <div className="col-4">
                <label class="text-white">Start Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={startMinutes}
                  onChange={(e) => setStartMinutes(Number(e.target.value))}
                />
              </div>

              <div className="col-4">
                <label class="text-white">Start Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* HOURS */}
          {startValidityType === "hours" && (
            <div className="row mt-2">
              <div className="col-6">
                <label class="text-white">Start Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={startMinutes}
                  onChange={(e) => setStartMinutes(Number(e.target.value))}
                />
              </div>

              <div className="col-6">
                <label class="text-white">Start Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* MINUTES */}
          {startValidityType === "minutes" && (
            <div className="row mt-2">
              <div className="col-12">
                <label class="text-white">Start Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* End Time */}
          <div className="row mt-2">
            <div className="col-12">
              <label className="mb-2 mt-3 text-gray">
                End Time Validity Type
              </label>

              <select
                className="form-control"
                value={endValidityType}
                onChange={(e) => setEndValidityType(e.target.value)}
              >
                <option value="days">Days</option>
                <option value="hours">Hours</option>
                <option value="minutes">Minutes</option>
              </select>

              <input
                type="number"
                min="0"
                className="form-control mt-2"
                value={endTimeValue}
                onChange={(e) => setEndTimeValue(Number(e.target.value))}
                placeholder={endValidityType}
              />
            </div>
          </div>

          {/* DAYS */}
          {endValidityType === "days" && (
            <div className="row mt-2">
              <div className="col-4">
                <label class="text-white">End Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="form-control"
                  value={endHours}
                  onChange={(e) => setEndHours(Number(e.target.value))}
                />
              </div>

              <div className="col-4">
                <label class="text-white">End Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={endMinutes}
                  onChange={(e) => setEndMinutes(Number(e.target.value))}
                />
              </div>

              <div className="col-4">
                <label class="text-white">End Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={endSeconds}
                  onChange={(e) => setEndSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* HOURS */}
          {endValidityType === "hours" && (
            <div className="row mt-2">
              <div className="col-6">
                <label class="text-white">End Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={endMinutes}
                  onChange={(e) => setEndMinutes(Number(e.target.value))}
                />
              </div>

              <div className="col-6">
                <label class="text-white">End Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={endSeconds}
                  onChange={(e) => setEndSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* MINUTES */}
          {endValidityType === "minutes" && (
            <div className="row mt-2">
              <div className="col-12">
                <label class="text-white">End Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="form-control"
                  value={endSeconds}
                  onChange={(e) => setEndSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="row mt-2">
            <div className="col-12">
              <input
                type="file"
                accept=".svga"
                multiple
                className="form-control"
                onChange={handleInputImage}
              />

              {errors.image && (
                <Typography variant="caption" color="error">
                  {errors.image}
                </Typography>
              )}
            </div>
          </div>

          {/* ⭐ MULTIPLE SVGA PREVIEW */}
          {imagePaths.length > 0 && (
            <div className="row mt-3">
              <div className="col-12">
                {imagePaths.map((img, index) => (
                  <div key={index}>
                    <div
                      id={`svga-${index}`}
                      style={{
                        width: "200px",
                        height: "200px",
                        marginTop: "10px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-footer mt-3">
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={closePopup}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={isSubmit}
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

export default connect(null, { createCPReward, updateCPReward })(
  CPRewardDialogue,
);
