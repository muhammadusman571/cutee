import React, { useEffect, useState } from "react";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getFakePost, deletePost, insertPost } from "../../store/post/action";

//routing
import { Link, useNavigate } from "react-router-dom";

//pagination
import Pagination from "../../pages/Pagination";

// dayjs
import dayjs from "dayjs";

// base url
import { baseURL } from "../../util/Config";

//alert
import { warning, alert } from "../../util/Alert";

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//image
import noImage from "../../assets/images/noImage.png";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const FakePost = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, totalPost } = useSelector((state) => state.post);

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState("");

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  useEffect(() => {
    setData(post);
  }, [post]);

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        getFakePost(null, activePage, rowsPerPage, sDate, eDate, "Fake")
      );
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage, sDate, eDate]);

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
    $("#datePicker").removeClass("show");
    setData(post);
  }, [date]);
  // }, [date, post]);

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
      dispatch(getFakePost(null, page, limitNum, sDate, eDate, "Fake"));
    }
  }, [window.location.search, dispatch, sDate, eDate]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    if (value !== "" && !isNaN(value) && value > 0) {
      setLimit(value);
      setRowsPerPage(value);
    } else {
      console.error("Invalid rowsPerPage value:", value);
    }
  };
  const handleDelete = (postId) => {
   

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
         
          props.deletePost(postId);
          alert("Deleted!", `Post has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  // const getAllPost = () => {
  //   setActivePage(1);
  //   setsDate('ALL');
  //   seteDate('ALL');
  //   $('#datePicker').removeClass('show');
  //   dispatch(getFakePost(null, activePage, rowsPerPage, sDate, eDate, 'Fake'));
  // };

  // const collapsedDatePicker = () => {
  //   $('#datePicker').toggleClass('collapse');
  // };

  const handleOpen = () => {
   

    sessionStorage.removeItem("fakePost");
    navigate("/admin/post/dialog");
  };

  const handleEdit = (data) => {
   

    sessionStorage.setItem("fakePost", JSON.stringify(data));
    navigate("/admin/post/dialog");
  };
  return (
    <>
      <div className="page-title">
        {props.type !== "fakePost" && (
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3 className="mb-3 text-muted">Fake Social Post</h3>
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
                    Fake Post
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col">
          <div className="card" id="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <button
                    type="button"
                    className="btn waves-effect waves-light btn-danger btn-sm float-left"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mt-lg-0 mt-xl-0">
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
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            dispatch(
                              getFakePost(null, activePage, rowsPerPage, sDate, eDate, "Fake" , e.target.value)
                            );
                            setActivePage(1);
                          }
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5"
                  aria-expanded="false"
                >
                  <div className="container table-responsive">
                    <div key={JSON.stringify(date)}>
                      <DateRangePicker
                        onChange={(item) => {
                          setDate([item.selection]);
                          const dayStart = dayjs(
                            item.selection.startDate
                          ).format("M/DD/YYYY");
                          const dayEnd = dayjs(item.selection.endDate).format(
                            "M/DD/YYYY"
                          );
                          setActivePage(1);
                          setsDate(dayStart);
                          seteDate(dayEnd);
                          props.getPost(
                            null,
                            activePage,
                            rowsPerPage,
                            sDate,
                            eDate,
                            "fake"
                          );
                        }}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        direction="horizontal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body card-overflow">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Post</th>
                    <th>Username</th>
                    <th>Unique Id</th>
                    <th>Location</th>
                    <th>Like</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Detail</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              className="mx-auto"
                              height="50px"
                              width="50px"
                              alt="app"
                              src={baseURL + data?.post}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,

                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{data.userId.username}</td>
                          <td>{data.userId.uniqueId}</td>
                          <td>{data.location}</td>
                          <td className="text-danger">{data.like}</td>
                          <td className="text-success">{data.comment}</td>
                          <td>{data.date}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                sessionStorage.setItem(
                                  "PostDetail",
                                  JSON.stringify({
                                    ...data,
                                    currentPage: activePage,
                                    currentRowsPerPage: rowsPerPage,
                                  })
                                );
                                navigate("/admin/post/detail");
                              }}
                            >
                              Detail
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm text-white"
                              onClick={() => handleEdit(data)}
                              style={{ backgroundColor: "#fc9494" }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(data._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalPost}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFakePost, deletePost, insertPost })(FakePost);
