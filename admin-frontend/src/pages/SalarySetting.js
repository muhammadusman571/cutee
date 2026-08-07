import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useDispatch, useSelector } from "react-redux";

import {
  getSalarySettings,
  createSalarySetting,
  updateSalarySetting,
  deleteSalarySetting,
} from "../store/salarySettings/action";

export default function SalarySettings() {
  const dispatch = useDispatch();

  const rows = useSelector((state) => state.salarySetting.salarySettings);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // --------------------------
  // Load Salary Settings
  // --------------------------
  useEffect(() => {
    dispatch(getSalarySettings());
  }, [dispatch]);

  // --------------------------
  // Open Modal
  // --------------------------
  const handleOpenModal = (row = null) => {
    setEditData(
      row || {
        _id: null,
        target: "",
        diamond_share: "",
        basic_salary: "",
        agency_share: "",
        days: "",
        // hours: "",
      }
    );
    setOpenModal(true);
  };

  // --------------------------
  // Save Record
  // --------------------------
  const handleSave = async () => {
    const payload = {
      target: Number(editData.target),
      diamond_share: Number(editData.diamond_share),
      basic_salary: Number(editData.basic_salary),
      agency_share: Number(editData.agency_share),
      days: Number(editData.days) || 0,
      // hours: Number(editData.hours) || 0,
      applyDays: Boolean(editData.applyDays) || true,
    };

    if (editData._id) {
      dispatch(updateSalarySetting(editData._id, payload));
    } else {
      const success = await dispatch(createSalarySetting(payload));
      if (!success) return;
    }

    setOpenModal(false);
  };

  const handleChangeApplyDays = (row) => {
    dispatch(updateSalarySetting(row._id, { applyDays: !row.applyDays }));
  };

  // --------------------------
  // Delete Confirm
  // --------------------------
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSalarySetting(deleteId));
    setOpenDeleteConfirm(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal()}
        className="btn btn-danger bg-danger mb-3"
      >
        Add New
      </Button>

      <TableContainer component={Paper}>
        <Table>
          {/* TABLE HEADER */}
          <TableHead className="bg-danger">
            <TableRow>
              <TableCell className="text-white">
                <b>Target</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Diamond Share</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Basic Salary</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Total Salary</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Agency Share</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Days</b>
              </TableCell>
              <TableCell className="text-white">
                <b>Apply Days</b>
              </TableCell>

              <TableCell className="text-white">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody className="bg-danger-dark">
            {rows?.map((row) => (
              <TableRow key={row._id}>
                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  {row.target}
                </TableCell>

                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  ${row.diamond_share}
                </TableCell>

                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  ${row.basic_salary}
                </TableCell>

                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  ${row.basic_salary + row.diamond_share}
                </TableCell>

                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  ${row.agency_share}
                </TableCell>

                <TableCell
                  className="text-white"
                  onDoubleClick={() => handleOpenModal(row)}
                >
                  {row.days} Days
                </TableCell>
                <TableCell>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={row?.applyDays}
                      onChange={() => {
                        handleChangeApplyDays(row);
                      }}
                    />
                    <span className="slider">
                      <p
                        style={{
                          fontSize: 12,
                          marginLeft: `${row?.applyDays ? "5px" : "35px"}`,
                          color: "#000",
                          marginTop: "6px",
                        }}
                      >
                        {row?.applyDays ? "Yes" : "NO"}
                      </p>
                    </span>
                  </label>
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenModal(row)}>
                      <EditIcon className="text-warning" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteClick(row._id)}>
                      <DeleteIcon className="text-danger" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ------------------ Modal ------------------ */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle className="bg-danger text-white">
          {editData?._id ? "Edit Record" : "Add New Record"}
        </DialogTitle>

        <DialogContent className="bg-light">
          <TextField
            label="Target"
            fullWidth
            margin="dense"
            type="number"
            value={editData?.target}
            onChange={(e) =>
              setEditData({ ...editData, target: e.target.value })
            }
          />
          <TextField
            label="Diamond Share"
            fullWidth
            margin="dense"
            type="number"
            value={editData?.diamond_share}
            onChange={(e) =>
              setEditData({ ...editData, diamond_share: e.target.value })
            }
          />
          <TextField
            label="Basic Salary"
            fullWidth
            margin="dense"
            type="number"
            value={editData?.basic_salary}
            onChange={(e) =>
              setEditData({ ...editData, basic_salary: e.target.value })
            }
          />

          <TextField
            label="Agency Share"
            fullWidth
            margin="dense"
            type="number"
            value={editData?.agency_share}
            onChange={(e) =>
              setEditData({ ...editData, agency_share: e.target.value })
            }
          />
          {/* <div className="d-flex gap-2 "> */}
          <TextField
            label="Days"
            fullWidth
            margin="dense"
            type="number"
            value={editData?.days}
            onChange={(e) => setEditData({ ...editData, days: e.target.value })}
          />
          {/* <TextField
              label="Hours"
              fullWidth
              margin="dense"
              type="number"
              value={editData?.hours}
              onChange={(e) =>
                setEditData({ ...editData, hours: e.target.value })
              }
            /> */}
          {/* </div> */}
        </DialogContent>

        <DialogActions className="bg-light">
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            className="btn btn-danger bg-danger"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------ Delete Confirm ------------------ */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
      >
        <DialogTitle className="bg-danger text-white">
          Delete Record?
        </DialogTitle>

        <DialogContent className="bg-light">
          Are you sure you want to delete this record?
        </DialogContent>

        <DialogActions className="bg-light">
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button
            className="btn btn-danger bg-danger"
            variant="contained"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
