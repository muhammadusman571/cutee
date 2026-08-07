import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getSignReward, deleteSignReward } from "../../store/SignReward/action";
import { baseURL } from "../../util/Config";
import noImage from "../../assets/images/noImage.png";
import { warning } from "../../util/Alert";
import SignRewardDialogue from "./SignRewardDialogue";
import { OPEN_DIALOGUE_SIGN_REWARD } from "../../store/SignReward/type";
import SVGA from "svgaplayerweb";

const SignReward = (props) => {
  const dispatch = useDispatch();
  const { signReward = [] } = useSelector((state) => state.signReward || {});
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getSignReward());
  }, [dispatch]);

  useEffect(() => {
    setData(signReward);
  }, [signReward]);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const filterData = signReward.filter((item) => {
        return (
          item?.diamond?.toString()?.includes(value) ||
          item?.day?.toString()?.includes(value) ||
          item?.name?.toUpperCase()?.includes(value)
        );
      });
      setData(filterData);
    } else {
      setData(signReward);
    }
  };

  const handleOpen = () => {
    dispatch({
      type: OPEN_DIALOGUE_SIGN_REWARD,
      payload: { data: null, type: "open" },
    });
  };

  const handleEdit = (item) => {
    dispatch({
      type: OPEN_DIALOGUE_SIGN_REWARD,
      payload: { data: item, type: "edit" },
    });
  };

  const handleDelete = (id) => {
    warning().then((isDeleted) => {
      if (isDeleted) {
        props.deleteSignReward(id);
      }
    });
  };

  // Render image or SVGA player
  const renderMedia = (item) => {
    if (!item?.image)
      return (
        <img
          src={noImage}
          alt=""
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            margin: "10px auto",
          }}
        />
      );

    const extension = item.image.split(".").pop().toLowerCase();
    if (extension === "svga") {
      return (
        <div
          id={`svga-${item._id}`}
          style={{ width: 100, height: 100, margin: "10px auto" }}
          ref={(el) => {
            if (el && !el.dataset.loaded) {
              const player = new SVGA.Player(el);
              const parser = new SVGA.Parser();
              parser.load(baseURL + item.image, (videoItem) => {
                player.setVideoItem(videoItem);
                player.startAnimation();
                el.dataset.loaded = true;
              });
            }
          }}
        />
      );
    } else {
      return (
        <img
          src={baseURL + item.image}
          alt=""
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            margin: "10px auto",
          }}
        />
      );
    }
  };

  return (
    <div>
      <div className="page-title">
        <h3 className="text-white">Sign Reward</h3>
      </div>

      <div className="main-wrapper">
        <div className="row mb-3">
          <div className="col-6">
            <button className="btn btn-danger btn-sm" onClick={handleOpen}>
              + New Reward
            </button>
          </div>

          <div className="col-6">
            <input
              type="search"
              placeholder="Search..."
              className="form-control"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="row">
          {data?.length > 0 ? (
            data.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="card p-3 mb-3"
                  style={{ background: "#1e1e2f" }}
                >
                  {/* Day */}
                  <h5 className="text-warning">Day {item?.day}</h5>

                  {/* Image or SVGA */}
                  {renderMedia(item)}

                  {/* Name */}
                  <h6 className="text-white text-center">{item?.name}</h6>

                  {/* Diamond */}
                  <h6 className="text-info text-center">💎 {item?.diamond}</h6>

                  {/* Actions */}
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item?._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No Data Found</p>
          )}
        </div>
      </div>

      <SignRewardDialogue signReward={signReward} />
    </div>
  );
};

export default connect(null, { getSignReward, deleteSignReward })(SignReward);
