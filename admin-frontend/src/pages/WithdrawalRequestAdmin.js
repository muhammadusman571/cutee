import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWithdrawal,
  forwardWithdrawal,
  updateStatus,
  getAdmins,
} from "../store/withdrawal/action";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Male from "../assets/images/male.png";
import Pagination from "./Pagination";
import { Tooltip } from "@mui/material";

const WithdrawalRequest = () => {
  const dispatch = useDispatch();

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { admins = [] } = useSelector((state) => state.withdrawal);

  // ✅ APPROVE STATES
  const [approveModal, setApproveModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [receipt, setReceipt] = useState(null);

  // ✅ REJECT STATES (NEW)
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);

  const { withdrawal, total } = useSelector((state) => state.withdrawal);

  useEffect(() => {
    dispatch(getWithdrawal(activePage, rowsPerPage, search));
    dispatch(getAdmins());
  }, [activePage, rowsPerPage]);

  const handlePageChange = (pageNumber) => setActivePage(pageNumber);

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };
  console.log("admins", admins);
  const filteredAdmins = admins?.filter((a) => {
    return (
      a.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.uniqueId?.toString().includes(adminSearch)
    );
  });
  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light" style={{ color: "#e4eeff" }}>
              User
            </h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active " aria-current="page">
                  User Withdrawal
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body card-overflow pt-0">
          <table className="table table-striped mt-2 text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>User</th>
                <th>Unique ID</th>
                <th>Amount</th>
                <th>Bank</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Forwarded To</th>
                <th>Request To</th>
                <th>Action By</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {withdrawal?.length > 0 ? (
                withdrawal.map((data, index) => (
                  <tr key={data._id}>
                    <td>{index + 1}</td>

                    <td className="d-flex align-items-center">
                      <img
                        src={data.user?.image || Male}
                        height="40"
                        width="40"
                        style={{ borderRadius: "50%" }}
                      />
                      <span className="ms-2">{data.user?.name}</span>
                    </td>

                    <td>{data.user?.uniqueId}</td>

                    <td className="text-success">{data.amount}</td>

                    <td>
                      {data.bankDetails
                        ? Object.values(data.bankDetails)
                            .filter(Boolean)
                            .map((val, i) => <div key={i}>{val}</div>)
                        : "-"}
                    </td>

                    <td>{data.currency || "PKR"}</td>

                    <td>
                      <span className="badge bg-warning">{data.status}</span>
                    </td>
                    <td>
                      {data.forwardedTo
                        ? `${data.forwardedTo.name || "-"}`
                        : "-"}
                    </td>

                    <td>
                      {data.requestTo ? (
                        <>
                          {data.requestTo.name} (
                          {data.requestTo.role === "sub_coin_seller"
                            ? "Sub Seller"
                            : "Super Seller"}
                          )
                          <br />
                          ID: {data.requestTo.uniqueId}
                        </>
                      ) : (
                        "Owner"
                      )}
                    </td>

                    <td>{data.actionBy?.name || "-"}</td>

                    <td>{dayjs(data.createdAt).format("DD MMM YYYY")}</td>

                    <td>
                      {data.status === "pending" && (
                        <>
                          {/* FORWARD (UNCHANGED) */}

                          <div className="d-inline-block position-relative me-1">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === data._id ? null : data._id,
                                )
                              }
                            >
                              Forward
                            </button>

                            {openDropdown === data._id && (
                              <div
                                className="card shadow position-absolute"
                                style={{
                                  width: "280px",
                                  zIndex: 999,
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                }}
                              >
                                {/* SEARCH */}
                                <div className="p-2 border-bottom bg-light">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search name or ID..."
                                    value={adminSearch}
                                    onChange={(e) =>
                                      setAdminSearch(e.target.value)
                                    }
                                  />
                                </div>

                                {/* LIST */}
                                <div
                                  style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }}
                                >
                                  {filteredAdmins?.length > 0 ? (
                                    filteredAdmins.map((admin) => (
                                      <div
                                        key={admin._id}
                                        className={`d-flex justify-content-between align-items-center px-3 py-2 ${
                                          selectedAdmin?._id === admin._id
                                            ? "bg-primary text-white"
                                            : "bg-white"
                                        }`}
                                        style={{
                                          cursor: "pointer",
                                          borderBottom: "1px solid #f1f1f1",
                                          transition: "0.2s",
                                        }}
                                        onClick={() => setSelectedAdmin(admin)}
                                      >
                                        {/* SINGLE LINE TEXT */}
                                        <span style={{ fontSize: "14px" }}>
                                          {admin.name}{" "}
                                          <small>({admin.uniqueId})</small>
                                        </span>

                                        {/* SELECT ICON */}
                                        {selectedAdmin?._id === admin._id && (
                                          <i className="fas fa-check"></i>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center p-2 text-muted">
                                      No Admin Found
                                    </div>
                                  )}
                                </div>

                                {/* SUBMIT */}
                                <div className="p-2 border-top">
                                  <button
                                    className="btn btn-success btn-sm w-100"
                                    disabled={!selectedAdmin}
                                    onClick={() => {
                                      dispatch(
                                        forwardWithdrawal(
                                          data._id,
                                          selectedAdmin._id,
                                        ),
                                      );

                                      setOpenDropdown(null);
                                      setSelectedAdmin(null);
                                      setAdminSearch("");
                                    }}
                                  >
                                    Forward Request
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* APPROVE */}
                          <button
                            className="btn btn-success btn-sm me-1"
                            onClick={() => {
                              setSelectedId(data._id);
                              setApproveModal(true);
                            }}
                          >
                            Approve
                          </button>

                          {/* REJECT (UPDATED) */}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setRejectId(data._id);
                              setRejectModal(true);
                            }}
                          >
                            Reject
                          </button>
                          {data.requestTo &&
                            !data.isVisibleToSeller &&
                            !data.fromAdmin && (
                              <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() => {
                                  const formData = new FormData();
                                  formData.append("isVisibleToSeller", true);

                                  dispatch(updateStatus(data._id, formData));
                                }}
                              >
                                Show Request
                              </button>
                            )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            activePage={activePage}
            rowsPerPage={rowsPerPage}
            userTotal={total}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* ========================= */}
      {/* APPROVE MODAL */}
      {/* ========================= */}
      {approveModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Approve Request</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setApproveModal(false);
                    setSelectedId(null);
                    setReceipt(null);
                  }}
                />
              </div>

              <div className="modal-body">
                <p>Are you sure you want to approve?</p>

                <label>Upload Receipt</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setReceipt(e.target.files[0])}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setApproveModal(false);
                    setSelectedId(null);
                    setReceipt(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  disabled={!receipt}
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("status", "approved");
                    formData.append("receipt", receipt);

                    dispatch(updateStatus(selectedId, formData));

                    setApproveModal(false);
                    setSelectedId(null);
                    setReceipt(null);
                  }}
                >
                  Yes Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* REJECT MODAL */}
      {/* ========================= */}
      {rejectModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Reject Request</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setRejectModal(false);
                    setRejectId(null);
                  }}
                />
              </div>

              <div className="modal-body">
                <p className="text-danger fw-bold">
                  Are you sure you want to reject this request?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setRejectModal(false);
                    setRejectId(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("status", "rejected");

                    dispatch(updateStatus(rejectId, formData));

                    setRejectModal(false);
                    setRejectId(null);
                  }}
                >
                  Yes Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawalRequest;
