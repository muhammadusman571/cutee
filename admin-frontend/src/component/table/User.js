import React, { useEffect, useRef, useState } from "react";

//dayjs
import dayjs from "dayjs";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getUser, handleBlockUnblockSwitch } from "../../store/user/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// import arraySort from "array-sort";

//image
import Male from "../../assets/images/male.png";
import noImage from "../../assets/images/noImage.png";

//pagination
import Pagination from "../../pages/Pagination";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//h
import { MdNotificationsActive } from "react-icons/md";
import { OPEN_NOTIFICATION_DIALOG } from "../../store/notification/types";
import GiveOfficialFrameDialog from "../dialog/GiveFrameDialog";
import { OPEN_GIVE_OFFICIAL_FRAME_DIALOGUE } from "../../store/OfficialFrames/type";
import SVGA from "svgaplayerweb";
import { baseURL } from "../../util/Config";
import { removeOfficialFrame } from "../../store/OfficialFrames/action";
import { OPEN_GIVE_UPLOAD_TAG_DIALOGUE } from "../../store/uploadTage/type";
import GiveFrameDialog from "../dialog/GiveFrameDialog";
import GiveUploadTagDialog from "../dialog/GiveUploadTagDialog";
import { OPEN_GIVE_UPLOAD_BADGE_DIALOGUE } from "../../store/uploadBadge/type";
import GiveUploadBadgeDialog from "../dialog/GiveUploadBadgeDialog";
const UserTable = (props) => {
  const navigate = useNavigate();
  const maxDate = new Date();
  const dispatch = useDispatch();
  const { user, activeUser, male, female, totalUser } = useSelector(
    (state) => state.user,
  );

  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState("");
  const [search, setSearch] = useState("ALL");
  const [diamondSort, setDiamondSort] = useState("asc");
  const [rCoinSort, setRcoindSort] = useState("asc");

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [date, setDate] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return [
      {
        startDate: startOfMonth,
        endDate: endOfMonth,
        key: "selection",
      },
    ];
  });

  // const [sDate, setsDate] = useState(() => {
  //   const startOfMonth = new Date();
  //   startOfMonth.setDate(1);
  //   return dayjs(startOfMonth).format('YYYY/M/DD');
  // });

  // const [eDate, seteDate] = useState(() => {
  //   const endOfMonth = new Date();
  //   endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
  //   return dayjs(endOfMonth).format('YYYY/M/DD');
  // });

  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  // Add formatted date variables
  const formattedStart =
    sDate === "ALL" ? "ALL" : dayjs(sDate).format("YYYY/M/DD");
  const formattedEnd =
    eDate === "ALL" ? "ALL" : dayjs(eDate).format("YYYY/M/DD");

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker");
    });
  }, []);

  useEffect(() => {
    setData(user);
  }, [user]);

  useEffect(() => {
    dispatch(
      getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
    );
  }, [activePage, rowsPerPage, formattedStart, formattedEnd]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker");
    setData(user);
  }, [date]);
  // }, [date, user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page"));
    const limitNum = parseInt(urlParams.get("limit"));

    if (!isNaN(page) && page > 0) {
      setActivePage(page);
    }
    if (!isNaN(limitNum) && limitNum > 0) {
      setRowsPerPage(limitNum);
      setLimit(limitNum);
    }

    if (page && limitNum) {
      dispatch(getUser(page, limitNum, search, formattedStart, formattedEnd));
    }
  }, [window.location.search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleBlockUnblockSwitch_ = (userId) => {
    props.handleBlockUnblockSwitch(userId);
  };

  // const handleUserInfo = (user) => {
  //   sessionStorage.setItem('user', JSON.stringify(user));
  //   navigate('/admin/user/detail');
  // };
  // const handleUserHistory = (user) => {
  //   sessionStorage.setItem('user', JSON.stringify(user));
  //   navigate('/admin/user/history');
  // };

  const getAllUser = () => {
    setActivePage(1);
    setRowsPerPage(10);
    setSearch("ALL");
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").css("display", "none");
    dispatch(getUser(activePage, rowsPerPage, search, sDate, eDate));
  };

  const collapsedDatePicker = () => {
    const datePicker = $("#datePicker");
    if (datePicker.css("display") === "none") {
      datePicker.css("display", "block");
    } else {
      datePicker.css("display", "none");
    }
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", Male);
    });
  });

  const handleDateFilter = () => {
    setActivePage(1);
    $("#datePicker").css("display", "none");
    dispatch(
      getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
    );
    setsDate("ALL");
    seteDate("ALL");
  };

  const handleDaimondSort = () => {
    setDiamondSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getUser(
        activePage,
        rowsPerPage,
        search,
        formattedStart,
        formattedEnd,
        diamondSort ? diamondSort : null,
        rCoinSort ? rCoinSort : null,
      ),
    );
  };
  const handlerCoinSort = () => {
    setRcoindSort((prev) => (prev === "asc" ? "desc" : "asc"));
    dispatch(
      getUser(
        activePage,
        rowsPerPage,
        search,
        formattedStart,
        formattedEnd,
        diamondSort ? diamondSort : null,
        rCoinSort ? rCoinSort : null,
      ),
    );
  };

  const handleOpen = (userId) => {
    setSelectedUserId(userId);

    dispatch({
      type: OPEN_NOTIFICATION_DIALOG,
      payload: userId,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const trimmedValue = value.trim().toUpperCase();

    if (trimmedValue) {
      const filtered = user.filter((data) => {
        return (
          data?.name?.toUpperCase()?.includes(trimmedValue) ||
          data?.uniqueId?.toString()?.includes(trimmedValue) ||
          data?.gender?.toString()?.toUpperCase()?.includes(trimmedValue) ||
          data?.diamond?.toString()?.includes(trimmedValue)
        );
      });
      setData(filtered);
    } else {
      setData(user);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(
        getUser(activePage, rowsPerPage, search, formattedStart, formattedEnd),
      );
      setActivePage(1);
    }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light" style={{ color: "#e4eeff" }}>
              User
            </h3>
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
                <li className="breadcrumb-item active " aria-current="page">
                  User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-2 col-sm-12">
          <div className="row">
            <div className="col-lg-4">
              <div className="card stats-card">
                <div className="card-body">
                  <div className="stats-info">
                    <h5 className="card-title">
                      {male ? male : 0}
                      {/* <span className="stats-change stats-change-danger">-8%</span> */}
                    </h5>
                    <p className="stats-text">Male</p>
                  </div>
                  <div className="stats-icon change-danger">
                    <i className="material-icons">male</i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card stats-card">
                <div className="card-body">
                  <div className="stats-info">
                    <h5 className="card-title">
                      {female ? female : 0}
                      {/* <span className="stats-change stats-change-danger">-8%</span> */}
                    </h5>
                    <p className="stats-text">Female</p>
                  </div>
                  <div className="stats-icon change-success">
                    <i className="material-icons">female</i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card stats-card">
                <div className="card-body">
                  <div className="stats-info">
                    <h5 className="card-title">{activeUser}</h5>
                    <p className="stats-text">Total Active User</p>
                  </div>
                  <div className="stats-icon change-pink">
                    <i className="material-icons">people</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card" id="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                    <button
                      className="btn btn-info"
                      style={{ marginRight: 5 }}
                      onClick={getAllUser}
                    >
                      All
                    </button>
                    <button
                      className="collapsed btn btn-info ml-5"
                      value="check"
                      data-toggle="collapse"
                      data-target="#datePicker"
                      onClick={collapsedDatePicker}
                    >
                      Analytics
                      <ExpandMoreIcon />
                    </button>
                    <p style={{ paddingLeft: 10 }} className="my-2 ">
                      {formattedStart !== "ALL" &&
                        formattedStart + " to " + formattedEnd}
                    </p>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right">
                  <form action="">
                    <div className="input-group mb-3 border rounded-pill">
                      <input
                        type="search"
                        id="searchBar"
                        autoComplete="off"
                        placeholder="What're you searching for?"
                        aria-describedby="button-addon4"
                        className="form-control bg-none border-0 rounded-pill searchBar"
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                      />
                      <div
                        className="input-group-prepend border-0"
                        htmlFor="searchBar"
                        onClick={() => {
                          const searchValue =
                            document.getElementById("searchBar")?.value;
                        }}
                      >
                        <div id="button-addon4" className="btn text-danger">
                          <i className="fas fa-search mt-2"></i>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div
                  id="datePicker"
                  className="date-picker-wrapper mt-5 pt-5"
                  aria-expanded="false"
                  style={{ display: "none" }}
                >
                  <div className="container table-responsive">
                    <div key={JSON.stringify(date)}>
                      <DateRangePicker
                        maxDate={maxDate}
                        onChange={(item) => {
                          setDate([item.selection]);
                          const dayStart = dayjs(
                            item.selection.startDate,
                          ).format("YYYY/M/DD");
                          const dayEnd = dayjs(item.selection.endDate).format(
                            "YYYY/M/DD",
                          );
                          setsDate(dayStart);
                          seteDate(dayEnd);
                        }}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        direction="horizontal"
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={handleDateFilter}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body card-overflow pt-0">
              <table className="table table-striped mt-2 text-center">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>UniqueId</th>
                    <th>Gender</th>
                    {/* <th>RCoin</th> */}
                    {/* <th>Diamond</th> */}
                    <th onClick={handlerCoinSort} style={{ cursor: "pointer" }}>
                      Rcoin {rCoinSort === "asc" ? " ▼" : " ▲"}
                    </th>
                    <th
                      onClick={handleDaimondSort}
                      style={{ cursor: "pointer" }}
                    >
                      Diamond {diamondSort === "asc" ? " ▼" : " ▲"}
                    </th>
                    <th>Country</th>
                    <th>Level</th>
                    <th>isBlock</th>
                    <th>isHost</th>
                    <th>Agency</th>
                    <th>Give Frame</th>
                    <th>Give Upload Tag</th>
                    <th>Give Upload Badge</th>
                    <th>Info</th>
                    <th>History</th>
                    <th>Notification</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div
                              style={{
                                position: "relative",
                                width: 60,
                                height: 60,
                                margin: "auto",
                              }}
                            >
                              {/* REMOVE FRAME BUTTON */}
                              {data.isOfficialFrame &&
                                data.avatarFrameImage &&
                                data.avatarFrameImage !== "" && (
                                  <button
                                    onClick={async () =>
                                      props.removeOfficialFrame(data._id)
                                    }
                                    style={{
                                      position: "absolute",
                                      top: -5,
                                      right: -5,
                                      background: "#fff",
                                      borderRadius: "50%",
                                      border: "1px solid #ccc",
                                      padding: "3px",
                                      width: 20,
                                      height: 20,
                                      cursor: "pointer",
                                      zIndex: 10,
                                    }}
                                  >
                                    <i
                                      className="fa fa-times"
                                      style={{
                                        color: "red",
                                        fontSize: 12,
                                        display: "block",
                                        margin: "auto",
                                      }}
                                    ></i>
                                  </button>
                                )}

                              {/* FRAME OVERLAY */}
                              {data.avatarFrameImage && (
                                <DisplayFrame frame={data.avatarFrameImage} />
                              )}

                              {/* AVATAR IMAGE */}
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.image ? data?.image : Male}
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                  border: "2px solid #fff",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                className="mx-auto"
                              />
                            </div>
                          </td>

                          <td>{data?.name ? data?.name : "-"}</td>
                          <td>{data?.uniqueId ? data?.uniqueId : "-"}</td>
                          <td>{data?.gender ? data?.gender : "-"}</td>
                          <td className="text-danger">
                            {data?.rCoin ? data?.rCoin : "0"}
                          </td>
                          <td className="text-danger">
                            {data?.diamond ? data?.diamond : "0"}
                          </td>
                          <td className="text-success flex items-center gap-2">
                            {data?.country ? (
                              <>
                                <img
                                  src={`https://flagcdn.com/w20/${data.country.toLowerCase()}.png`}
                                  alt={`${data.country} flag`}
                                  className="w-5 h-5 rounded-sm"
                                />
                                {data.country}
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-warning">
                            {data?.level?.name ? data?.level?.name : "-"}
                          </td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data?.isBlock}
                                onChange={() =>
                                  handleBlockUnblockSwitch_(data?._id)
                                }
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: `${
                                      data.isBlock ? "-24px" : "35px"
                                    }`,
                                    color: "#000",
                                    marginTop: "6px",
                                  }}
                                >
                                  {data?.isBlock ? "Yes" : "No"}
                                </p>
                              </span>
                            </label>
                          </td>
                          <td>{data?.isHost === false ? "No" : "Yes"}</td>
                          <td>
                            {data?.hostAgency ? data?.hostAgency?.name : "-"}
                          </td>
                          <td>
                            <Tooltip title="Give Frame">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  dispatch({
                                    type: OPEN_GIVE_OFFICIAL_FRAME_DIALOGUE,
                                    payload: data._id,
                                  });
                                }}
                              >
                                <i className="fas fa-gift fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="Upload Tag">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  const selectedTages = data?.uploadTags || [];

                                  dispatch({
                                    type: OPEN_GIVE_UPLOAD_TAG_DIALOGUE,
                                    payload: data._id,
                                    selectedTages: selectedTages,
                                  });
                                }}
                              >
                                <i className="fas fa-gift fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="Upload Badge">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  const selectedBadges =
                                    data?.uploadBadges || [];

                                  dispatch({
                                    type: OPEN_GIVE_UPLOAD_BADGE_DIALOGUE,
                                    payload: data._id,
                                    selectedBadges: selectedBadges,
                                  });
                                }}
                              >
                                <i className="fas fa-gift fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="Info">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    "user",
                                    JSON.stringify({
                                      ...data,
                                      currentPage: activePage,
                                      currentRowsPerPage: rowsPerPage,
                                    }),
                                  );
                                  navigate("/admin/user/detail");
                                }}
                              >
                                <i className="fas fa-info-circle fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="History">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    "user",
                                    JSON.stringify({
                                      ...data,
                                      currentPage: activePage,
                                      currentRowsPerPage: rowsPerPage,
                                    }),
                                  );
                                  navigate("/admin/user/history");
                                }}
                              >
                                <i className="fas fa-history fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn waves-effect waves-light btn-danger btn-sm float-left"
                              onClick={() => handleOpen(data._id)}
                            >
                              <span className="icon_margin">
                                <MdNotificationsActive size={20} />
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="12" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalUser}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <GiveOfficialFrameDialog />
      <GiveUploadTagDialog />
      <GiveUploadBadgeDialog />
    </>
  );
};

const DisplayFrame = ({ frame }) => {
  const svgaRef = useRef(null);

  useEffect(() => {
    if (frame && frame.endsWith(".svga") && svgaRef.current) {
      const player = new SVGA.Player(svgaRef.current);
      const parser = new SVGA.Parser(svgaRef.current);

      parser.load(baseURL + frame, (videoItem) => {
        player.setVideoItem(videoItem);
        player.startAnimation();
      });
    }
  }, [frame]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      {frame && frame.endsWith(".svga") ? (
        <div
          ref={svgaRef}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={frame ? baseURL + frame : noImage}
          alt="frame"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

export default connect(null, {
  getUser,
  handleBlockUnblockSwitch,
  removeOfficialFrame,
})(UserTable);
