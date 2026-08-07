import React, { useEffect, useRef } from "react";

//redux
import { useSelector, connect, useDispatch } from "react-redux";

//serverpath
import { baseURL } from "../util/Config";

//sweet alert
import { alert, warning } from "../util/Alert";

//action
import { deleteGift } from "../store/gift/action";

// type
import { OPEN_GIFT_DIALOG } from "../store/gift/types";

//routing
import { useNavigate } from "react-router-dom";

//image
import noImage from "../assets/images/noImage.png";

import SVGA from "svgaplayerweb";

const AllGift = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (giftId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteGift(giftId);
          alert("Deleted!", `Gift has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_GIFT_DIALOG, payload: data });
  };
  return (
    <>
      {props?.data?.gift?.length > 0 ? (
        props?.data?.gift?.map((data, index) => {
          return (
            <>
              <div
                className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4"
                key={index}
                onClick={() => {
                  sessionStorage.setItem("CategoryId", data._id);
                  // navigate("/admin/giftCategory/gift");
                }}
              >
                <div className="card contact-card card-bg">
                  <div className="card-body p-1">
                    <div className="row px-3 py-4 ">
                      <div className="col-4 ps-4">
                        <RenderSVGA data={data} />
                      </div>

                      <div
                        className="col-8 text-end pe-4"
                        style={{
                          padding: 0,
                          paddingLeft: 5,
                        }}
                      >
                        <div className="contact-card-info mt-2 mb-5 px-3">
                          <h2 className="text-white">Coin: {data?.coin}</h2>
                        </div>
                        <div className="px-3">
                          <i
                            className="fas fa-edit text-white p-2 bg-primary rounded-circle"
                            style={{ marginRight: 10, fontSize: 25 }}
                            onClick={() => handleEdit(data)}
                          ></i>

                          <i
                            className="fas fa-trash text-white p-2 bg-danger rounded-circle"
                            style={{ marginRight: 10, fontSize: 25 }}
                            onClick={() => handleDelete(data?._id)}
                          ></i>
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
    </>
  );
};

const RenderSVGA = ({ data }) => {
  const svgaRef = useRef(null);

  // useEffect(() => {
  //   if (data?.image && data?.image.endsWith(".svga") && svgaRef.current) {
  //     const player = new SVGA.Player(svgaRef.current);
  //     const parser = new SVGA.Parser(svgaRef.current);

  //     parser.load(
  //       data.image.startsWith("http") ? data.image : baseURL + data.image,
  //       (videoItem) => {
  //         player.setVideoItem(videoItem);
  //         player.startAnimation();
  //       }
  //     );
  //   }
  // }, [data?.image]);

  return (
    <div className="">
      {data?.thumbnail && data.thumbnail.endsWith(".svga") ? (
        <div
          ref={svgaRef}
          style={{
            width: "200px",
            height: "200px",

            boxShadow: "0 5px 15px 0 rgb(105 103 103 / 00%)",
            marginTop: 10,

            objectFit: "cover",
            borderRadius: "50%",
          }}
          className="mr-3"
        />
      ) : (
        <img
          src={
            data.thumbnail
              ? data.thumbnail.startsWith("http")
                ? data.thumbnail
                : baseURL + data.thumbnail
              : noImage
          }
          alt="SVIP Badge"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          className=" mr-3"
        />
      )}
    </div>
  );
};

export default connect(null, { deleteGift })(AllGift);
