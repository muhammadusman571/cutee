import React, { useEffect, useState } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getBlockedUsers, handleBlockUnblockSwitch } from "../../store/user/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//image
import Male from "../../assets/images/male.png";

//pagination
import Pagination from "../../pages/Pagination";

const BlockedUserTable = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blockedUser, totalBlockedUser } = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("ALL");

  useEffect(() => {
    setData(blockedUser);
  }, [blockedUser]);

  useEffect(() => {
    dispatch(getBlockedUsers(activePage, rowsPerPage, search, "ALL", "ALL"));
  }, [activePage, rowsPerPage]);

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", Male);
    });
  });

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleUnblock = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const trimmedValue = value.trim().toUpperCase();

    if (trimmedValue) {
      const filtered = blockedUser.filter((data) => {
        return (
          data?.name?.toUpperCase()?.includes(trimmedValue) ||
          data?.uniqueId?.toString()?.includes(trimmedValue) ||
          data?.gender?.toString()?.toUpperCase()?.includes(trimmedValue)
        );
      });
      setData(filtered);
    } else {
      setData(blockedUser);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setActivePage(1);
      dispatch(getBlockedUsers(1, rowsPerPage, search, "ALL", "ALL"));
    }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light" style={{ color: "#e4eeff" }}>
              Blocked User
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
                  Blocked User
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
                  <p style={{ paddingLeft: 10 }} className="my-2">
                    Total Blocked Users: {totalBlockedUser}
                  </p>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right">
                  <form action="">
                    <div className="input-group mb-3 border rounded-pill">
                      <input
                        type="search"
                        id="searchBar"
                        autoComplete="off"
                        placeholder="What're you searching for?"
                        aria-describedby="button-addon4"
                        className="form-control bg-none border-0 rounded-pill searchBar"
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                      />
                      <div
                        className="input-group-prepend border-0"
                        htmlFor="searchBar"
                      >
                        <div id="button-addon4" className="btn text-danger">
                          <i className="fas fa-search mt-2"></i>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="card-body card-overflow pt-0">
              <table className="table table-striped mt-2 text-center">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>UniqueId</th>
                    <th>Gender</th>
                    <th>Country</th>
                    <th>isBlock</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data?.image ? data?.image : Male}
                              style={{
                                border: "2px solid #fff",
                                borderRadius: 10,
                                objectFit: "cover",
                              }}
                              className="mx-auto"
                            />
                          </td>
                          <td>{data?.name ? data?.name : "-"}</td>
                          <td>{data?.uniqueId ? data?.uniqueId : "-"}</td>
                          <td>{data?.gender ? data?.gender : "-"}</td>
                          <td className="text-success">
                            {data?.country ? data?.country : "-"}
                          </td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data?.isBlock}
                                onChange={() => handleUnblock(data?._id)}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: `${
                                      data.isBlock ? "-24px" : "35px"
                                    }`,
                                    color: "#000",
                                    marginTop: "6px",
                                  }}
                                >
                                  {data?.isBlock ? "Yes" : "No"}
                                </p>
                              </span>
                            </label>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                sessionStorage.setItem(
                                  "user",
                                  JSON.stringify({
                                    ...data,
                                    currentPage: activePage,
                                    currentRowsPerPage: rowsPerPage,
                                  }),
                                );
                                navigate("/admin/user/detail");
                              }}
                            >
                              <i className="fas fa-info-circle fa-lg"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalBlockedUser}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getBlockedUsers,
  handleBlockUnblockSwitch,
})(BlockedUserTable);
