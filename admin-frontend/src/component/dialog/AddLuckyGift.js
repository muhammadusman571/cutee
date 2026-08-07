import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_LUCKY_GIFT_DIALOG } from "../../store/gift/types";
import { Cancel } from "@mui/icons-material";
import { createNewLuckyGift } from "../../store/gift/action";

const AddLuckyGiftDialogue = () => {
  const dispatch = useDispatch();

  // ✅ FIXED SELECTORS
  const open = useSelector((state) => state.gift.luckyDialog);
  const luckyData = useSelector((state) => state.gift.luckyDialogData);

  const [percentage, setPercentage] = useState(10);
  const [error, setError] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  // ✅ FIX: reset when modal opens
  useEffect(() => {
    if (open) {
      setPercentage(luckyData?.percentage ?? 10);
      setError("");
    }
  }, [open, luckyData]);

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (percentage < 10 || percentage > 90) {
      setError("Percentage must be between 10 and 90");
      return;
    }

    setIsSubmit(true);
    setError("");

    try {
      await dispatch(createNewLuckyGift({ percentage }));
      closePopup();
    } catch (err) {
      setError(err?.message || "Something went wrong!");
    } finally {
      setIsSubmit(false);
    }
  };

  // ✅ CLOSE RESET FIX
  const closePopup = () => {
    setPercentage(10);
    setError("");
    dispatch({ type: CLOSE_LUCKY_GIFT_DIALOG });
  };

  return (
    <Dialog
      open={open}
      onClose={closePopup}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#1e1e2f",
          color: "#ffffff",
        },
      }}
    >
      <DialogTitle>
        Lucky Gift Percentage
        <IconButton
          style={{ position: "absolute", right: 0 }}
          onClick={closePopup}
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" />
          </Tooltip>
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="form-group">
          <label>Percentage (10-90)</label>

          <input
            type="number"
            className="form-control"
            value={percentage}
            min={10}
            max={90}
            onChange={(e) => {
              setPercentage(Number(e.target.value));
              setError("");
            }}
          />

          {error && <div className="text-danger mt-1">{error}</div>}
        </div>

        <div className="mt-3 text-end">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={closePopup}
            disabled={isSubmit}
          >
            Close
          </button>

          <button
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={isSubmit}
          >
            {isSubmit ? "Saving..." : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLuckyGiftDialogue;
