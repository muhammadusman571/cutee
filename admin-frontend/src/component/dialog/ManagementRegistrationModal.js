import React, { useEffect, useState } from "react";

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
import { registerManagement } from "../../store/admin/action";
import { TOGGLE_MANAGEMENT_DIALOG } from "../../store/admin/types";

const ManagementDialog = (props) => {
  const dispatch = useDispatch();

  const { managementDialog: open } = useSelector((state) => state.admin);

  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   useEffect(() => {
  //     if (dialogData) {
  //       setMongoId(dialogData._id);
  //       setName(dialogData.name);
  //       setEmail(dialogData.email);
  //       setPassword("");
  //     }
  //   }, [dialogData]);

  useEffect(
    () => () => {
      setErrors({ name: "", email: "", password: "" });
      setMongoId("");
      setName("Admin");
      setEmail("");
      setPassword("");
    },
    [open]
  );

  const closePopup = () => {
    dispatch({ type: TOGGLE_MANAGEMENT_DIALOG });
  };

  const isValidEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = {};

    if (!name) validation.name = "Name is required!";
    if (!email) validation.email = "Email is required!";
    if (email && !isValidEmail(email)) validation.email = "Invalid email!";
    if (!mongoId && !password)
      validation.password = "Password is required for new registration!";

    if (Object.keys(validation).length > 0) {
      return setErrors(validation);
    }

    if (mongoId) {
      props.editManagement(mongoId, { name, email, password });
    } else {
      props.registerManagement({ name, email, password });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4">
            Management Registration
          </span>
        </DialogTitle>

        <IconButton style={{ position: "absolute", right: 0 }}>
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>

        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <form autoComplete="off">
              {/* NAME */}
              <div className="form-group">
                <label className="mb-2 text-gray">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  placeholder="Admin"
                  autoComplete="off"
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" });
                  }}
                />
                {errors.name && (
                  <div className="text-red mt-1">{errors.name}</div>
                )}
              </div>

              {/* EMAIL */}
              <div className="form-group mt-4">
                <label className="mb-2 text-gray">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  placeholder="example@gmail.com"
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email && (
                  <div className="text-red mt-1">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="form-group mt-4">
                <label className="mb-2 text-gray">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  autoComplete="off"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                />
                {errors.password && (
                  <div className="text-red mt-1">{errors.password}</div>
                )}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  className="btn btn-outline-info ml-2 btn-round float__right"
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
    </>
  );
};

export default connect(null, { registerManagement })(ManagementDialog);
