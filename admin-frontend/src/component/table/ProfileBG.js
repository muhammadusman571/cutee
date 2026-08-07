import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getProfileBG, deleteProfileBG } from "../../store/ProfileBG/action";
import { baseURL } from "../../util/Config";
import noImage from "../../assets/images/noImage.png";
import SVGA from "svgaplayerweb";
import $ from "jquery";
import { warning } from "../../util/Alert";
import ProfileBGDialogue from "./ProfileBGDialogue";
import { OPEN_DIALOGUE_PROFILE_BG } from "../../store/ProfileBG/type";

const ProfileBG = (props) => {
  const dispatch = useDispatch();

  const { profileBG = [] } = useSelector((state) => state.profileBG || {});

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getProfileBG());
  }, [dispatch]);

  useEffect(() => {
    setData(profileBG);
  }, [profileBG]);

  useEffect(() => {
    console.log(data);
    if (data && data.length > 0) {
      data.map((profileBG, index) => {
        if (profileBG?.image.split(".").pop() === "profilebg") {
          const player = new SVGA.Player(`div[attr="${index}"]`);
          const parser = new SVGA.Parser();
          parser.load(baseURL + profileBG?.image, (videoItem) => {
            player.setVideoItem(videoItem);
            player.startAnimation();
          });
        }
      });
    } else {
      // Handle the case when data is not available or is an empty array
      console.warn("No valid data to process.");
    }
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = profileBG.filter((data) => {
        return (
          data?.diamond?.toString()?.indexOf(value) > -1 ||
          data?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(profileBG);
    }
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE_PROFILE_BG,
      payload: { data: null, type: "open" },
    });
  };

  const handleEdit = (data) => {
    dispatch({
      type: OPEN_DIALOGUE_PROFILE_BG,
      payload: { data: data, type: "edit" },
    });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteProfileBG(id);
        }
      })
      .catch((err) => console.log(err));
  };

  // set default image

  return (
    <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Profile Bg</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboardd
                  </Link>
                </li>

                <li className="breadcrumb-item active" aria-current="page">
                  Profile Bg
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="main-wrapper">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
            <button
              type="button"
              className="btn waves-effect waves-light btn-danger btn-sm float-left"
              id="ProfileBGDialogue"
              onClick={handleOpen}
            >
              <i className="fa fa-plus"></i>
              <span className="icon_margin">New</span>
            </button>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0">
            <form action="">
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
            </form>
          </div>
        </div>
        <div className="row">
          {data?.length > 0 ? (
            data.map((data, index) => {
              return (
                <>
                  <div
                    className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                    key={index}
                  >
                    <div className="card contact-card card-bg">
                      <div className="card-body p-1">
                        <div className="row px-3 py-4">
                          <div className="col-4 ps-4 d-flex">
                            {data.image.split(".").pop() !== "banner" ? (
                              <img
                                src={
                                  data.image ? baseURL + data.image : noImage
                                }
                                style={{
                                  width: "135px",
                                  height: "135px",
                                  objectFit: "cover",
                                }}
                                alt=""
                                className="rounded-circle my-auto"
                                height={80}
                              />
                            ) : (
                              <div
                                id="banner"
                                attr={index}
                                style={{
                                  width: "200px",
                                  height: "200px",

                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                  marginTop: 10,

                                  objectFit: "cover",
                                }}
                                className="rounded-circle my-auto"
                              ></div>
                            )}
                          </div>
                          <div
                            className="col-8 pe-4 text-end"
                            style={{
                              padding: 0,
                              paddingLeft: 5,
                            }}
                          >
                            <div className=" mt-2 mb-3 px-3 mb-5">
                              <div className="contact-card-info">
                                <h4 className="text-white">
                                  Diamonds: {data?.diamond}
                                </h4>
                              </div>

                              <div className="contact-card-info">
                                <h4 className="text-white">
                                  Validity:{" "}
                                  {data?.validity + " " + data?.validityType}
                                </h4>
                              </div>
                            </div>

                            <div className="contact-card-info mt-2 mb-3 px-3 mb-5">
                              <h4 className="text-white text-center">
                                {" "}
                                {data?.name}
                              </h4>
                            </div>
                            <div className="px-3 d-flex align-items-center justify-content-end">
                              <div
                                onClick={() => handleEdit(data)}
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className="fas fa-edit text-white p-2 bg-primary rounded-circle"
                                  style={{ marginRight: 10, fontSize: 25 }}
                                ></i>
                              </div>
                              <div
                                onClick={() => handleDelete(data?._id)}
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
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" align="center">
                Nothing to show!!
              </td>
            </tr>
          )}
        </div>
      </div>
      <ProfileBGDialogue />
    </div>
  );
};

export default connect(null, { getProfileBG, deleteProfileBG })(ProfileBG);
