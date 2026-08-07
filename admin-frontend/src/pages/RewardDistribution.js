import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRewards,
  getRewardConfig,
} from "../store/RewardDistribution/action";
import Pagination from "../pages/Pagination";
import { OPEN_COINSELLER_DIALOGUE } from "../store/coinSeller/type";
import RewardDistributionAdd from "../component/dialog/RewardDistributionAdd";
import { Tooltip } from "@mui/material";

const RewardDistribution = () => {
  const dispatch = useDispatch();

  const {
    reward = [],
    total = 0,
    rewardConfig = null,
  } = useSelector((state) => state.rewardReducer) || {};

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    dispatch(getRewards((activePage - 1) * rowsPerPage, rowsPerPage));
    dispatch(getRewardConfig());
  }, [dispatch, activePage, rowsPerPage]);

  const handlePageChange = (pageNumber) => setActivePage(pageNumber);
  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_COINSELLER_DIALOGUE,
      payload: rewardConfig || null,
    });
  };

  const getDurationText = (config) => {
    if (!config) return "-";
    const { timeType, days = 0, hours = 0, minutes = 0, seconds = 0 } = config;
    if (timeType === "days") {
      return `${days}D ${hours}H ${minutes}M ${seconds}S`;
    } else {
      return `${hours}H ${minutes}M ${seconds}S`;
    }
  };

  return (
    <>
      {/* ================= PAGE TITLE ================= */}
      <div className="page-title mb-4">
        <h3 style={{ color: "#e4eeff" }}>Reward Distribution</h3>
      </div>

      {/* ================= REWARD CONFIGURATION ================= */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Reward Configuration</h5>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead className="text-center">
                  <tr>
                    <th>Time Type</th>
                    <th>Duration</th>
                    <th>Reward</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {rewardConfig ? (
                    <tr>
                      <td>
                        {rewardConfig.timeType
                          ? rewardConfig.timeType.charAt(0).toUpperCase() +
                            rewardConfig.timeType.slice(1)
                          : ""}
                      </td>

                      <td>{getDurationText(rewardConfig)}</td>
                      <td>{rewardConfig.reward}</td>
                      <Tooltip title="Update">
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={handleOpen}
                          >
                            <i className="fa fa-edit fa-lg"></i>
                          </button>
                        </td>
                      </Tooltip>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={handleOpen}
                        >
                          <i className="fa fa-plus"></i> Add Reward
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= REWARD HISTORY ================= */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Reward History</h5>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead className="text-center">
                  <tr>
                    <th>No.</th>
                    <th>Host</th>
                    <th>Reward</th>
                    <th>Live Start Date</th>
                    <th>Reward Date</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {reward.length > 0 ? (
                    reward.map((data, index) => (
                      <tr key={index}>
                        <td>{(activePage - 1) * rowsPerPage + index + 1}</td>

                        <td className="d-flex align-items-center justify-content-center">
                          <img
                            src={data?.userDetails?.image}
                            alt="host"
                            height="35"
                            width="35"
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                          />
                          <span className="ms-2">
                            {data?.userDetails?.name}
                          </span>
                        </td>

                        <td>{data.rewardAmount || "-"}</td>

                        <td>
                          {data.rewardDate
                            ? new Date(data.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          {data.rewardDate
                            ? new Date(data.rewardDate).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Nothing to show!!</td>
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

      <RewardDistributionAdd onSuccess={() => dispatch(getRewardConfig())} />
    </>
  );
};

export default RewardDistribution;
