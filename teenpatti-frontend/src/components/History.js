import * as React from "react";
import "../style/history.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { useState, useEffect } from "react";
import { baseURL } from "../config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const History = ({ dialog, setDialog }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setDialog(false);

  // 🔒 Body scroll completely lock
  useEffect(() => {
    if (dialog) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [dialog]);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}/gameHistory/result`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => setData(res.gameHistories))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const ROWS = 10;

  const APP_BAR_HEIGHT = 48;
  const HEADER_HEIGHT = 40;

  const TOTAL_HEIGHT = window.innerHeight - APP_BAR_HEIGHT - HEADER_HEIGHT;
  const ROW_HEIGHT = TOTAL_HEIGHT / ROWS;

  return (
    <Dialog
      fullScreen
      open={dialog}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          overflow: "hidden",
        },
      }}
    >
      {/* AppBar */}
      <AppBar
        sx={{ position: "sticky", top: 0 }}
        className="bg-white border-bottom"
      >
        <Toolbar sx={{ minHeight: APP_BAR_HEIGHT }}>
          <Typography
            sx={{ ml: 1, flex: 1 }}
            variant="h6"
            className="text-dark"
          >
            <span>{"< "}</span> History
          </Typography>

          <Button color="inherit" onClick={handleClose} className="fw-bold">
            Close
          </Button>
        </Toolbar>
      </AppBar>

      {/* Header */}
      <div
        className="row bg-light sticky-top"
        style={{
          top: APP_BAR_HEIGHT,
          zIndex: 10,
          height: HEADER_HEIGHT,
          alignItems: "center",
          margin: 0,
        }}
      >
        <div className="col-4">
          <h2
            className="text-center historyFont"
            style={{ color: "#ff7a00", margin: 0 }}
          >
            A
          </h2>
        </div>

        <div className="col-4">
          <h2
            className="text-center historyFont"
            style={{ color: "#ffa800", margin: 0 }}
          >
            B
          </h2>
        </div>

        <div className="col-4">
          <h2
            className="text-center historyFont"
            style={{ color: "#eec800", margin: 0 }}
          >
            C
          </h2>
        </div>
      </div>

      {/* History Records */}
      <div style={{ padding: "2px" }}>
        {loading ? (
          <div className="col-sm-6 text-center mx-auto">
            <div className="loader1">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.1}s` }}></span>
              ))}
            </div>
          </div>
        ) : data?.length > 0 ? (
          data.map((history, i) => (
            <div
              key={i}
              className="row"
              style={{
                height: ROW_HEIGHT,
                margin: 0,
              }}
            >
              {history.cardCoin.map((item, j) => (
                <div
                  key={j}
                  className="col-4 d-flex justify-content-center align-items-center"
                >
                  <p
                    className={`${
                      item.winner ? "bg-danger" : "failButton"
                    } border rounded-circle winCircle`}
                    style={{ width: "32px", height: "32px", fontSize: "12px" }}
                  >
                    {item.winner ? "Win" : "Lose"}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center mt-2">No Data Found !!</p>
        )}
      </div>
    </Dialog>
  );
};

export default History;
