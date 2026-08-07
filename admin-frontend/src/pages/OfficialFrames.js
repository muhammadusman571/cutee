import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getOfficialFrames,
  deleteOfficialFrame,
} from "../store/OfficialFrames/action";
import { Link } from "react-router-dom";
import { baseURL } from "../util/Config";
import { warning } from "../util/Alert";
import noImage from "../assets/images/noImage.png";
import $ from "jquery";
import SVGA from "svgaplayerweb";
import { OPEN_DIALOGUE_OFFICIAL_FRAME } from "../store/OfficialFrames/type";
import OfficialFrameDialog from "../component/dialog/OfficialFrames";
const OfficialFrames = (props) => {
  const { officialFrames } = useSelector((state) => state.officialFrames);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  // Fetch all ranking frames on mount
  useEffect(() => {
    dispatch(getOfficialFrames());
  }, [dispatch]);

  useEffect(() => {
    setData(officialFrames);
  }, [officialFrames]);

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const filtered = officialFrames.filter((item) => {
        return (
          item?.name?.toUpperCase()?.includes(value) ||
          item?.title?.toUpperCase()?.includes(value)
        );
      });
      setData(filtered);
    } else {
      setData(officialFrames);
    }
  };

  // Delete confirmation
  const handleDelete = (id) => {
    const confirmDelete = warning();
    confirmDelete
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteOfficialFrame(id);
        }
      })
      .catch((err) => console.log(err));
  };

  // Open dialog for new ranking frame
  const handleOpen = () => {
    dispatch({ type: OPEN_DIALOGUE_OFFICIAL_FRAME });
  };

  // Open dialog for edit ranking frame
  const handleEdit = (item) => {
    dispatch({ type: OPEN_DIALOGUE_OFFICIAL_FRAME, payload: item });
  };

  // Default fallback for broken images
  $(document).ready(function () {
    $("img").on("error", function () {
      $(this).attr("src", noImage);
    });
  });

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Official Frame's</h3>
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
                  Official Frame's
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
              id="rankingFrameDialog"
              onClick={handleOpen}
            >
              <i className="fa fa-plus"></i>
              <span className="icon_margin">New</span>
            </button>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0">
            {/* Optional search bar */}
            {/* 
            <form action="">
              <div className="input-group mb-3 border rounded-pill">
                <div className="input-group-prepend border-0">
                  <div id="button-addon4" className="btn text-danger">
                    <i className="fas fa-search mt-2"></i>
                  </div>
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  aria-describedby="button-addon4"
                  className="form-control bg-none border-0 rounded-pill searchBar"
                  style={{ background: "#181821" }}
                  onChange={handleSearch}
                />
              </div>
            </form> 
            */}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12 mb-5">
            {/* Section Title */}
            <div className="row">
              {data.map((item, index) => (
                <div
                  className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                  key={index}
                >
                  <div className="card contact-card card-bg position-relative">
                    <div className="card-body p-1">
                      <div className="row px-3 py-4">
                        <div className="col-12 d-flex align-items-center justify-content-center">
                          <OfficialFrameBadge data={item} />
                        </div>
                        <div
                          className="col-12 pe-4 text-start"
                          style={{ paddingLeft: 5 }}
                        >
                          <div className="mb-3 px-3 mb-5">
                            <div className="contact-card-info">
                              <h4 className="text-white">Name: {item?.name}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit/Delete buttons */}
                    <div
                      className="position-absolute top-0 m-2 d-flex"
                      style={{ left: "70%" }}
                    >
                      <i
                        className="fas fa-edit text-white p-2 bg-primary rounded-circle pointer-cursor"
                        style={{ marginRight: 10, fontSize: 25 }}
                        onClick={() => handleEdit(item)}
                      ></i>

                      <i
                        className="fas fa-trash text-white p-2 bg-danger rounded-circle pointer-cursor"
                        style={{ marginRight: 10, fontSize: 25 }}
                        onClick={() => handleDelete(item?._id)}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Component */}
      <OfficialFrameDialog />
    </>
  );
};

// 🟢 Component to render image or SVGA animation
const OfficialFrameBadge = ({ data }) => {
  const svgaRef = useRef(null);

  useEffect(() => {
    if (data?.frame && data.frame.endsWith(".svga") && svgaRef.current) {
      const player = new SVGA.Player(svgaRef.current);
      const parser = new SVGA.Parser(svgaRef.current);

      parser.load(baseURL + data.frame, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }
  }, [data?.frame]);

  return (
    <div>
      {data?.frame && data.frame.endsWith(".svga") ? (
        <div
          ref={svgaRef}
          style={{
            width: "200px",
            height: "200px",
            marginTop: 10,
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={data?.frame ? baseURL + data.frame : noImage}
          alt="Ranking Frame"
          style={{
            width: "135px",
            height: "135px",
            objectFit: "cover",
          }}
          className="rounded-circle my-auto"
        />
      )}
    </div>
  );
};

export default connect(null, { getOfficialFrames, deleteOfficialFrame })(
  OfficialFrames
);
