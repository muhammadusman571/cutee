import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import AnnouncementDialog from "../../component/dialog/AnnouncementDialog";
import Pagination from "../../pages/Pagination";
import { OPEN_ANNOUNCEMENT_DIALOG } from "../../store/Announcement/announcement.type";
import {
  deleteAnnouncement,
  getAnnouncements,
} from "../../store/Announcement/announcement.action";
import { baseURL } from "../../util/Config";

const AnnouncementTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getAnnouncements());
  }, [dispatch]);

  const announcements = useSelector((state) => state.announcement.list);

  useEffect(() => {
    setData(announcements);
  }, [announcements]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber - 1);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_ANNOUNCEMENT_DIALOG });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      props.deleteAnnouncement(id);
      alert("Deleted!");
    }
  };

  const handleEdit = (item) => {
    dispatch({ type: OPEN_ANNOUNCEMENT_DIALOG, payload: item });
  };

  // helper to build full media URL safely
  const getMediaUrl = (path) => {
    if (!path) return "";
    const cleanBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    const cleanPath = path.replace(/\\/g, "/");
    return `${cleanBase}/${cleanPath}`;
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Announcements</h3>
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
                <li className="breadcrumb-item active" aria-current="page">
                  Announcements
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <button
                    type="button"
                    className="btn waves-effect waves-light btn-danger btn-sm float-left"
                    onClick={handleOpen}
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body card-overflow">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Text</th>
                    <th>Media</th>
                    <th>Sent</th>
                    <th>Sent Date & Time</th>
                    <th>Scheduled Date & Time</th>
                    <th>Type</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : data
                    ).map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.title}</td>
                        <td>{item?.text}</td>

                        {/* MEDIA COLUMN */}
                        <td>
                          {item.media && item.media.length > 0 ? (
                            item.media.map((m, idx) => {
                              const mediaUrl = getMediaUrl(m);

                              if (mediaUrl.toLowerCase().endsWith(".mp4")) {
                                return (
                                  <video
                                    key={idx}
                                    width="100"
                                    height="60"
                                    controls
                                    style={{ marginRight: 5 }}
                                  >
                                    <source src={mediaUrl} type="video/mp4" />
                                  </video>
                                );
                              }

                              return (
                                <img
                                  key={idx}
                                  src={mediaUrl}
                                  alt="announcement"
                                  width="80"
                                  height="60"
                                  style={{
                                    borderRadius: 5,
                                    marginRight: 5,
                                  }}
                                />
                              );
                            })
                          ) : (
                            <img alt="default" width="80" height="60" />
                          )}
                        </td>

                        <td>
                          {item.sended ? (
                            <span className="text-success">Sent</span>
                          ) : (
                            <span className="text-warning">Pending</span>
                          )}
                        </td>

                        <td>
                          {item.sentDate
                            ? dayjs(item.sentDate).format("DD MMM, YYYY HH:mm")
                            : "-"}
                        </td>
                        <td>
                          {item.scheduledTime
                            ? dayjs(item.scheduledTime).format(
                                "DD MMM, YYYY HH:mm",
                              )
                            : "-"}
                        </td>

                        <td>
                          {item.type === "schedule" ? "Scheduled" : "Immediate"}
                        </td>

                        <td>
                          <Tooltip title="Edit">
                            <button
                              type="button"
                              className="btn btn-info btn-sm"
                              onClick={() => handleEdit(item)}
                            >
                              <i className="fa fa-edit fa-lg"></i>
                            </button>
                          </Tooltip>
                        </td>

                        <td>
                          <Tooltip title="Delete">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item._id)}
                            >
                              <i className="fas fa-trash-alt fa-lg"></i>
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={data.length}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <AnnouncementDialog />
    </>
  );
};

export default connect(null, {
  getAnnouncements,
  deleteAnnouncement,
})(AnnouncementTable);
