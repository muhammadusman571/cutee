/* eslint-disable no-mixed-operators */
import React, { useEffect, useRef, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

//types
import { CLOSE_GIFT_DIALOG } from "../../../store/gift/types";

//action
import { editGift } from "../../../store/gift/action";
import { getCategory } from "../../../store/giftCategory/action";

// server path
import { baseURL } from "../../../util/Config";

import SVGA from "svgaplayerweb";
import { Cropper } from "react-advanced-cropper";
import html2canvas from "html2canvas";
import { Fragment } from "react";

const GiftDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.gift);

  const GiftClick = sessionStorage.getItem("GiftClick");

  const [mongoId, setMongoId] = useState("");
  const [coin, setCoin] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [type, setType] = useState(0);
  const [isSvga, setIsSvga] = useState(true);
  const [image, setImage] = useState("");
  const [cropper, setCropper] = useState(null);
  const [isSubmit, setIsSubmit] = useState(true);
  const [thumbnail, setThumbnail] = useState();
  const imageRef = useRef(null);

  const categoryDetail = JSON.parse(sessionStorage.getItem("Category"));

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const categories = useSelector((state) => state.giftCategory.giftCategory);

  const [errors, setError] = useState({
    image: "",
    coin: "",
    category: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData?._id);
      setCoin(dialogData?.coin);
      setCategory(dialogData?.category._id);
      setImagePath(baseURL + dialogData?.image);
      if (dialogData?.image?.split(".")?.pop() === "svga") {
        setIsSvga(true);
      }
    }
  }, [dialogData]);

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setCoin(dialogData.coin);
      setCategory(
        GiftClick === null ? dialogData.category._id : dialogData.category
      );
      setImagePath(baseURL + dialogData.image);
    }
  }, [dialogData, GiftClick]);

  useEffect(
    () => () => {
      setError({
        image: "",
        coin: "",
        category: "",
      });
      setCategory("");
      setCoin("");
      setImageData(null);
      setImagePath(null);
      setIsSubmit(true);
      setIsSvga(false);
    },
    [open]
  );

  const HandleInputImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      setError({ ...errors, image: "You can upload only 2 files!" });
      return;
    }

    const updatedImages = files.map((file) => {
      Object.assign(file, { preview: URL.createObjectURL(file) });
      return file;
    });

    setImages(updatedImages);
    setImageData(updatedImages);
    setError({ ...errors, image: "" });

    // Check if any of them is svga to trigger animation preview
    if (updatedImages.some((file) => file.name.split(".").pop() === "svga")) {
      setIsSvga(true);
    } else {
      setIsSvga(false);
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_GIFT_DIALOG });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Validation
    const validationErrors = {};
    if (!coin) validationErrors.coin = "Coin is Required!";
    if (images.length === 0)
      validationErrors.image = "Please select at least one Image!";
    if (images.length > 2)
      validationErrors.image = "You can upload a maximum of 2 images!";
    if (GiftClick !== null && (!category || category === "Select Category")) {
      validationErrors.category = "Please select a Category!";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    if (!/^\d+$/.test(coin)) {
      setError({ ...errors, coin: "Invalid Coin!!" });
      return;
    }

    imageData.forEach((file) => {
      const fileName = file.name.toLowerCase();

      if (fileName.includes("background")) {
        formData.append("backgroundImage", file);
      } else if (fileName.endsWith("svga")) {
        formData.append("image", file);
      } else {
        formData.append("thumbnail", file);
      }
    });

    formData.append("coin", coin);
    formData.append("type", type);
    if (GiftClick !== null) {
      formData.append("category", category);
    }

    // Debug: check FormData entries before sending
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    props.editGift(formData, mongoId);
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const onChange = (cropperRef) => {
    setCropper(cropperRef);
  };

  useEffect(() => {
    if (isSvga && images.length > 0) {
      images.forEach((file, index) => {
        if (file.name.split(".").pop() === "svga") {
          const containerId = `svga-${index}`;
          const player = new SVGA.Player(`#${containerId}`);
          const parser = new SVGA.Parser(`#${containerId}`);
          parser.load(file.preview, function (videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
          });
        }
      });
      setIsSubmit(false);
    } else {
      setIsSubmit(false);
    }
  }, [images, isSvga]);

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
            `div[attr="${index}"] canvas`
          );
          clonedCanvas.style.backgroundColor = "transparent";
        },
      }).then((canvas) => {
        const data = canvas.toDataURL("image/png");
        canvas.toBlob((blob) => {
          resolve(blob);
          setThumbnail(blob);
          setIsSubmit(false);
        }, "image/png");
      });
    });
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Gift </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 0,
          }}
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent style={{ overflowY: "auto" }}>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              {isSvga && (
                <div
                  style={{ position: "absolute", opacity: "0", zIndex: "-111" }}
                >
                  <Cropper
                    defaultCoordinates={{
                      height: 221,
                      left: 77,
                      top: 128,
                      width: 192,
                    }}
                    src={image}
                    onChange={onChange}
                    className={"cropper"}
                  />
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Original"
                    style={{ display: "none" }}
                  />
                </div>
              )}

              <form>
                <div className="form-group">
                  <label className="mb-2 text-gray">Coin</label>
                  <input
                    type="number"
                    className="form-control"
                    required=""
                    placeholder="20"
                    value={coin}
                    onChange={(e) => {
                      setCoin(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          coin: "Coin is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          coin: "",
                        });
                      }
                    }}
                  />
                  {errors.coin && (
                    <div className="ml-2 mt-1">
                      {errors.coin && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.coin}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="text-gray mb-2">Category</label>
                  {GiftClick === null ? (
                    <input
                      type="text"
                      className="form-control"
                      required=""
                      placeholder="Category Name"
                      disabled
                      value={categoryDetail.name}
                    />
                  ) : (
                    <>
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (e.target.value === "Select Category") {
                            return setError({
                              ...errors,
                              category: "Please select a Category!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              category: "",
                            });
                          }
                        }}
                      >
                        <option value="Select Category" selected>
                          Select Category
                        </option>
                        {categories.map((category) => {
                          return (
                            <option value={category._id}>
                              {category.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors.category && (
                        <div className="ml-2 mt-1">
                          {errors.category && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.category}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Select Image or GIF</label>
                  <input
                    className="form-control"
                    type="file"
                    accept=".svga, .gift, .png, .jpg, .jpeg"
                    multiple
                    onChange={HandleInputImage}
                  />
                  {errors.image && (
                    <div className="ml-2 mt-1">
                      {errors.image && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {images.length > 0 && (
                    <div className="d-flex flex-wrap mt-3">
                      {images.map((file, index) => (
                        <Fragment key={index}>
                          {file.name.split(".").pop() === "svga" ? (
                            <div
                              id={`svga-${index}`}
                              attr={`${mongoId}-${index}`}
                              style={{
                                boxShadow:
                                  "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                float: "left",
                                objectFit: "contain",
                                marginRight: 15,
                                width: "150px",
                                marginBottom: "10px",
                                height: "150px",
                              }}
                            ></div>
                          ) : (
                            <img
                              src={file.preview}
                              className="rounded mr-2 mb-2"
                              height="100px"
                              width="100px"
                              alt={`preview-${index}`}
                            />
                          )}
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
                <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={isSvga ? isSubmit : false}
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { editGift, getCategory })(GiftDialog);
