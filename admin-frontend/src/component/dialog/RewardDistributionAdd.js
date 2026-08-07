import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { CLOSE_DIALOGUE } from "../../store/RewardDistribution/type";
import { addRewardDistribution } from "../../store/RewardDistribution/action";

const RewardDistributionAdd = (props) => {
  const dispatch = useDispatch();
  const { dialogOpen: open, dialogData } = useSelector(
    (state) => state.coinSeller,
  );

  const [reward, setReward] = useState(0);
  const [timeType, setTimeType] = useState("hours");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [errors, setError] = useState({
    reward: "",
    timeValue: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    if (dialogData) {
      setReward(dialogData.reward || 0);
      setTimeType(dialogData.timeType || "hours");
      setDays(dialogData.days || 0);
      setHours(dialogData.hours || 0);
      setMinutes(dialogData.minutes || 0);
      setSeconds(dialogData.seconds || 0);
    }
  }, [dialogData]);

  const closePopup = () => dispatch({ type: CLOSE_DIALOGUE });

  const handleSubmit = () => {
    const error = {};
    const timeValue = timeType === "days" ? days : hours;

    if (!reward && reward !== 0) error.reward = "Reward is required!";
    else if (reward < 0) error.reward = "Enter a valid reward!";

    if (timeValue < 0) error.timeValue = `Enter valid ${timeType}!`;
    if (minutes < 0 || minutes > 59) error.minutes = "Minutes must be 0-59";
    if (seconds < 0 || seconds > 59) error.seconds = "Seconds must be 0-59";

    if (Object.keys(error).length) {
      setError(error);
      return;
    }

    const data = {
      reward: Number(reward),
      timeType,
      days: timeType === "days" ? Number(days) : 0,
      hours: timeType === "hours" ? Number(hours) : 0,
      minutes: Number(minutes),
      seconds: Number(seconds),
    };

    props.addRewardDistribution(data, () => {
      if (props.onSuccess) props.onSuccess();
    });
    dispatch({ type: CLOSE_DIALOGUE });
  };

  return (
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
        <span className="text-danger font-weight-bold h4">
          Reward Distribution
        </span>
      </DialogTitle>
      <IconButton style={{ position: "absolute", right: 0 }}>
        <Tooltip title="Close">
          <Cancel className="text-danger" onClick={closePopup} />
        </Tooltip>
      </IconButton>
      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <form>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label className="mb-2 mt-3 text-gray">Reward</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Reward"
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                  />
                  {errors.reward && (
                    <div className="ml-2 mt-1 pl-1 text__left text-red">
                      {errors.reward}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label className="mb-2 mt-3 text-gray">Time Type</label>
                  <select
                    className="form-control"
                    value={timeType}
                    onChange={(e) => setTimeType(e.target.value)}
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label className="mb-2 mt-3 text-gray">
                    {timeType === "hours" ? "Hours" : "Days"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder={timeType === "hours" ? "Hours" : "Days"}
                    value={timeType === "hours" ? hours : days}
                    onChange={(e) =>
                      timeType === "hours"
                        ? setHours(Number(e.target.value))
                        : setDays(Number(e.target.value))
                    }
                  />
                  {errors.timeValue && (
                    <div className="ml-2 mt-1 pl-1 text__left text-red">
                      {errors.timeValue}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label className="mb-2 mt-3 text-gray">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="form-control"
                    placeholder="Minutes"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                  />
                  {errors.minutes && (
                    <div className="ml-2 mt-1 pl-1 text__left text-red">
                      {errors.minutes}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label className="mb-2 mt-3 text-gray">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="form-control"
                    placeholder="Seconds"
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                  />
                  {errors.seconds && (
                    <div className="ml-2 mt-1 pl-1 text__left text-red">
                      {errors.seconds}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5">
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
      </DialogContent>
    </Dialog>
  );
};

export default connect(null, { addRewardDistribution })(RewardDistributionAdd);
