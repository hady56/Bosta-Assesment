const User = require("../Models/user");
const Check = require("../Models/check");
const mailSender = require("../mail_sender");
const monitor = require("../up_time_monitor");

//endpoints
function addNewCheck(req, res, next) {
  Check.create(req.body)
    .then(
      async (check) => {
        const response = await monitor.monitorurl(check, checkStatus);
        if (response.duration) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(check);
          return;
        }

        //if the user data turns to be wrong delete the data from database
        await Check.findOneAndRemove({ _id: check._id });
        res.statusCode = 400;
        res.end("Wrong data input please check your input again");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
}

function checkStatus(check, res, err) {
  
    if (res.isAxiosError) {
      console.log("down");
    } else {
      console.log("up");
    }
  
}

module.exports = { addNewCheck, checkStatus };
