import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Male from "../assets/images/male.png";
import { connect, useDispatch, useSelector } from "react-redux";

import { getUsers } from "../store/uuser/action";
import AddCoinToUser from "../component/dialog/AddCoinToUser";
import { ADD_COIN_TO_USERS_OPEN_DIALOGUE } from "../store/uuser/type";
import { Tooltip } from "antd";

const User = (props) => {
  const dispatch = useDispatch();
  const { users, total } = useSelector((state) => state.users);

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");

  // ✅ API call with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      props.getUsers(activePage, rowsPerPage, search);
    }, 500);

    return () => clearTimeout(delay);
  }, [activePage, rowsPerPage, search]);

  // ✅ Update data
  useEffect(() => {
    setData(users);
  }, [users]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleGiveCoin = (id) => {
    dispatch({
      type: ADD_COIN_TO_USERS_OPEN_DIALOGUE,
      payload: id,
    });
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-md-6">
            <h3 style={{ color: "#e4eeff" }}>User</h3>
          </div>

          <div className="col-md-6">
            <ol className="breadcrumb float-end">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard" className="text-danger">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active">User</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="row">
            {/* ✅ SEARCH */}
            <div className="col-md-4">
              <input
                type="search"
                placeholder="Search..."
                className="form-control"
                value={search}
                onChange={(e) => {
                  setActivePage(1); // reset page
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>No.</th>
                <th>Image</th>
                <th>Name</th>
                <th>UniqueId</th>
                <th>Current Coin</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

                    <td>
                      <img
                        src={item?.image || Male}
                        height="50"
                        width="50"
                        onError={(e) => (e.target.src = Male)}
                        style={{ borderRadius: "10px" }}
                        alt="user"
                      />
                    </td>

                    <td>{item?.name || "-"}</td>
                    <td>{item?.uniqueId || "-"}</td>

                    <td>
                      <Tooltip title="Give Coin">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleGiveCoin(item?._id)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Data Found</td>
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

      <AddCoinToUser />
    </>
  );
};

export default connect(null, {
  getUsers,
})(User);
