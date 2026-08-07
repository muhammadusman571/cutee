import React, { useEffect, useRef, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";
import SVGA from "svgaplayerweb";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

import { createReaction, editReaction } from "../../store/reaction/action";
import { CLOSE_REACTION_DIALOG } from "../../store/reaction/type";
import { baseURL } from "../../util/Config";

const ReactionDialog = (props) => {
  const dispatch = useDispatch();

  const { dialog: open, dialogData } = useSelector((state) => state.reaction);
  const [isSvga, setIsSvga] = useState(false);
  const [mongoId, setMongoId] = useState("");
  const [imageData, setImageData] = useState();
  const [imagePath, setImagePath] = useState();
  const [name, setName] = useState("");
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");

  const playerRef = useRef(null);
  const parserRef = useRef(null);
  // useEffect(() => {
  //   if (dialogData) {
  //     setMongoId(dialogData._id);
  //     setImagePath(dialogData.image);
  //   }
  // }, [dialogData]);

  useEffect(
    () => () => {
      setError("");
      setMongoId("");
      setImageData(null);
      setImagePath(null);
      setName("");
      setNameError("");
    },
    [open]
  );

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

      const attr = `gift-${mongoId || "new"}`;
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

  const HandleInputImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageData(files);

    setError("");

    const previewPromises = files.map((file) => {
      return new Promise((resolve) => {
        if (file.name.toLowerCase().endsWith(".svga")) {
          resolve({
            file,
            type: "svga",
            preview: URL.createObjectURL(file),
          });
        } else {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              file,
              type: "image",
              preview: reader.result,
            });
          reader.readAsDataURL(file);
        }
      });
    });

    Promise.all(previewPromises).then(setPreviews);
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_REACTION_DIALOG });
    setPreviews([])
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(imageData);
    
    if (!imageData || !imageData.length) {
      return setError("Image Required");
    } else if (!name) {
      return setNameError("Name Required");
    }
    const formData = new FormData();
    imageData.forEach((file) => {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith("svga")) {
        formData.append("svgaImage", file);
      } else {
        formData.append("image", file);
      }
    });
    formData.append("name", name);

    // if (mongoId) {
    //   props.editReaction(mongoId, formData);
    // } else {
    props.createReaction(formData);
    // }
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
          <span className="text-danger font-weight-bold h4">Reaction </span>
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
                <div className="form-group col-12 mt-3">
                  <label className="mb-2 text-gray">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value.trim());

                      if (!e.target.value) {
                        return setNameError("Name can't be a blank!");
                      } else {
                        return setNameError("");
                      }
                    }}
                  />
                  {nameError && (
                    <div className="ml-2 mt-1">
                      {nameError && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{nameError}</span>
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
                    accept="image/jpg,image/jpeg,image/png,image/gif,.svga"
                    required=""
                    onChange={HandleInputImage}
                    multiple
                  />
                  {error && (
                    <div className="ml-2 mt-1">
                      {error && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{error}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {previews.length > 0 && (
                    <div className="d-flex flex-wrap mt-2">
                      {previews.map((item, index) =>
                        item.type === "image" ? (
                          <img
                            key={index}
                            src={item.preview}
                            alt="preview"
                            height="70"
                            width="70"
                            style={{
                              borderRadius: 10,
                              marginRight: 10,
                              marginBottom: 10,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            key={index}
                            attr={`gift-${index}`}
                            style={{
                              width: 110,
                              height: 110,
                              marginRight: 10,
                              marginBottom: 10,
                              borderRadius: 10,
                            }}
                            ref={(el) => {
                              if (!el) return;
                              const player = new SVGA.Player(el);
                              const parser = new SVGA.Parser(el);
                              parser.load(item.preview, (videoItem) => {
                                player.setVideoItem(videoItem);
                                player.startAnimation();
                              });
                            }}
                          />
                        )
                      )}
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

export default connect(null, { createReaction, editReaction })(ReactionDialog);
