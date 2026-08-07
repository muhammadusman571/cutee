import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWithdrawal,
  forwardWithdrawal,
  updateStatus,
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

  // ✅ NEW STATES (ONLY ADDED)
  const [approveModal, setApproveModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const { withdrawal, total } = useSelector((state) => state.withdrawal);

  useEffect(() => {
    dispatch(getWithdrawal(activePage, rowsPerPage, search));
  }, [activePage, rowsPerPage]);

  const handlePageChange = (pageNumber) => setActivePage(pageNumber);

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Withdrawal Request</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav className="breadcrumb-header float-start float-lg-end">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Withdrawal Request</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped text-center">
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
                    <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

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

                    <td className="text-success">Rs. {data.amount}</td>

                    <td>
                      {data.bankDetails
                        ? Object.values(data.bankDetails)
                            .filter(Boolean)
                            .map((val, i) => <div key={i}>{val}</div>)
                        : "-"}
                    </td>

                    <td>{data.currency || "PKR"}</td>

                    <td>
                      <span
                        className={`badge bg-${
                          data.status === "pending"
                            ? "warning"
                            : data.status === "forwarded"
                              ? "info"
                              : data.status === "approved"
                                ? "success"
                                : "danger"
                        }`}
                      >
                        {data.status}
                      </span>
                    </td>

                    <td>
                      {data.forwardedTo
                        ? `${data.forwardedTo.name || "-"}`
                        : "-"}
                    </td>

                    <td>{data.requestTo?.name || "Admin"}</td>

                    <td>{data.actionBy?.name || "-"}</td>

                    <td>{dayjs(data.createdAt).format("DD MMM YYYY")}</td>

                    <td>
                      {data.status === "pending" && (
                        <>
                          {/* FORWARD */}
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === data._id ? null : data._id,
                              )
                            }
                          >
                            <i className="fas fa-share"></i>
                          </button>

                          {/* APPROVE (UPDATED) */}
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => {
                              setSelectedId(data._id);
                              setApproveModal(true);
                            }}
                          >
                            <i className="fas fa-check"></i>
                          </button>

                          {/* REJECT */}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              dispatch(updateStatus(data._id, "rejected"))
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">No Data Found</td>
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
      {/* APPROVE MODAL (NEW) */}
      {/* ========================= */}
      {approveModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirm Approval</h5>
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
                <p>Are you sure you want to approve this request?</p>

                <label>Upload Receipt</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
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
    </>
  );
};

export default WithdrawalRequest;
