import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SubSellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/all-sub-seller/${id}`);
      setSellers(res.data?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleViewSubSellersHistory = (seller) => {
    navigate(`/seller/sub-history/${seller._id}`);
  };
  return (
    <>
      {/* HEADER */}
      <div className="page-title">
        <h3 className="text-white">Sub Sellers</h3>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {/* TABLE */}
      <div className="card-body card-overflow">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Total Coins</th>
              <th>History</th>
            </tr>
          </thead>

          <tbody>
            {sellers.length ? (
              sellers.map((seller, index) => (
                <tr key={seller._id}>
                  <td>{index + 1}</td>

                  <td>{seller.name}</td>

                  <td>{seller.email}</td>

                  <td>{dayjs(seller.createdAt).format("DD MMM YYYY")}</td>

                  <td style={{ fontWeight: "bold", color: "green" }}>
                    {seller.coinAmount || 0}
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
                <td colSpan="5">No Sub Sellers Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SubSellerList;
