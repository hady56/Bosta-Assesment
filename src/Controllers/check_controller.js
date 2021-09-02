const User = require("../Models/user");
const Check = require("../Models/check");
const mailSender = require("../mail_sender");
const monitor = require("../up_time_monitor");

//endpoints
function addNewCheck(req, res, next) {
    
  Check.create(req.body)
    .then(
      (check) => {
        console.log(monitor)
        let addNewCheck = monitor.monitorurl(check,checkStatus);
        console.log("Check created", check);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(check);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
}

function checkStatus(check, r) {
  //console.log(check)
 // console.log(r)
  if (r.isAxiosError) {
   console.log("down");
  }
  else{
    console.log("up");
  }
}

module.exports = { addNewCheck, checkStatus };
