import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerCoinHistory = () => {
  const [data, setData] = useState({
    transactions: [],
    totalBalance: 0,
    totalGiven: 0,
    totalTaken: 0,
    todayGiven: 0,
    todayTaken: 0,
    id: 0,
  });

  const getRoleName = (role) => {
    if (role === "owner") return "Admin";
    if (role === "super_coin") return "Super Seller";
    if (role === "sub_coin_seller") return "Sub Seller";
    return "User";
  };
  const [loading, setLoading] = useState(false);

  // =========================
  // API CALL
  // =========================
  const navigate = useNavigate();
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/coinSeller/coin-history`);

      setData(res.data?.data || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const {
    transactions = [],
    totalBalance = 0,
    totalGiven = 0,
    totalTaken = 0,
    todayGiven = 0,
    todayTaken = 0,
    id = 0,
  } = data;

  // ✅ FIXED TODAY NET LOGIC
  const todayNet = Number(todayTaken) - Number(todayGiven);

  return (
    <>
      {/* HEADER */}
      <div className="page-title" style={{ marginBottom: "15px" }}>
        <div className="row align-items-center">
          <div className="col-6">
            <h3 className="text-white">Coin History</h3>
          </div>

          <div className="col-6 text-end">
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {/* CARDS */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h6>Total Balance</h6>
            <h4 style={{ color: totalBalance >= 0 ? "green" : "red" }}>
              {totalBalance}
            </h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h6>Total Given</h6>
            <h4 style={{ color: "red" }}>{totalGiven}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h6>Total Taken</h6>
            <h4 style={{ color: "green" }}>{totalTaken}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center p-3">
            <h6>Today Net</h6>
            <h4 style={{ color: todayNet >= 0 ? "green" : "red" }}>
              {todayNet}
            </h4>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card-body card-overflow">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Direction</th>
              <th>Coins</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length ? (
              transactions.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  {item.from?.name}
                  <td>{item.to?.name}</td>
                  <td>
                    {getRoleName(item.from?.role)} →{" "}
                    {getRoleName(item.to?.role)}
                  </td>
                  <td
                    style={{
                      color: item.from?._id === id ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {item.from?._id === id ? "-" : "+"}
                    {item.amount}
                  </td>
                  <td>{item.from?._id === id ? "Sent" : "Received"}</td>
                  <td>{dayjs(item.createdAt).format("DD MMM YYYY hh:mm A")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Transactions Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SellerCoinHistory;
