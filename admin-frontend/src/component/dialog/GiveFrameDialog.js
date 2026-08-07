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
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { baseURL } from "../../util/Config";
import SVGA from "svgaplayerweb";
import {
  getOfficialFrames,
  giveOfficialFrame,
} from "../../store/OfficialFrames/action";
import { CLOSE_GIVE_OFFICIAL_FRAME_DIALOGUE } from "../../store/OfficialFrames/type";
import noImage from "../../assets/images/noImage.png";
const GiveOfficialFrameDialog = (props) => {
  const [data, setData] = useState([]);
  const [frameId, setFrameId] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { DialogueGiveFrame, userId, officialFrames } = useSelector(
    (state) => state.officialFrames
  );
  const closePopup = () => {
    dispatch({ type: CLOSE_GIVE_OFFICIAL_FRAME_DIALOGUE });
    setFrameId(null);
    setErrors({});
  };

  useEffect(() => {
    dispatch(getOfficialFrames());
  }, [dispatch]);

  useEffect(() => {
    setData(officialFrames);
  }, [officialFrames]);

  const submit = async () => {
    if (!frameId) {
      setErrors({ frameId: "Please select a frame." });
      return;
    }
    setErrors({});
    props.giveOfficialFrame(userId, frameId);
  };
  return (
    <Dialog
      open={DialogueGiveFrame}
      aria-labelledby="official-frame-dialog"
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="official-frame-dialog">
        <span className="text-danger font-weight-bold h4">Give Frame</span>
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
                  label="Select Frame"
                  value={frameId || ""}
                  onChange={(e) => setFrameId(e.target.value)}
                  fullWidth
                >
                  {data.map((frame) => (
                    <MenuItem key={frame._id} value={frame._id}>
                      <Box display="flex" alignItems="center" gap={1} className="text-white">
                        {/* thumbnail / svga preview */}
                        <OfficialFrameBadge data={frame} />
                        {frame.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </div>
              {errors.frameId && (
                <small className="text-red">{errors.frameId}</small>
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
          style={{
            width: "60px",
            height: "60px",
            marginTop: 10,
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={data?.frame ? baseURL + data.frame : noImage}
          alt="Ranking Frame"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
          }}
          className="rounded-circle my-auto"
        />
      )}
    </div>
  );
};

export default connect(null, { giveOfficialFrame })(GiveOfficialFrameDialog);
