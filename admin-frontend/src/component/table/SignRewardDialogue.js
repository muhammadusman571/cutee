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

import { CLOSE_DIALOGUE_SIGN_REWARD } from "../../store/SignReward/type";
import {
  createSignReward,
  updateSignReward,
} from "../../store/SignReward/action";
import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";
import { Toast } from "../../util/Toast";
import { Typography } from "antd";
import html2canvas from "html2canvas";
const SignRewardDialogue = (props) => {
  const { Dialogue, DialogueData } = useSelector(
    (state) => state.signReward || {},
  );
  const dispatch = useDispatch();
  const imageRef = useRef();

  const [diamond, setDiamond] = useState("");
  const [name, setName] = useState("");
  const [images, setImages] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [imageData, setImageData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSvga, setIsSvga] = useState(false);
  const [mongoId, setMongoId] = useState("");
  const [isSubmit, setIsSubmit] = useState(true);
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [rewardDay, setRewardDay] = useState("");
  const [image, setImage] = useState();

  useEffect(() => {
    if (DialogueData) {
      setValidity(DialogueData?.validity);
      setValidityType(DialogueData?.validityType);
      setDiamond(DialogueData?.diamond);
      setName(DialogueData?.name);
      setRewardDay(DialogueData?.rewardDay || "");
      setMongoId(DialogueData?._id);
      setImagePath(baseURL + DialogueData?.image);
      setImage(baseURL + DialogueData?.image);
      setImageData(baseURL + DialogueData?.image);

      if (DialogueData?.imageVideo?.split(".")?.pop() === "svga") {
        setIsSvga(true);
      } else setIsSvga(false);
    } else {
      resetForm();
    }
  }, [DialogueData, Dialogue]);

  const resetForm = () => {
    setValidity("");
    setValidityType("");
    setDiamond("");
    setName("");
    setRewardDay("");
    setImages(null);
    setImagePath("");
    setImageData(null);
    setErrors({});
    setIsSubmit(true);
    setIsSvga(false);
    setMongoId("");
  };

  const handleInputImage = (e) => {
    setImages("");
    if (e.target.files[0]) {
      Object.assign(e.target.files[0], {
        preview: URL.createObjectURL(e.target.files[0]),
      });
      setImageData(e.target.files[0]);
      setImages(e.target.files[0]);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
        setErrors({
          image: "",
        });
      });
      reader.readAsDataURL(e.target.files[0]);
      if (e.target.files[0].name.split(".").pop() === "svga") {
        setIsSvga(true);
      } else {
        setIsSvga(false);
      }
    }
  };

  useEffect(() => {
    if (isSvga) {
      if (!!document.getElementById("svga") && imagePath) {
        var player = new SVGA.Player(`div[attr="${mongoId}"]`);
        var parser = new SVGA.Parser(`div[attr="${mongoId}"]`);
        if (imageData?.preview) {
          parser.load(imageData.preview, function (videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
            setTimeout(() => {
              captureAndSendImage(player, mongoId);
            }, 3000);
          });
        } else {
          parser.load(baseURL + DialogueData?.image, function (videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
            setTimeout(() => {
              captureAndSendImage(player, mongoId);
            }, 3000);
          });
        }
      }
    } else {
      setIsSubmit(false);
    }
  }, [imageData, isSvga, imagePath]);

  const captureAndSendImage = (player, index) => {
    return new Promise((resolve) => {
      player.pauseAnimation();

      const container = document.querySelector(`div[attr="${index}"]`);
      const canvas = document.createElement("canvas");

      // Set the desired width and height for the canvas
      const width = container?.offsetWidth;
      const height = container?.offsetHeight;

      canvas.width = width;
      canvas.height = height;

      html2canvas(container, {
        scale: 1,
        useCORS: true,
        backgroundColor: "rgba(0, 0, 0, 0)",
        onclone: (cloneDoc) => {
          const clonedCanvas = cloneDoc.querySelector(
            `div[attr="${index}"] canvas`,
          );
          clonedCanvas.style.backgroundColor = "transparent";
        },
      }).then((canvas) => {
        const data = canvas.toDataURL("image/png");
        canvas.toBlob((blob) => {
          resolve(blob);
          setImage(blob);
          setIsSubmit(false);
        }, "image/png");
      });
    });
  };
  const closePopup = () => {
    dispatch({ type: CLOSE_DIALOGUE_SIGN_REWARD });
    resetForm();
  };

  // const handleSubmit = () => {
  //   const errorsObj = {};

  //   if (!validity) errorsObj.validity = "Validity is required!";

  //   if (!name) errorsObj.name = "Name is required";
  //   if (!rewardDay) errorsObj.rewardDay = "Reward Day is required";
  //   if (!images && !DialogueData?.image) errorsObj.image = "Image is required";

  //   if (Object.keys(errorsObj).length > 0) {
  //     setErrors(errorsObj);
  //     return;
  //   }

  //   setErrors({});

  //   const formData = new FormData();
  //   formData.append("diamond", diamond);
  //   formData.append("name", name);
  //   formData.append("validity", validity);
  //   formData.append("validityType", validityType || "day");
  //   formData.append("rewardDay", rewardDay);
  //   if (images) formData.append("image", images);

  //   if (DialogueData) {
  //     props.updateSignReward(mongoId, formData);
  //     Toast("success", "Sign Reward Updated Successfully");
  //   } else {
  //     props.createSignReward(formData);
  //     Toast("success", "Sign Reward Created Successfully");
  //   }

  //   closePopup();
  // };

  // formData.append("rewardDay", rewardDay);

  const handleSubmit = async () => {
    if (!name || !validity || validity < 0) {
      const errors = {};
      if (!validity) errors.validity = "Validity is required!";
      if (validity < 0) errors.validity = "invalid value of validity";
      if (!name) errors.name = "Name is Required";
      if (images.length === 0) errors.images = "Please select an Image!";
      if (!rewardDay) errors.rewardDay = "Reward Day is required";
      return setErrors({ ...errors });
    } else {
      const formData = new FormData();

      formData.append("thumbnail", image);
      formData.append("validity", validity);
      formData.append("validityType", validityType ? validityType : "day");
      formData.append("diamond", diamond);
      formData.append("imageVideo", images);
      formData.append("rewardDay", rewardDay);
      formData.append("name", name);
      if (DialogueData) {
        props.updateSignReward(mongoId, formData);
      } else {
        props.createSignReward(formData);
      }
      closePopup();
    }
  };

  return (
    <Dialog open={Dialogue} onClose={closePopup} fullWidth maxWidth="xs">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle>
          <span className="text-danger font-weight-bold">Sign Reward</span>
        </DialogTitle>
        <IconButton onClick={closePopup}>
          <Tooltip title="Close">
            <Cancel className="text-danger" />
          </Tooltip>
        </IconButton>
      </div>
      <DialogContent>
        <form>
          <div className="row form-data-body">
            {/* Validity */}
            <div className="col-md-6 col-12">
              <div className="form-group">
                <label className="text-gray mb-2">Validity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  min="0"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                />
                {errors.validity && (
                  <div className="pl-1 text-left text-red">
                    {errors.validity}
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
                  <option value="Month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div className="col-md-6 col-12">
              <div className="form-group mt-2">
                <label className="text-gray mb-2">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <div className="pl-1 text-left text-red">{errors.name}</div>
                )}
              </div>
            </div>

            {/* Diamond */}
            <div className="col-md-6 col-12">
              <div className="form-group mt-2">
                <label className="text-gray mb-2">Diamond</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  placeholder="20"
                  value={diamond}
                  onChange={(e) => setDiamond(e.target.value)}
                />
                {errors.diamond && (
                  <div className="pl-1 text-left text-red">
                    {errors.diamond}
                  </div>
                )}
              </div>
            </div>

            {/* Reward Day Dropdown */}
            <div className="col-md-6 col-12">
              <div className="form-group mt-2">
                <label className="text-gray mb-2">Reward Day</label>
                <select
                  className="form-select form-control"
                  value={rewardDay}
                  onChange={(e) => setRewardDay(e.target.value)}
                >
                  <option value="">Select Day</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.rewardDay && (
                  <div className="pl-1 text-left text-red">
                    {errors.rewardDay}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="form-group mt-2">
                <label className="text-gray mb-2">Image Upload</label>
                <input
                  className="form-control"
                  type="file"
                  required=""
                  accept=".svga"
                  onChange={handleInputImage}
                />
                {errors.image && (
                  <div className="pl-1 text-left">
                    <Typography variant="caption" color="error">
                      {errors.image}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              {imagePath && (
                <>
                  {!isSvga ? (
                    <img
                      src={imagePath}
                      className="mt-3 rounded float-left mb-2"
                      height="100px"
                      width="100px"
                    />
                  ) : (
                    <>
                      <div
                        id="svga"
                        attr={mongoId}
                        style={{
                          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                          float: "left",
                          objectFit: "contain",
                          marginBottom: "28px",
                          overflow: "hidden",
                          marginRight: 15,
                          width: "350px",
                          height: "350px",
                        }}
                      ></div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-3">
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
              disabled={isSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { createSignReward, updateSignReward })(
  SignRewardDialogue,
);
