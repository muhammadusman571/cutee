import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Male from "../assets/images/male.png";
import { connect, useDispatch, useSelector } from "react-redux";

import { getSubCoinSeller, deleteSubCoinSeller } from "../store/seller/action";

import {
  ADD_COIN_TO_SUB_SELLER_DIALOGUE,
  ADD_SUBCOIN_OPEN_DIALOGUE,
  OPEN_SUBCOINSELLER_DIALOGUE,
} from "../store/seller/type";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import AddCoinToSubSeller from "../component/dialog/AddCoinToSubSeller";
import SubCoinSellerAdd from "../component/dialog/SubCoinSellerAdd";
// import SubSellerGiveCoin from "../component/dialog/SubSellerGiveCoin";

const SubCoinSeller = (props) => {
  const { subCoinSeller, total } = useSelector((state) => state.subCoinSeller);

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewSubSellersHistory = (seller) => {
    navigate(`/seller/sub-history/${seller._id}`);
  };
  // ✅ Data fetch
  useEffect(() => {
    props.getSubCoinSeller(activePage, rowsPerPage, search);
  }, [activePage, rowsPerPage]);

  // ✅ Update data
  useEffect(() => {
    setData(subCoinSeller);
  }, [subCoinSeller]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_SUBCOINSELLER_DIALOGUE });
  };

  const handleGiveCoin = (id) => {
    dispatch({
      type: ADD_COIN_TO_SUB_SELLER_DIALOGUE,
      payload: id,
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="page-title">
        <div className="row">
          <div className="col-md-6">
            <h3 style={{ color: "#e4eeff" }}>Sub Coin Seller</h3>
          </div>

          <div className="col-md-6">
            <ol className="breadcrumb float-end">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard" className="text-danger">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active">SubCoinSeller</li>
            </ol>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="card">
        <div className="card-header">
          <div className="row">
            {/* ADD BUTTON */}
            <div className="col-md-8">
              <button className="btn btn-danger btn-sm" onClick={handleOpen}>
                <i className="fa fa-plus"></i> New
              </button>
            </div>

            {/* SEARCH */}
            <div className="col-md-4">
              <input
                type="search"
                placeholder="Search..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

                <th>Coin</th>

                <th>Date</th>
                <th>Give Coin</th>
                <th>History</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

                    {/* IMAGE */}
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

                    <td>{item?.coinAmount}</td>

                    <td>{dayjs(item?.createdAt).format("DD MMM YYYY")}</td>

                    {/* GIVE COIN */}
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
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleViewSubSellersHistory(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No Data Found</td>
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

      {/* DIALOGS */}
      <SubCoinSellerAdd />
      <AddCoinToSubSeller />
    </>
  );
};

export default connect(null, {
  getSubCoinSeller,
  deleteSubCoinSeller,
})(SubCoinSeller);
