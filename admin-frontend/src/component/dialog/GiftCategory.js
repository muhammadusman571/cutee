import React, { useEffect, useState, useRef } from "react";

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
import { CLOSE_CATEGORY_DIALOG } from "../../store/giftCategory/types";

//action
import {
  createNewCategory,
  editCategory,
} from "../../store/giftCategory/action";
import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";

const GiftCategoryDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector(
    (state) => state.giftCategory
  );

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [isSvga, setIsSvga] = useState(false);

  const playerRef = useRef(null);
  const parserRef = useRef(null);

  const [errors, setError] = useState({
    image: "",
    name: "",
  });

  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData._id);
      setName(dialogData.name);
      setImagePath(baseURL + dialogData.image);
      // If existing file ends with .svga mark as svga
      if (dialogData?.image?.split?.(".")?.pop() === "svga") {
        setIsSvga(true);
      } else {
        setIsSvga(false);
      }
    }
  }, [dialogData]);

  useEffect(() => {
    // render SVGA when needed
    if (isSvga && imagePath) {
      // cleanup previous
      if (playerRef.current) {
        try {
          playerRef.current.clear();
        } catch (e) {}
        playerRef.current = null;
        parserRef.current = null;
      }

      const attr = `cat-${mongoId || "new"}`;
      const player = new SVGA.Player(`div[attr="${attr}"]`);
      const parser = new SVGA.Parser(`div[attr="${attr}"]`);
      playerRef.current = player;
      parserRef.current = parser;

      // imageData may have preview (local file), otherwise use imagePath
      const source = imageData?.preview ? imageData.preview : imagePath;
      parser.load(source, function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    } else {
      // if not svga, ensure any player is cleared
      if (playerRef.current) {
        try {
          playerRef.current.clear();
        } catch (e) {}
        playerRef.current = null;
        parserRef.current = null;
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.clear();
        } catch (e) {}
        playerRef.current = null;
        parserRef.current = null;
      }
    };
  }, [isSvga, imagePath, imageData, mongoId]);

  useEffect(
    () => () => {
      setError({
        image: "",
        name: "",
      });
      setMongoId("");
      setName("");
      setImageData(null);
      setImagePath(null);
      setIsSvga(false);
      if (playerRef.current) {
        try {
          playerRef.current.clear();
        } catch (e) {}
        playerRef.current = null;
        parserRef.current = null;
      }
    },
    [open]
  );

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      // attach preview for local svga like in AddSvgaDialogue
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setImageData(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(file);

      if (file.name.split(".").pop() === "svga") {
        setIsSvga(true);
      } else {
        setIsSvga(false);
      }
    }
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_CATEGORY_DIALOG });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = {};
    if (!mongoId && (!name || !imagePath)) {
      if (!name) error.name = "Name is Required!";
      if (!imageData || !imagePath) error.image = "Image is Required!";

      return setError({ ...error });
    }
    if (mongoId && (!name || !imagePath)) {
      if (!name) error.name = "Name is Required!";
      if (!imageData && !imagePath) error.image = "Image is Required!";
      return setError({ ...error });
    }

    const formData = new FormData();

    formData.append("image", imageData);
    formData.append("name", name);

    if (mongoId) {
      props.editCategory(mongoId, formData);
    } else {
      props.createNewCategory(formData);
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
          <span className="text-danger font-weight-bold h4"> Category </span>
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
                  <label className="mb-2 text-gray">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required=""
                    placeholder="Magic"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...errors,
                          name: "Name is Required!",
                        });
                      } else {
                        return setError({
                          ...errors,
                          name: "",
                        });
                      }
                    }}
                  />
                  {errors.name && (
                    <div className="ml-2 mt-1">
                      {errors.name && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group mt-4">
                  <label className="mb-2 text-gray">Image</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/jpg ,image/jpeg ,image/png,.svga"
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
                      {!isSvga ? (
                        <img
                          height="70px"
                          width="70px"
                          alt="app"
                          src={imagePath}
                          style={{
                            borderRadius: 10,
                            marginTop: 10,
                            float: "left",
                          }}
                        />
                      ) : (
                        <div
                          id="svga-cat"
                          attr={`cat-${mongoId || "new"}`}
                          style={{
                            boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
                            float: "left",
                            objectFit: "contain",
                            marginRight: 15,
                            width: "110px",
                            marginTop: 10,
                            height: "110px",
                            borderRadius: 10,
                          }}
                        ></div>
                      )}
                    </>
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

export default connect(null, { createNewCategory, editCategory })(
  GiftCategoryDialog
);