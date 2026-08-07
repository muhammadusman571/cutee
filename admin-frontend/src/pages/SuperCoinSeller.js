import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Pagination from "./Pagination";

import {
  getCoinSellers,
  toggleCoinSellerStatus,
} from "../store/super-coin-seller/action";

import { OPEN_COIN_SELLER_DIALOG } from "../store/super-coin-seller/types";
import CoinSellerDialog from "../component/dialog/SuperCoinSellerModal";
import { Tooltip } from "antd";
import { ADD_COIN_TO_SUPPER_DIALOGUE } from "../store/seller/type";
import AddCoinToSuperSeller from "../component/dialog/AddCoinToSuperSeller";

const CoinSellerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const {
    sellers = [],
    total = 0,
    error,
  } = useSelector((state) => state.superCoinSeller);

  // ✅ API CALL (FIXED - no infinite loop)
  useEffect(() => {
    dispatch(getCoinSellers(activePage, rowsPerPage, search));
  }, [activePage, rowsPerPage, search, dispatch]);

  // SEARCH
  const handleSearch = () => {
    setActivePage(1);
    dispatch(getCoinSellers(1, rowsPerPage, search));
  };

  const handleGiveCoin = (id) => {
    dispatch({
      type: ADD_COIN_TO_SUPPER_DIALOGUE,
      payload: id,
    });
  };
  const handlePageChange = (page) => setActivePage(page);

  const handleRowsPerPage = (value) => {
    setRowsPerPage(value);
    setActivePage(1);
  };

  // const handleViewSubSellers = (seller) => {
  //   navigate(`/seller/sub-history/${seller._id}`);
  // };

  const handleViewSubSellersHistory = (seller) => {
    navigate(`/seller/sub-history/${seller._id}`);
  };
  const handleViewSubSellers = (seller) => {
    navigate(`/seller/sub-seller/${seller._id}`);
  };

  const handleToggleStatus = (id, status) => {
    dispatch(toggleCoinSellerStatus(id, status));
  };

  return (
    <>
      {/* HEADER */}
      <div className="page-title">
        <div className="row">
          <div className="col-6">
            <h3 className="text-white">Super Coin Sellers</h3>
          </div>

          <div className="col-6">
            <ol className="breadcrumb float-end">
              <li className="breadcrumb-item">
                <Link to="/vendor/dashboard" className="text-danger">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active">Coin Sellers</li>
            </ol>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* CARD */}
      <div className="card-body card-overflow">
        <div className="card-header d-flex justify-content-between align-items-center">
          {/* SEARCH */}
          <div className="input-group w-25">
            <input
              type="search"
              placeholder="Search Seller..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-danger" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* ADD BUTTON ✅ FIXED */}
          <button
            className="btn btn-danger"
            onClick={() => {
              console.log("ADD CLICKED");
              dispatch({ type: OPEN_COIN_SELLER_DIALOG });
            }}
          >
            + Add Seller
          </button>
        </div>

        {/* TABLE */}
        <div className="card-body">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>No.</th>
                <th>Seller</th>
                <th>Email</th>
                <th>Coin Amount</th>
                <th>Created</th>
                <th>Give Coin</th>
                <th>Status</th>
                <th>Sub Sellers</th>
                <th>History</th>
              </tr>
            </thead>

            <tbody>
              {sellers.length ? (
                sellers.map((seller, index) => (
                  <tr key={seller._id}>
                    <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

                    {/* NAME */}
                    <td className="d-flex align-items-center">
                      <img
                        src={seller?.avatar}
                        height="40"
                        width="40"
                        style={{ borderRadius: 8 }}
                        alt=""
                      />
                      <span className="ms-2">{seller.name}</span>
                    </td>

                    <td>{seller.email}</td>
                    <td>{seller.coinAmount}</td>

                    <td>{dayjs(seller.createdAt).format("DD MMM YYYY")}</td>

                    <td>
                      <Tooltip title="Give Coin">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleGiveCoin(seller?._id)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </Tooltip>
                    </td>

                    {/* STATUS */}
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={seller?.status === "active"}
                          onChange={() =>
                            handleToggleStatus(
                              seller._id,
                              seller.status === "active"
                                ? "inactive"
                                : "active",
                            )
                          }
                        />
                        <span className="slider">
                          <p
                            style={{
                              fontSize: 12,
                              marginLeft: `${
                                seller?.status === "active" ? "-24px" : "35px"
                              }`,
                              color: "#000",
                              marginTop: "6px",
                            }}
                          >
                            {seller?.status === "active" ? "Yes" : "No"}
                          </p>
                        </span>
                      </label>
                    </td>

                    {/* SUB SELLERS */}
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleViewSubSellers(seller)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleViewSubSellersHistory(seller)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No Sellers Found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <Pagination
            activePage={activePage}
            rowsPerPage={rowsPerPage}
            userTotal={total}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* DIALOG */}
      <CoinSellerDialog />
      <AddCoinToSuperSeller />
    </>
  );
};

export default CoinSellerList;
