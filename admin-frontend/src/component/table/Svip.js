import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { baseURL } from "../../util/Config";
import { warning } from "../../util/Alert";
import noImage from "../../assets/images/noImage.png";
import $ from "jquery";
import SvipDialog from "../dialog/SvipDialog";
import { OPEN_DIALOGUE_SVIP } from "../../store/Svip/type";
import { deleteSvip, getSVIPS, deleteSvipField } from "../../store/Svip/action";
import SVGA from "svgaplayerweb";

const Svip = (props) => {
  const { svips } = useSelector((state) => state.svip);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [selectedSvip, setSelectedSvip] = useState(null);

  useEffect(() => {
    dispatch(getSVIPS());
  }, [dispatch]);

  useEffect(() => {
    setData(svips);
  }, [svips]);

  const handleDelete = (id) => {
    warning().then((ok) => {
      if (ok) {
        props.deleteSvip(id);
      }
    });
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_DIALOGUE_SVIP });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_DIALOGUE_SVIP, payload: data });
  };

  const handleDeleteField = (id, field) => {
    const confirm = window.confirm(`Delete ${field}?`);

    if (!confirm) return;

    props
      .deleteSvipField(id, field)
      .then((res) => {
        if (res?.data?.status) {
          setSelectedSvip(null); // ✅ CLOSE MODAL
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* HEADER */}
      <div className="page-title">
        <h3 className="text-white">SVIP</h3>
      </div>

      <div className="main-wrapper">
        {/* NEW BUTTON */}
        <button className="btn btn-danger btn-sm mb-3" onClick={handleOpen}>
          <i className="fa fa-plus"></i> New
        </button>

        {/* LIST */}
        <div className="row mt-4">
          {data?.length > 0 ? (
            data.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card p-3 text-center position-relative">
                  {/* ACTIONS */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <i
                      className="fas fa-edit text-primary"
                      style={{ cursor: "pointer", fontSize: 18 }}
                      onClick={() => handleEdit(item)}
                    />
                    <i
                      className="fas fa-trash text-danger"
                      style={{ cursor: "pointer", fontSize: 18 }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>

                  {/* NAME */}
                  <h5 className="text-white mb-3">{item?.name}</h5>

                  {/* BADGE PREVIEW */}
                  <img
                    src={item?.badge ? baseURL + item.badge : noImage}
                    alt="badge"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                  {/* VIEW BUTTON */}
                  <button
                    className="btn btn-light btn-sm mt-3"
                    onClick={() => setSelectedSvip(item)}
                  >
                    <i className="fas fa-eye me-1"></i> View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">Nothing to show</p>
          )}
        </div>
      </div>

      <SvipDialog />

      {/* ================= MODAL ================= */}
      {selectedSvip && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "85%",
              background: "#1a1a1a",
              borderRadius: 10,
              padding: 20,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h4 className="text-white">
                {selectedSvip?.name || "SVIP Details"}
              </h4>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => setSelectedSvip(null)}
              >
                Close ✖
              </button>
            </div>

            {/* GRID */}
            <div className="row text-center">
              <AssetBox
                title="Badge"
                file={selectedSvip?.badge}
                onDelete={() => handleDeleteField(selectedSvip._id, "badge")}
              />

              <AssetBox
                title="Frame"
                file={selectedSvip?.frame}
                onDelete={() => handleDeleteField(selectedSvip._id, "frame")}
              />

              <AssetBox
                title="Border"
                file={selectedSvip?.borderFinal}
                onDelete={() =>
                  handleDeleteField(selectedSvip._id, "borderFinal")
                }
              />

              <AssetBox
                title="Msg Box"
                file={selectedSvip?.msgBox}
                onDelete={() => handleDeleteField(selectedSvip._id, "msgBox")}
              />

              <AssetBox
                title="Profile Card"
                file={selectedSvip?.profileCard}
                onDelete={() =>
                  handleDeleteField(selectedSvip._id, "profileCard")
                }
              />

              <AssetBox
                title="Room Background"
                file={selectedSvip?.roomBg}
                onDelete={() => handleDeleteField(selectedSvip._id, "roomBg")}
              />

              <AssetBox
                title="Entry Effect"
                file={selectedSvip?.entryEffect}
                onDelete={() =>
                  handleDeleteField(selectedSvip._id, "entryEffect")
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= ASSET BOX ================= */
const AssetBox = ({ title, file, onDelete }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (file && file.endsWith(".svga") && ref.current) {
      const player = new SVGA.Player(ref.current);
      const parser = new SVGA.Parser(ref.current);

      parser.load(baseURL + file, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }
  }, [file]);

  return (
    <div className="col-md-4 mb-4 text-center" style={{ position: "relative" }}>
      {/* TITLE */}
      <h6 className="text-white">{title}</h6>

      {/* DELETE ICON */}
      {file && (
        <i
          className="fas fa-trash text-danger"
          onClick={onDelete}
          style={{
            position: "absolute",
            top: 10,
            right: 25,
            cursor: "pointer",
          }}
        />
      )}

      {/* CONTENT */}
      {!file ? (
        <p style={{ color: "orange" }}>No data available</p>
      ) : file.endsWith(".svga") ? (
        <div ref={ref} style={{ width: 120, height: 120, margin: "auto" }} />
      ) : (
        <img
          src={baseURL + file}
          alt={title}
          style={{ width: 120, height: 120 }}
          onError={(e) => (e.target.src = noImage)}
        />
      )}
    </div>
  );
};

export default connect(null, { getSVIPS, deleteSvip, deleteSvipField })(Svip);
