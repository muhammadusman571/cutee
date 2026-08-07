import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

import { createCoinSeller } from "../../store/super-coin-seller/action";
import { CLOSE_COIN_SELLER_DIALOG } from "../../store/super-coin-seller/types";

const CoinSellerDialog = (props) => {
  const dispatch = useDispatch();

  const { coinSellerDialog: open } = useSelector(
    (state) => state.superCoinSeller,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);

  const [errors, setErrors] = useState({});

  // RESET ON CLOSE
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setCoinAmount(0);
      setErrors({});
    }
  }, [open]);

  const closePopup = () => {
    dispatch({ type: CLOSE_COIN_SELLER_DIALOG });
  };

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    let validation = {};

    if (!name) validation.name = "Name is required!";
    if (!email) validation.email = "Email is required!";
    if (email && !isValidEmail(email)) validation.email = "Invalid email!";
    if (!password) validation.password = "Password is required!";

    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    props.createCoinSeller({
      name,
      email,
      password,
      coinAmount,
 
    });

    closePopup();
  };

  return (
    <Dialog open={open} onClose={closePopup} fullWidth maxWidth="xs">
      {/* TITLE */}
      <DialogTitle>
        <span className="text-danger fw-bold h4">Add Coin Seller</span>
      </DialogTitle>

      {/* CLOSE ICON */}
      <IconButton style={{ position: "absolute", right: 8, top: 8 }}>
        <Tooltip title="Close">
          <Cancel className="text-danger" onClick={closePopup} />
        </Tooltip>
      </IconButton>

      {/* BODY */}
      <DialogContent>
        <div className="modal-body pt-1 px-1 pb-3">
          <form autoComplete="off">
            {/* NAME */}
            <div className="form-group">
              <label className="mb-2 text-gray">Name</label>
              <input
                className="form-control"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* EMAIL */}
            <div className="form-group mt-3">
              <label className="mb-2 text-gray">Email</label>
              <input
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-group mt-3">
              <label className="mb-2 text-gray">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {/* COIN AMOUNT */}
            <div className="form-group mt-3">
              <label className="mb-2 text-gray">Coin Amount</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Coin"
                value={coinAmount}
                onChange={(e) => {
                  setCoinAmount(e.target.value);
                  setErrors({ ...errors, coinAmount: "" });
                }}
              />
              {errors.coinAmount && (
                <small className="text-danger">{errors.coinAmount}</small>
              )}
            </div>

            {/* BUTTONS */}
            <div className="mt-4 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closePopup}
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-danger"
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

export default connect(null, { createCoinSeller })(CoinSellerDialog);
