/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

// react dropzone
import ReactDropzone from "react-dropzone";

// action
import { createNewTheme, editTheme } from "../../store/Theme/theme.action";

//types
import { CLOSE_THEME_DIALOG } from "../../store/Theme/theme.type";

import { baseURL } from "../../util/Config";

//serverPath

const ThemeDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.theme);

  const [images, setImages] = useState([]);
  const [mongoId, setMongoId] = useState("");

  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [diamond, setDiamond] = useState("");

  const [errors, setError] = useState({
    image: "",
    validity: "",
    validityType: "",
    diamond: "",
  });

  useEffect(() => {
    setError({
      image: "",
      validity: "",
      validityType: "",
      diamond: "",
    });

    setImages([]);
  }, []);

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setImagePath(baseURL + dialogData.theme);
      setValidity(dialogData?.validity);
      setValidityType(dialogData?.validityType);
      setDiamond(dialogData?.diamond);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        image: "",
        validity: "",
        validityType: "",
        diamond: "",
      });
      setImages([]);
      setValidity("");
      setValidityType("");
      setDiamond("");
      setMongoId("");
    },
    [open]
  );

  const onPreviewDrop = (files) => {
    setError({ ...errors, image: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(images.concat(files));
  };

  const removeImage = (file) => {
    if (file.preview) {
      const image = images.filter((ele) => {
        return ele.preview !== file.preview;
      });
      setImages(image);
    }
  };

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_THEME_DIALOG });
  };

  const validateForm = () => {
    const errs = {};

    // If creating new (no mongoId)
    if (!mongoId) {
      if (images.length === 0) errs.image = "Theme is required!";
    } else {
      // Editing existing one
      if (!imageData && !imagePath) errs.image = "Theme is required!";
    }

    // Validity checks
    if (validity === "" || validity === null || validity === undefined)
      errs.validity = "Validity is required!";
    else if (validity < 0) errs.validity = "Invalid value for validity!";

    // Diamond checks
    if (diamond === "" || diamond === null || diamond === undefined)
      errs.diamond = "Diamond is required!";
    else if (diamond < 0) errs.diamond = "Invalid diamond value!";

    // Validity Type checks
    if (!validityType) errs.validityType = "Validity Type is required!";
    else if (validityType < 0) errs.validityType = "Invalid Validity Type!";

    // If there are any errors, set them and stop
    if (Object.keys(errs).length > 0) {
      setError(errs);
      console.log(errs);
      return false;
    }
    console.log(true);

    // If everything passes
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(errors);

    const formData = new FormData();
    formData.append("diamond", diamond);
    formData.append("validity", validity);
    formData.append("validityType", validityType ? validityType : "day");
    if (!mongoId) {
      for (let i = 0; i < images.length; i++) {
        formData.append("theme", images[i]);
      }

      props.createNewTheme(formData);
    } else {
      formData.append("theme", imageData);
      props.editTheme(formData, mongoId);
    }
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
          <span className="text-danger font-weight-bold h4"> Theme </span>
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
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
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
                        return setError((prev) => ({
                          ...prev,
                          validity: "Validity is Required!",
                        }));
                      } else {
                        setError((prev) => ({ ...prev, validity: "" }));
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
                <div className="form-group">
                  <label className="text-gray mb-2">Validity Type</label>
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    value={validityType}
                    onChange={(e) => {
                      setValidityType(e.target.value);
                      if (!e.target.value) {
                        return setError((prev) => ({
                          ...prev,
                          validityType: "Validity Type is Required!",
                        }));
                      } else {
                        setError((prev) => ({ ...prev, validityType: "" }));
                      }
                    }}
                  >
                    <option value="">select</option>
                    <option value="day">Day</option>
                    <option value="Month">Month</option>
                    <option value="year">Year</option>
                  </select>
                  {errors.validityType && (
                    <div className="ml-2 mt-1">
                      {errors.validityType && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.validityType}</span>
                        </div>
                      )}
                    </div>
                  )}
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
                        return setError((prev) => ({
                          ...prev,
                          diamond: "diamond is Required!",
                        }));
                      } else {
                        setError((prev) => ({ ...prev, diamond: "" }));
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
                {mongoId ? (
                  <div className="form-group">
                    <label className="mb-2 text-gray">Theme</label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      accept="image/jpg ,image/jpeg ,image/png"
                      required=""
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
                    {imagePath && (
                      <>
                        <img
                          height="70px"
                          width="70px"
                          alt="app"
                          src={imagePath}
                          style={{
                            boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                            // border: "2px solid #fff",
                            borderRadius: 10,
                            marginTop: 10,
                            float: "left",
                            objectFit: "cover",
                          }}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="row">
                    <label
                      className="form-control-label text-gray"
                      htmlFor="input-username"
                    >
                      Select (Multiple) Image
                    </label>
                    <div className="col-lg-12 text-left">
                      <>
                        <ReactDropzone
                          onDrop={(acceptedFiles) =>
                            onPreviewDrop(acceptedFiles)
                          }
                          accept="image/*"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div
                                  style={{
                                    height: 130,
                                    width: 130,
                                    border: "2px dashed gray",
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <i
                                    className="fas fa-plus"
                                    style={{ paddingTop: 30, fontSize: 70 }}
                                  ></i>
                                </div>
                              </div>
                            </section>
                          )}
                        </ReactDropzone>

                        {errors.image && (
                          <div className="ml-2 mt-1">
                            {errors.image && (
                              <div className="pl-1 text__left">
                                <span className="text-red">{errors.image}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                    <div className="col-lg-12 mt-4">
                      {images.length > 0 && (
                        <>
                          {images.map((file, index) => {
                            return (
                              file.type?.split("image")[0] === "" && (
                                <>
                                  <img
                                    height="60px"
                                    width="60px"
                                    alt="app"
                                    src={file.preview}
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                      border: "2px solid #fff",
                                      borderRadius: 10,
                                      marginTop: 10,
                                      float: "left",
                                      objectFit: "contain",
                                      marginRight: 15,
                                    }}
                                  />
                                  <div
                                    className="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  >
                                    <i
                                      className="fas fa-times-circle text-danger"
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "4px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => removeImage(file)}
                                    ></i>
                                  </div>
                                </>
                              )
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className={mongoId ? "mt-5 pt-5" : "mt-4"}>
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    type="button"
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

export default connect(null, { createNewTheme, editTheme })(ThemeDialog);
