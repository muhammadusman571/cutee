import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
// import { createNewAgency, editAgency } from "../../store/agency/action";
// import { getCoinSellerUniqueId } from "../../store/coinSeller/action";
import Male from "../../src/assets/images/male.png";
import { useLocation, useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { createNewAgency, editAgency } from "../store/agency/action";
import { getCoinSellerUniqueId } from "../store/coinSeller/action";

const AgencyRegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const refParam = searchParams.get("ref");

  const { coinSellerId } = useSelector((state) => state.coinSeller);
  const { agency } = useSelector((state) => state.agency);

  // --- Form states
  const [imageData, setImageData] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [data, setData] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [search, setSearch] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [code, setCode] = useState("");
  const [bankDetails, setBankDetails] = useState("");

  // --- Infinite scroll
  const [start, setStart] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [errors, setErrors] = useState({});

  // ❌ If no ref param, redirect or show message
  useEffect(() => {
    if (!refParam) {
      navigate("/unauthorized"); // Or show a proper message
    }
  }, [refParam, navigate]);

  // --- Fetch initial users
  useEffect(() => {
    if (!refParam) return;
    setStart(1);
    setData([]);
    fetchUsers(1);
  }, [search, refParam]);

  const fetchUsers = (page) => {
    setLoading(true);
    dispatch(getCoinSellerUniqueId(page, limit, search));
  };

  // --- Append new users when fetched
  useEffect(() => {
    if (coinSellerId?.length) {
      setData((prev) => [...prev, ...coinSellerId]);
      setHasMore(coinSellerId.length === limit);

      // Scroll to bottom after new data
      if (scrollRef.current) {
        setTimeout(() => {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 50);
      }
    } else {
      setHasMore(false);
    }
  }, [coinSellerId]);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      const nextPage = start + 1;
      setStart(nextPage);
      fetchUsers(nextPage);
    }
  };

  // --- Image upload
  const handleInputImage = (e) => {
    if (!e.target.files[0]) {
      setErrors({ ...errors, image: "Please select an Image!" });
      return;
    }
    setImageData(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => setImagePath(reader.result);
    reader.readAsDataURL(e.target.files[0]);
    setErrors({ ...errors, image: "" });
  };

  const handleSubmit = () => {
    // Simple validation
    const newErrors = {};
    if (!name) newErrors.name = "Name can't be blank!";
    if (!uniqueId) newErrors.uniqueId = "Unique ID required!";
    if (!mobileNumber) newErrors.mobileNumber = "Mobile number required!";
    if (!code) newErrors.code = "Code required!";
    if (!bankDetails) newErrors.bankDetails = "Bank details required!";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageData);
    formData.append("name", name);
    formData.append("uniqueId", uniqueId);
    formData.append("agencyCode", code);
    formData.append("mobile", mobileNumber);
    formData.append("bankDetails", bankDetails);
    formData.append("ref", refParam);

    if (mongoId) {
      dispatch(editAgency(formData, mongoId));
    } else {
      dispatch(createNewAgency(formData));
    }

    // Reset form
    setName("");
    setUniqueId("");
    setMobileNumber("");
    setCode("");
    setBankDetails("");
    setImageData(null);
    setImagePath(null);
  };

  return (
    <div className="container my-4">
      <h2 className="text-danger mb-4">Agency Registration</h2>

      {/* User select */}
      <div className="mb-3">
        <label className="form-label">Select User</label>
        <div style={{ position: "relative" }}>
          <ReactSelect
            value={data.find((d) => d.uniqueId === uniqueId)}
            options={data}
            getOptionLabel={(option) => option.uniqueId}
            formatOptionLabel={(option) => (
              <div className="d-flex align-items-center">
                <img
                  src={option.image || Male}
                  alt="user"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                  }}
                />
                <span className="ms-2">{option.uniqueId}</span>
              </div>
            )}
            onChange={(selected) => setUniqueId(selected.uniqueId)}
            onInputChange={(input) => setSearch(input)}
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: "250px", // limit dropdown height
                overflowY: "auto",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "250px",
                overflowY: "auto",
              }),
            }}
            components={{
              MenuList: (props) => (
                <div
                  id="scrollable-container"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <p
                        style={{
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "12px",
                        }}
                      >
                        Loading more...
                      </p>
                    }
                    scrollableTarget="scrollable-container"
                    style={{ overflow: "hidden" }}
                  >
                    {props.children}
                  </InfiniteScroll>
                </div>
              ),
            }}
          />
        </div>

        {errors.uniqueId && (
          <span className="text-danger">{errors.uniqueId}</span>
        )}
      </div>

      {/* Form fields */}
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="text-danger">{errors.name}</span>}
      </div>

      <div className="mb-3">
        <label className="form-label">Mobile Number</label>
        <input
          type="number"
          className="form-control"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        {errors.mobileNumber && (
          <span className="text-danger">{errors.mobileNumber}</span>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Bank Details</label>
        <textarea
          className="form-control"
          value={bankDetails}
          rows={4}
          onChange={(e) => setBankDetails(e.target.value)}
        />
        {errors.bankDetails && (
          <span className="text-danger">{errors.bankDetails}</span>
        )}
      </div>

      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Agency Code"
          value={code}
          readOnly
        />
        <button
          className="btn btn-info"
          onClick={() => setCode(Math.floor(10000 + Math.random() * 90000))}
        >
          Generate
        </button>
      </div>

      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleInputImage} />
        {errors.image && <span className="text-danger">{errors.image}</span>}
        {imagePath && (
          <img src={imagePath} alt="preview" width={80} className="mt-2" />
        )}
      </div>

      <button className="btn btn-danger" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AgencyRegistrationPage;
