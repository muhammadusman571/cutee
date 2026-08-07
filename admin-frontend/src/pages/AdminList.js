import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { getAdmins, toggleAdminStatus } from "../store/admin/action";
import Pagination from "./Pagination";
import Male from "../assets/images/male.png";
import { alert, warning } from "../util/Alert";
import { OPEN_AGENCY_DIALOG } from "../store/agency/type";
import { useCurrentUser } from "../context/CurrentUser";
import { Toast } from "../util/Toast";
import { TOGGLE_MANAGEMENT_DIALOG } from "../store/admin/types";
import ManagementDialog from "../component/dialog/ManagementRegistrationModal";
const AdminList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const { admins, total, error } = useSelector((state) => state.admin);
  const { profile: currentUser } = useCurrentUser(); // assuming auth state

  useEffect(() => {
    dispatch(getAdmins(activePage, rowsPerPage, search));
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    if (error) {
      setData([]);
    } else {
      setData(admins);
    }
  }, [admins, error]);

  const handlePageChange = (pageNumber) => setActivePage(pageNumber);
  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", Male);
    });
  });

  const handleSearch = () => {
    const value = search.trim().toLowerCase();
    if (value) {
      const filteredData = admins.filter(
        (admin) =>
          admin?.name?.toLowerCase().includes(value) ||
          admin?.email?.toLowerCase().includes(value)
      );
      setData(filteredData);
    } else {
      setData(admins);
    }
  };

  const handleViewAgencies = (admin) => {
    navigate("/admin/agency", { state: admin });
  };

  const handleCopyInviteLink = () => {
    if (!currentUser?._id) {
      Toast("error", "User ID not found");
      return;
    }

    // Generate link dynamically based on current site origin
    const inviteLink = `${window.location.origin}/registration?ref=${currentUser._id}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
        Toast("success", "Invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
        Toast("error", "Failed to copy link");
      });
  };
  const handleToggleStatus = (id, status) => {
    props.toggleAdminStatus(id, status);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Admins</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/vendor/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Admins
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {error !== null ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header pb-0">
                <div className="row my-3 align-items-center">
                  <div
                    className={`col-12 d-flex  justify-content-between align-items-center flex-wrap`}
                  >
                    {/* Copy Invite Link Button */}
                    {currentUser?.role === "super_admin" && (
                      <button
                        className="btn btn-danger btn-sm mb-2 mb-md-0"
                        onClick={handleCopyInviteLink}
                      >
                        <i className="fa fa-copy me-1"></i>
                        {copied ? "Copied!" : "Copy Invite Link"}
                      </button>
                    )}
                    {currentUser?.role === "owner" && (
                      <button
                        className="btn btn-danger btn-sm mb-2 mb-md-0"
                        onClick={() => {
                          dispatch({ type: TOGGLE_MANAGEMENT_DIALOG });
                        }}
                      >
                        <i className="fa fa-plus-circle me-1"></i>
                        Add Management
                      </button>
                    )}

                    {/* Search Input */}
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "10px" }}
                    >
                      <div
                        className="input-group border rounded-pill"
                        style={{ maxWidth: "250px" }}
                      >
                        <input
                          type="search"
                          placeholder="Search Admin..."
                          className="form-control border-0 rounded-pill"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              dispatch(
                                getAdmins(
                                  activePage,
                                  rowsPerPage,
                                  search,
                                  roleFilter
                                )
                              );
                            }
                          }}
                        />
                        <button
                          className="btn text-danger"
                          onClick={() =>
                            dispatch(
                              getAdmins(
                                activePage,
                                rowsPerPage,
                                search,
                                roleFilter
                              )
                            )
                          }
                        >
                          <i className="fas fa-search"></i>
                        </button>
                      </div>

                      {/* Role Filter - only for owners */}
                      {currentUser?.role === "owner" && (
                        <div className="">
                          {/* <label
                            htmlFor="roleFilter"
                            className="form-label fw-bold text-danger"
                          >
                            Role
                          </label> */}
                          <select
                            id="roleFilter"
                            className="form-select border-1 border-white bg-transparent text-danger fw-bold rounded-pill"
                            value={roleFilter}
                            onChange={(e) => {
                              setRoleFilter(e.target.value);
                              dispatch(
                                getAdmins(
                                  activePage,
                                  rowsPerPage,
                                  search,
                                  e.target.value
                                )
                              );
                            }}
                            style={{ minWidth: "150px" }}
                          >
                            <option value="">All</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="management">Management</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body card-overflow">
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Admin</th>
                      <th>Email</th>
                      <th>Role</th> {/* Added role column */}
                      <th>Created At</th>
                      <th>Is Active</th>
                      <th>Agencies</th>
                      {currentUser?.role === "Superadmin" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length ? (
                      data.map((admin, index) => (
                        <tr key={admin._id}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td className="d-flex align-items-center">
                            <img
                              src={admin?.avatar || Male}
                              height="50px"
                              width="50px"
                              alt="admin"
                              style={{ borderRadius: 10, objectFit: "cover" }}
                            />
                            <span className="ms-2">{admin.name}</span>
                          </td>
                          <td>{admin.email}</td>
                          <td>{admin.role}</td> {/* Display role */}
                          <td>
                            {dayjs(admin.createdAt).format("DD MMM, YYYY")}
                          </td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={admin?.status === "active"}
                                onChange={() =>
                                  handleToggleStatus(
                                    admin._id,
                                    admin.status === "active"
                                      ? "inactive"
                                      : "active"
                                  )
                                }
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: `${
                                      admin?.status === "active"
                                        ? "-24px"
                                        : "35px"
                                    }`,
                                    color: "#000",
                                    marginTop: "6px",
                                  }}
                                >
                                  {admin?.status === "active" ? "Yes" : "No"}
                                </p>
                              </span>
                            </label>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-success d-flex align-items-center"
                              onClick={() => handleViewAgencies(admin)}
                            >
                              <i
                                className="material-icons"
                                style={{ fontSize: "20px" }}
                              >
                                people
                              </i>
                            </button>
                          </td>
                          {/* <td>
                            <span
                              className={`badge ${
                                admin.status === "active"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {admin.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td> */}
                          {/* {currentUser?.role !== "admin" && (
                            <td>
                              <button
                                className={`btn btn-sm ${
                                  admin.status === "active"
                                    ? "btn-danger"
                                    : "btn-success"
                                }`}
                                onClick={() =>
                                  handleToggleStatus(
                                    admin._id,
                                    admin.status === "active"
                                      ? "inactive"
                                      : "active"
                                  )
                                }
                              >
                                {admin.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </td>
                          )} */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">Nothing to show!!</td>
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
          </div>
        </div>
      )}
      <ManagementDialog />
    </>
  );
};

export default connect(null, { toggleAdminStatus })(AdminList);
