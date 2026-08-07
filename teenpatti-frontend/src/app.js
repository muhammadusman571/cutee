import { useEffect, useState } from "react";
import "./style/app.css";
import io from "socket.io-client";
import Frame from "./components/frame";
import Profile from "./components/profile";
import UserProfile from "./components/userprofile";
import CoinBtn from "./components/coinBtn";
import starCoin from "./images/starCoin.png";
import dark1 from "./images/001Dark.png";
import dark2 from "./images/002Dark.png";
import dark3 from "./images/003Dark.png";
import winnerCard1 from "./images/Group 6.png";
import winnerCard2 from "./images/Group 3.png";
import winnerCard3 from "./images/Group 1.png";
import light1 from "./images/001Light.png";
import light2 from "./images/002Light.png";
import light3 from "./images/003Light.png";
import coin2k from "./images/2K.png";
import coin5k from "./images/5K.png";
import coin10k from "./images/10K.png";
import coin20k from "./images/20K.png";
import coin50k from "./images/50K.png";
import audioPath from "./sounds/coins-sound.mp3";
import musicOn from "./images/music-on.png";
import musicOff from "./images/music-off.png";
import history from "./images/history.png";
import rules from "./images/rules.png";
import king from "./images/king.png";
import clock from "./images/clock.png";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import History from "./components/History";
import Rulse from "./components/Rulse";
import GameBlock from "./components/GameBlock";
import { adminBaseURL, baseURL, key } from "./config";
import Toast from "./components/Toast";

// Static Variables
let updatedUserBalance = false;
let currentGame = {};
let selectedCoin = 0;
let canSoundPlay = true;
//Array --

let lastGame = [-1, -1];
let frames = [dark1, dark2, dark3];
let winnerFrames = [winnerCard1, winnerCard2, winnerCard3];
let framesTotalMine = [0, 0, 0];
let framesTotalCoins = [0, 0, 0];

let ribbons = [
  [false, 0, ""],
  [false, 0, ""],
  [false, 0, ""],
];

let arrCards = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let arrCoins = [[], [], []];

const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get("id");

const socket = io.connect(baseURL, {
  transports: ["websocket", "polling", "flashsocket"],
  query: { userId: userId },
});

axios.defaults.headers.common["key"] = key;

function App() {
  //Dynamic -- Variables
  const [open, setOpen] = useState(false);
  const [openRules, setOpenRules] = useState(false);

  const [gameStart, setGameStart] = useState(false);

  const [user, setUser] = useState({});
  const [isVisibleTimer, setIsVisibleTimer] = useState(0);
  const [canPressCoins, setCanPressCoins] = useState(false);
  const [timerText, setTimerText] = useState("0s");
  // const [currentState, setCurrentState] = useState("GameBoard");
  const [canCardShow, setCanCardShow] = useState(true);
  //Arrays--
  const [arrProfiles, setArrProfile] = useState([{}]);
  const [gameBlock, setGameBlock] = useState(false);

  const [winHistory, setWinHistory] = useState(0);

  useEffect(() => {
    if (userId) {
      socket.emit("startGame", {});
      socket.on("block", (block) => {
        setGameBlock(block?.gameBlock);
      });
    }
  }, [userId]);

  const [gameCoin, setGameCoin] = useState([]);
  const [storeCoins, setStoreCoins] = useState(0);
  const [clockTime, setClockTime] = useState(0);

  useEffect(() => {
    console.log("adminBaseURL", adminBaseURL);
    axios
      .get(`${adminBaseURL}setting`)
      .then((res) => {
        setGameCoin(res?.data?.setting?.gameCoin);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (socket) {
    socket.off("start").on("start", (obj) => {
      console.log("obj", obj);
      if (obj) {
        setStoreCoins(obj.diamond);
        setUser(obj);
      } else {
        socket?.emit("startGame", {});
      }
      // setCurrentState("GameBoard");
    });

    socket.off("time").on("time", (time) => {
      // if (currentState === "GameBoard") {
      updateTime(time);
      setClockTime(time);

      // }
    });

    socket.off("bit").on("bit", () => {
      playSound();
    });

    socket.off("topUsers").on("topUsers", (topUsers) => {
      const order = [0, 1, 2, 3, 4]; // Index order
      const ranks = [1, 2, 3, 4, 5]; // Corresponding ranks

      const myTopUsers = order.reduce((acc, idx, i) => {
        const userObj = topUsers[idx];
        if (userObj?.User) {
          acc.push({
            number: ranks[i],
            name: userObj.User.Username,
            src: userObj.User.ProfileUrl,
          });
        }
        return acc;
      }, []);

      setArrProfile(myTopUsers);
    });

    socket.off("game").on("game", (obj) => {
      updateGame(obj);
      setGameStart(!gameStart);
    });
  }

  if (socket) {
    socket.off("start").on("start", (obj) => {
      if (obj) {
        setStoreCoins(obj.diamond);
        setUser(obj);
      } else {
        socket?.emit("startGame", {});
      }
      // setCurrentState("GameBoard");
    });

    socket.off("time").on("time", (time) => {
      // if (currentState === "GameBoard") {
      updateTime(time);
      setClockTime(time);

      // }
    });

    socket.off("bit").on("bit", () => {
      playSound();
    });

    socket.off("game").on("game", (obj) => {
      updateGame(obj);
      setGameStart(!gameStart);
    });
  }

  const convertToShortForm = (number) => {
    if (number >= 1000) {
      const suffixes = ["", "k", "M", "B", "T"];
      const magnitude = Math.floor(Math.log10(number) / 3);
      const shortNumber = (number / Math.pow(1000, magnitude)).toFixed(0);

      setWinCoin(shortNumber + suffixes[magnitude]);
    }

    setWinCoin(number?.toString());
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenRules = () => {
    setOpenRules(true);
  };

  //Functions---
  const playSound = () => {
    if (canSoundPlay) {
      let audio = new Audio(audioPath);
      audio.play();
    }
  };

  const hideCards = () => {
    frames = [dark1, dark2, dark3];
    arrCards = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    ribbons = [
      [false, 0, ""],
      [false, 0, ""],
      [false, 0, ""],
    ];
  };

  const showCards = () => {
    const combinations = currentGame.Combinations;

    const values = combinations.map((c) => c.value);
    const winnerIndex = values.indexOf(Math.min(...values));

    frames = [dark1, dark2, dark3].map((frame, i) =>
      i === winnerIndex ? [light1, light2, light3][i] : frame,
    );

    arrCards = combinations.map((combo) => combo.combination.slice(0, 3));
    ribbons = combinations.map((combo, i) => [
      true,
      i === winnerIndex ? 1 : 0,
      combo.combination[3],
    ]);
  };

  const [winCoin, setWinCoin] = useState(0);

  socket.on("history", (history) => {
    setWinHistory(history);
  });

  const updateTime = (time) => {
    const combinationsReady = currentGame?.Combinations?.length === 3;

    if (time === 21) {
      selectedCoin = gameCoin[0];
      setIsVisibleTimer(0);
      setCanCardShow(true);
      return;
    }

    if (time >= 4) {
      setCanPressCoins(true);
      setIsVisibleTimer(1);
      updatedUserBalance = false;
      setTimerText(`${time}s`);
      return;
    }

    if (time >= 0 && time <= 3) {
      setCanPressCoins(false);
      setIsVisibleTimer(1);
      updatedUserBalance = false;
      setTimerText(`${time}s`);
      return;
    }

    if (time <= -1 && time > -5) {
      setCanCardShow(true);
      setCanPressCoins(false);
      setIsVisibleTimer(0);
      selectedCoin = -1;

      if (combinationsReady) showCards();
      return;
    }

    if (time === -5 && !updatedUserBalance && combinationsReady) {
      setCanCardShow(true);
      updatedUserBalance = true;

      const [value1, value2, value3] = currentGame.Combinations.map(
        (c) => c.value,
      );
      const winnerIndex = [value1, value2, value3].indexOf(
        Math.min(value1, value2, value3),
      );

      const totalMineCoin = framesTotalMine.reduce((a, b) => a + b, 0);
      socket.emit("totalMineCoin", totalMineCoin, user._id);

      const frameWinAmount = framesTotalMine[winnerIndex] * 2.9;
      user.diamond += frameWinAmount;

      const userData = { ...user, diamond: user.diamond };

      convertToShortForm(frameWinAmount);
      setUser(user);

      socket.emit("user", {
        User: userData,
        winCoin: frameWinAmount,
      });

      return;
    }

    if (time <= 1 && time >= -9) {
      hideCards();
      setCanCardShow(false);
      setIsVisibleTimer(1);
      setTimerText(`Start in ${10 + time}s`);
      return;
    }
  };

  const updateGame = (obj) => {
    currentGame = obj;
    arrCoins = [[], [], []];
    obj.UsersBits.map((userBit) => {
      if (userBit.SelectedFrame === 1) {
        arrCoins = [
          arrCoins[0].concat({
            coin: userBit.Bit,
            left: userBit.Left,
            top: userBit.Top,
          }),
          arrCoins[1],
          arrCoins[2],
        ];
      } else if (userBit.SelectedFrame === 2) {
        arrCoins = [
          arrCoins[0],
          arrCoins[1].concat({
            coin: userBit.Bit,
            left: userBit.Left,
            top: userBit.Top,
          }),
          arrCoins[2],
        ];
      } else if (userBit.SelectedFrame === 3) {
        arrCoins = [
          arrCoins[0],
          arrCoins[1],
          arrCoins[2].concat({
            coin: userBit.Bit,
            left: userBit.Left,
            top: userBit.Top,
          }),
        ];
      }
    });
    calculateTotalCoins();
    calculateTotalMines();
  };

  const getAmount = (coin) => {
    return gameCoin.includes(coin) ? coin : 0;
  };

  const addBit = (bitcoin, myframe) => {
    let amount = getAmount(bitcoin);
    if (bitcoin != -1 && myframe !== 0) {
      if (user?.diamond - amount >= 0) {
        user.diamond -= amount;
        socket.emit("bit", {
          User: user,
          Bit: bitcoin,
          diamond: amount,
          SelectedFrame: myframe,
        });
      } else {
        Toast("You don't enough diamond now, please  recharge first!");
      }
    } else {
      Toast("Missing to select any Coin");
    }
  };

  const calculateTotalCoins = () => {
    const coinTotals = [0, 0, 0];

    if (Array.isArray(currentGame.UsersBits)) {
      currentGame.UsersBits.forEach((userBit) => {
        const frameIdx = userBit.SelectedFrame - 1;
        if (frameIdx >= 0 && frameIdx < 3) {
          coinTotals[frameIdx] += getAmount(userBit.Bit);
        }
      });
    }

    framesTotalCoins = coinTotals;
  };

  const calculateTotalMines = () => {
    const mineTotals = [0, 0, 0];

    if (Array.isArray(currentGame.UsersBits)) {
      currentGame.UsersBits.forEach((userBit) => {
        if (userBit.UserId === user._id) {
          const frameIdx = userBit.SelectedFrame - 1;
          if (frameIdx >= 0 && frameIdx < 3) {
            mineTotals[frameIdx] += getAmount(userBit.Bit);
          }
        }
      });
    }

    framesTotalMine = mineTotals;
  };

  const startGame = (e) => {
    if (userId) {
      socket.emit("startGame", {});
    }
  };
  const handleCoinClick = (index) => {
    selectedCoin = gameCoin[index];
  };

  const coinImages = [coin2k, coin5k, coin10k, coin20k, coin50k];

  const clickFrame1 = (e) => {
    if (selectedCoin >= 0) {
      addBit(selectedCoin == 0 ? gameCoin[0] : selectedCoin, 1);
      lastGame = [selectedCoin == 0 ? gameCoin[0] : selectedCoin, 1];
    }
  };
  const clickFrame2 = (e) => {
    if (selectedCoin >= 0) {
      addBit(selectedCoin == 0 ? gameCoin[0] : selectedCoin, 2);
      lastGame = [selectedCoin == 0 ? gameCoin[0] : selectedCoin, 2];
    }
  };

  const clickFrame3 = (e) => {
    if (selectedCoin >= 0) {
      addBit(selectedCoin == 0 ? gameCoin[0] : selectedCoin, 3);
      lastGame = [selectedCoin == 0 ? gameCoin[0] : selectedCoin, 3];
    }
  };

  const changeSoundState = (e) => {
    if (canSoundPlay) {
      canSoundPlay = false;
    } else {
      canSoundPlay = true;
    }
  };

  const repeatLastGame = () => {
    if (lastGame[0] != -1 && lastGame[1] != -1) {
      addBit(lastGame[0], lastGame[1]);
    }
  };

  const profilesRender = arrProfiles.map((obj, i) => (
    <Profile key={i} name={obj.name} src={obj.src} />
  ));

  return (
    <div>
      {gameBlock ? (
        <GameBlock
          className="disabled"
          dialog={gameBlock}
          setDialog={setGameBlock}
        />
      ) : (
        user && (
          <div className="grid board text-center">
            <div className="row w-80 cardMargin">
              <Frame
                coins={framesTotalCoins[0]}
                mine={framesTotalMine[0]}
                gameCoin={gameCoin}
                src={
                  ribbons[0][1] == 1
                    ? winnerFrames[0]
                    : ribbons[0][0]
                      ? frames[0]
                      : frames[0]
                }
                card1={arrCards[0][0]}
                card2={arrCards[0][1]}
                card3={arrCards[0][2]}
                arrCoins={arrCoins[0]}
                isVisibleRibbon={ribbons[0][1]}
                ribbonIdx={ribbons[0][1]}
                ribbonText={ribbons[0][2]}
                onClick={clickFrame1}
                canCardShow={canCardShow}
                disabledClass={canPressCoins === false ? "disabled" : ""}
              />
              <Frame
                coins={framesTotalCoins[1]}
                mine={framesTotalMine[1]}
                gameCoin={gameCoin}
                src={
                  ribbons[1][1] == 1
                    ? winnerFrames[1]
                    : ribbons[1][0]
                      ? frames[1]
                      : frames[1]
                }
                card1={arrCards[1][0]}
                card2={arrCards[1][1]}
                card3={arrCards[1][2]}
                arrCoins={arrCoins[1]}
                isVisibleRibbon={ribbons[1][1]}
                ribbonIdx={ribbons[1][1]}
                ribbonText={ribbons[1][2]}
                onClick={clickFrame2}
                canCardShow={canCardShow}
                disabledClass={canPressCoins === false ? "disabled" : ""}
              />
              <Frame
                coins={framesTotalCoins[2]}
                mine={framesTotalMine[2]}
                gameCoin={gameCoin}
                src={
                  ribbons[2][1] == 1
                    ? winnerFrames[2]
                    : ribbons[2][0]
                      ? frames[2]
                      : frames[2]
                }
                card1={arrCards[2][0]}
                card2={arrCards[2][1]}
                card3={arrCards[2][2]}
                arrCoins={arrCoins[2]}
                isVisibleRibbon={ribbons[2][1]}
                ribbonIdx={ribbons[2][1]}
                ribbonText={ribbons[2][2]}
                onClick={clickFrame3}
                canCardShow={canCardShow}
                disabledClass={canPressCoins === false ? "disabled" : ""}
              />
            </div>

            {timerText == "1s" && (
              <div className="showingCard">Showing Card</div>
            )}

            {clockTime <= "-6" &&
              clockTime >= "-9" &&
              (framesTotalMine[0] + framesTotalMine[1] + framesTotalMine[2] !==
              0 ? (
                winCoin > 0 ? (
                  <>
                    <div className="showingCard" style={{ color: "#FDE188" }}>
                      <img src={king} width="25px" height="25px" />
                      <span> </span>
                      <span>
                        Right On! you Win
                        <span style={{ color: "#dd1054" }}>
                          {" " + parseInt(winCoin) + " "}
                        </span>
                        Diamonds
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="showingCard" style={{ color: "#FDE188" }}>
                    {" "}
                    Sorry! Better luck next Time
                  </div>
                )
              ) : (
                ""
              ))}

            <div
              className="row"
              style={{ merginTop: "0vh", padding: "0vh", height: "1vh" }}
            >
              <div>
                <img src={starCoin} className="UserCoin-images" />
              </div>
              <div
                className="col"
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginTop: "-1vh",
                  marginLeft: "3vh",
                }}
              >
                <p>
                  <span style={{ fontWeight: "bolder" }}>{user?.diamond}</span>
                </p>
              </div>
            </div>
            <div className="row" style={{ marginTop: "-3vh" }}>
              {gameCoin.map((coin, index) => (
                <CoinBtn
                  key={index}
                  src={coinImages[index]}
                  number={coin}
                  funcClick={() => handleCoinClick(index)}
                  selectedClass={selectedCoin === coin ? "selectedCoin" : ""}
                  disabledClass={canPressCoins === false ? "disabled" : ""}
                />
              ))}

              <div className="row">
                <button
                  className={
                    "btn " + (canPressCoins === false ? "disabled" : "")
                  }
                  style={{ marginLeft: "5vh" }}
                  onClick={repeatLastGame}
                >
                  Repeat
                </button>
              </div>
            </div>

            <div className="row timer" style={{ opacity: isVisibleTimer }}>
              <div className="col">{timerText}</div>
              <div className="col">
                <img className="clock" src={clock} alt=""></img>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                margin: "5px",
              }}
            >
              <button
                className="musicBtn"
                style={{
                  backgroundImage: `url("${
                    canSoundPlay === true ? musicOn : musicOff
                  }")`,
                }}
                onClick={changeSoundState}
              ></button>
            </div>
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                margin: "5px",
              }}
            >
              <button
                className="historyIcon"
                onClick={handleClickOpen}
                style={{
                  backgroundImage: `url("${history}")`,
                  marginRight: "8px",
                }}
              ></button>
              {open && <History dialog={open} setDialog={setOpen} />}
              <button
                className="historyIcon"
                onClick={handleClickOpenRules}
                style={{
                  backgroundImage: `url("${rules}")`,
                }}
              ></button>
              {openRules && (
                <Rulse dialog={openRules} setDialog={setOpenRules} />
              )}
            </div>
            <ToastContainer />
          </div>
        )
      )}
    </div>
  );
}

export default App;
