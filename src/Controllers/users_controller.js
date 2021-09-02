const User = require("../Models/user");
var authenticate = require("../authenticate");
const validationResult = require("express-validator").body;
const mailSender = require("../mail_sender");

//validations
function validateEmail(req, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Email is not valid, Please enter a valid one.");
    error.status = 422;
    next(error);
  }
}

function validateIncompleteData(req, next) {
  if (!req.body.name && req.body.email) {
    const error = new Error("Incomplete data, Please check again.");
    error.status = 422;
    next(error);
  }
}

//endpoints
function signUp(req, res, next) {
  validateIncompleteData(req, next);
  validateEmail(req, next);
  User.register(
    new User({
      username: req.body.email,
      email: req.body.email,
      name: req.body.name,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json("A user with the given email is already registered");
        return;
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
          return;
        }

        let token = authenticate.getToken({ _id: req.body.email }, "20m");

        mailSender.SendVerifyMail(req.body.email, token).catch(console.error);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          Token: token,
          status: "verification link was sent to your mail.",
        });
      });
    }
  );
}

function logIn(req, res, next) {
  User.findOne({ email: req.body.username })
    .then(
      (user) => {
        if (!user.verified) {
          console.log(user.verified);
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json("Your email is not verified yet");
          return;
        }
        let token = authenticate.getToken({ _id: req.body.username }, "24h");
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          token: token,
          status: "You are successfully logged in!",
        });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
}

function verifyUser(req, res, next) {
  const verifiedToken = authenticate.verifyToken(req.query.token);
  if (verifiedToken == "error") {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json("Incorrect or expired link.");
    return;
  }
  User.findOneAndUpdate(
    { email: verifiedToken._id },
    { $set: { verified: true } },
    (err, user) => {
      if (err) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.json("Database error.");
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json("Email verification is successful");
    }
  );
}
module.exports = {
  signUp,
  logIn,
  verifyUser,
};
