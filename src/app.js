const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const up = require("./up_time_monitor");
const usersRouter = require("./Routers/user_router");
const checkRouter = require("./Routers/check_router");
const passport = require("passport");
require("dotenv").config();
const axios = require('axios').default

const mongoURL = process.env.MONGOURL;

const connect = mongoose.connect(mongoURL);
connect.then(
  (db) => {
    console.log("the server started correctly");
  },
  (err) => {
    console.log(err);
  }
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/users", usersRouter);
app.use("/checks", checkRouter);



module.exports = app;
