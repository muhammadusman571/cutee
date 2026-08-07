import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";
import noImage from "../../assets/images/noImage.png";
import { CLOSE_GIVE_UPLOAD_BADGE_DIALOGUE } from "../../store/uploadBadge/type";
import {
  getUploadBadge,
  giveUploadBadge,
} from "./../../store/uploadBadge/action";

const GiveUploadBadge = (props) => {
  const [data, setData] = useState([]);
  const [frameId, setFrameId] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSelect, setOpenSelect] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const dispatch = useDispatch();
  const { DialogueUploadBadge, userId, selectedBadges, uploadBadge } =
    useSelector((state) => state.uploadBadge);

  useEffect(() => {
    dispatch(getUploadBadge());
  }, [dispatch]);

  useEffect(() => {
    setData(uploadBadge);
  }, [uploadBadge]);

  useEffect(() => {
    if (DialogueUploadBadge && uploadBadge?.length) {
      const validIds = (selectedBadges || []).filter((id) => id);
      setFrameId(validIds);
    }
  }, [DialogueUploadBadge, selectedBadges, uploadBadge]);
  const closePopup = () => {
    dispatch({ type: CLOSE_GIVE_UPLOAD_BADGE_DIALOGUE });
    setFrameId([]);
    setErrors({});
    setInitialized(false);
  };

  const submit = async () => {
    if (!frameId.length) {
      setErrors({ frameId: "Please select at least one frame." });
      return;
    }
    setErrors({});
    props.giveUploadBadge(userId, frameId, true);

    dispatch({
      type: "UPDATE_USER_UPLOAD_BADGES",
      payload: {
        userId,
        uploadBadges: frameId,
      },
    });
  };

  // Remove one badge
  const handleRemoveBadge = (id) => {
    const updated = frameId.filter((fid) => fid !== id);
    setFrameId(updated);
    props.giveUploadBadge(userId, updated, false);
    dispatch({
      type: "UPDATE_USER_UPLOAD_BADGES",
      payload: {
        userId,
        uploadBadges: updated,
      },
    });
  };

  return (
    <Dialog
      open={DialogueUploadBadge}
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <span className="text-danger font-weight-bold h4">
          Give Upload Badge
        </span>
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
            <div className="form-group mt-4">
              <label className="text-gray mb-2">Select Frame</label>

              <div className="border p-2 rounded full-width">
                <Select
                  multiple
                  open={openSelect}
                  onOpen={() => setOpenSelect(true)}
                  onClose={() => setOpenSelect(false)}
                  value={frameId}
                  onChange={(e) => setFrameId(e.target.value)}
                  fullWidth
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {data
                        .filter((item) => selected.includes(item._id))
                        .map((item) => (
                          <Chip
                            key={item._id}
                            label={item.name}
                            onMouseDown={(e) => e.stopPropagation()}
                            onDelete={(e) => {
                              e.stopPropagation();
                              handleRemoveBadge(item._id);
                            }}
                            sx={{ backgroundColor: "#333", color: "white" }}
                          />
                        ))}
                    </Box>
                  )}
                >
                  {data.map((frame) => (
                    <MenuItem key={frame._id} value={frame._id}>
                      <Checkbox
                        checked={frameId.includes(frame._id)}
                        sx={{ color: "white" }}
                      />
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ color: "white" }}
                      >
                        <OfficialFrameBadge data={frame} />
                        <ListItemText primary={frame.name} />
                      </Box>
                    </MenuItem>
                  ))}

                  <MenuItem disableRipple disableTouchRipple>
                    <Box width="100%" textAlign="center">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => setOpenSelect(false)}
                      >
                        Done
                      </button>
                    </Box>
                  </MenuItem>
                </Select>
              </div>

              {errors.frameId && (
                <small className="text-danger">{errors.frameId}</small>
              )}
            </div>

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
                onClick={submit}
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

const OfficialFrameBadge = ({ data }) => {
  const svgaRef = useRef(null);

  useEffect(() => {
    if (data?.frame && data.frame.endsWith(".svga") && svgaRef.current) {
      const player = new SVGA.Player(svgaRef.current);
      const parser = new SVGA.Parser(svgaRef.current);
      parser.load(baseURL + data.frame, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }
  }, [data?.frame]);

  return (
    <div>
      {data?.frame && data.frame.endsWith(".svga") ? (
        <div
          ref={svgaRef}
          style={{ width: "60px", height: "60px", marginTop: 10 }}
        />
      ) : (
        <img
          src={data?.frame ? baseURL + data.frame : noImage}
          alt="Ranking Frame"
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
          className="rounded-circle my-auto"
        />
      )}
    </div>
  );
};

export default connect(null, { giveUploadBadge })(GiveUploadBadge);
