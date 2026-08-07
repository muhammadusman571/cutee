const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 5004;

app.listen(PORT, () => {
  console.log("Magic happens on port: " + PORT);
});
