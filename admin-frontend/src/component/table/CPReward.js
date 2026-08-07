import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCpReward, getCPReward } from "../../store/CPReward/action";
import { baseURL } from "../../util/Config";
import noImage from "../../assets/images/noImage.png";
import SVGA from "svgaplayerweb";
import { warning } from "../../util/Alert";
import { OPEN_DIALOGUE_CP_REWARD } from "../../store/CPReward/type";
import CPRewardDialogue from "../dialog/CPRewardDialogue";

const CPReward = (props) => {
  const dispatch = useDispatch();
  const { cpReward = [] } = useSelector((state) => state.cpReward);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getCPReward());
  }, [dispatch]);

  useEffect(() => {
    setData(cpReward);
  }, [cpReward]);

  // Render SVGA for multiple images
  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        item.images?.forEach((img, i) => {
          if (img.split(".").pop() === "svga") {
            const player = new SVGA.Player(`#svga-${index}-${i}`);
            const parser = new SVGA.Parser();
            parser.load(baseURL + img, (videoItem) => {
              player.setVideoItem(videoItem);
              player.startAnimation();
            });
          }
        });
      });
    }
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const filtered = cpReward.filter((item) =>
        item?.name?.toUpperCase()?.includes(value),
      );
      setData(filtered);
    } else {
      setData(cpReward);
    }
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE_CP_REWARD,
      payload: { data: null, type: "open" },
    });
  };

  const handleEdit = (item) => {
    dispatch({
      type: OPEN_DIALOGUE_CP_REWARD,
      payload: { data: item, type: "edit" },
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = warning();
    confirmDelete
      .then((isDeleted) => {
        if (isDeleted) props.deleteCpReward(id);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">CP Reward</h3>
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
                  CP Reward
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="main-wrapper">
        <div className="row mb-3">
          <div className="col-12 col-md-6 col-lg-8">
            <button
              type="button"
              className="btn waves-effect waves-light btn-danger btn-sm"
              onClick={handleOpen}
            >
              <i className="fa fa-plus"></i>
              <span className="icon_margin">New</span>
            </button>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mt-3 mb-3 mt-lg-0">
            <div className="input-group mb-3 border rounded-pill">
              <div className="input-group-prepend border-0">
                <div id="button-addon4" className="btn text-danger">
                  <i className="fas fa-search mt-2"></i>
                </div>
              </div>
              <input
                type="search"
                placeholder="What're you searching for?"
                aria-describedby="button-addon4"
                className="form-control bg-none border-0 rounded-pill searchBar"
                style={{ background: "#181821" }}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Reward Cards */}
        <div className="row">
          {data?.length > 0 ? (
            data.map((item, index) => {
              const startTime =
                (item.startValidityType === "days"
                  ? item.startDays
                  : item.startValidityType === "hours"
                    ? item.startHours
                    : item.startMinutes) +
                " " +
                item.startValidityType;

              const endTime =
                (item.endValidityType === "days"
                  ? item.endDays
                  : item.endValidityType === "hours"
                    ? item.endHours
                    : item.endMinutes) +
                " " +
                item.endValidityType;

              return (
                <div className="col-12 col-sm-12 col-md-6 col-lg-4" key={index}>
                  <div className="card contact-card card-bg">
                    <div className="card-body p-1">
                      <div className="row px-3 py-4">
                        {/* Images Column */}
                        <div className="col-4 ps-4 d-flex flex-column">
                          {item.images?.length > 0 ? (
                            item.images.map((img, i) =>
                              img.split(".").pop() !== "svga" ? (
                                <img
                                  key={i}
                                  src={img ? baseURL + img : noImage}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    marginBottom: 5,
                                  }}
                                  alt=""
                                  className="rounded-circle"
                                />
                              ) : (
                                <div
                                  key={i}
                                  id={`svga-${index}-${i}`}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    marginBottom: 5,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                  }}
                                ></div>
                              ),
                            )
                          ) : (
                            <img
                              src={noImage}
                              style={{ width: "80px", height: "80px" }}
                              alt=""
                              className="rounded-circle"
                            />
                          )}
                        </div>

                        {/* Info Column */}
                        <div
                          className="col-8 pe-4 text-end"
                          style={{ paddingLeft: 5 }}
                        >
                          <div className="mt-2 mb-3 px-3 mb-5">
                            <div className="contact-card-info">
                              <h4 className="text-white">Name: {item.name}</h4>
                            </div>
                            <div className="contact-card-info">
                              <h4 className="text-white">
                                Position: {item.position}
                              </h4>
                            </div>
                            <div className="contact-card-info">
                              <h4 className="text-white">Start: {startTime}</h4>
                            </div>
                            <div className="contact-card-info">
                              <h4 className="text-white">End: {endTime}</h4>
                            </div>
                            <div className="contact-card-info">
                              <h4 className="text-white">
                                Rules:{" "}
                                {item.rules?.length > 0
                                  ? item.rules.join(", ")
                                  : "None"}
                              </h4>
                            </div>
                          </div>
                          <div className="contact-card-info">
                            <h4 className="text-white">
                              Validity: {item.validity} {item.validityType}
                            </h4>
                          </div>

                          <div className="px-3 d-flex align-items-center justify-content-end">
                            <div
                              onClick={() => handleEdit(item)}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="fas fa-edit text-white p-2 bg-primary rounded-circle"
                                style={{ marginRight: 10, fontSize: 25 }}
                              ></i>
                            </div>
                            <div
                              onClick={() => handleDelete(item?._id)}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="fas fa-trash text-white p-2 bg-danger rounded-circle"
                                style={{ marginRight: 10, fontSize: 25 }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center text-white py-5">
              Nothing to show!!
            </div>
          )}
        </div>
      </div>

      {/* Dialog for Create/Edit */}
      <CPRewardDialogue usedPositions={cpReward.map((item) => item.position)} />
    </div>
  );
};

export default connect(null, { getCPReward, deleteCpReward })(CPReward);
