import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { baseURL } from "../util/Config";
import { warning } from "../util/Alert";
import noImage from "../assets/images/noImage.png";
import SVGA from "svgaplayerweb";
import { deleteUploadBadge, getUploadBadge } from "../store/uploadBadge/action";
import { OPEN_DIALOGUE_UPLOAD_BADGE } from "../store/uploadBadge/type";
import UploadBadgeDialog from "./../component/dialog/UploadBadge";
const UploadBadge = (props) => {
  const { uploadBadge } = useSelector((state) => state.uploadBadge);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getUploadBadge());
  }, [dispatch]);

  useEffect(() => {
    setData(uploadBadge);
  }, [uploadBadge]);

  const handleDelete = (id) => {
    const confirmDelete = warning();
    confirmDelete
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteUploadBadge(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_DIALOGUE_UPLOAD_BADGE });
  };

  const handleEdit = (item) => {
    dispatch({ type: OPEN_DIALOGUE_UPLOAD_BADGE, payload: item });
  };

  // $(document).ready(function () {
  //   $("img").on("error", function () {
  //     $(this).attr("src", noImage);
  //   });
  // });

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Upload Badge</h3>
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
                  Upload Badge
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
              id="UploadBadgeDialog"
              onClick={handleOpen}
            >
              <i className="fa fa-plus"></i>
              <span className="icon_margin">New</span>
            </button>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mb-3 mt-lg-0 mt-xl-0"></div>
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
      <UploadBadgeDialog />
    </>
  );
};

const OfficialFrameBadge = ({ data }) => {
  const svgaRef = useRef(null);

  useEffect(() => {
    if (data?.type === "svga" && data?.frame && svgaRef.current) {
      const player = new SVGA.Player(svgaRef.current);
      const parser = new SVGA.Parser(svgaRef.current);

      parser.load(baseURL + data.frame, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }
  }, [data]);

  return (
    <div className="text-center">
      {/* 🔹 SVGA TYPE */}
      {data?.type === "svga" && data?.frame && (
        <div
          ref={svgaRef}
          style={{
            width: "200px",
            height: "200px",
            marginTop: 10,
          }}
        />
      )}

      {/* 🔹 IMAGE TYPE */}
      {data?.type === "image" && (
        <img
          src={data?.frame ? baseURL + data.frame : noImage}
          alt="Upload Badge"
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

export default connect(null, { getUploadBadge, deleteUploadBadge })(
  UploadBadge,
);
