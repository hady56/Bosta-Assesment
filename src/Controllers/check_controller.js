const User = require("../Models/user");
const Check = require("../Models/check");
const mailSender = require("../mail_sender");
const monitor = require("../up_time_monitor");
const axios = require("axios").default;
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

async function checkStatus(check, res, err) {
  let URLstatus = "Up";
  if (res.isAxiosError || res.duration >= check.timeout) URLstatus = "Down";

  if (check.webhook != "") {
    axios.post(check.webhook, {
      CheckName: check.name,
      URLstatus: URLstatus,
      ResponseTime: res.duration,
    });
  }

  let user = await User.findById(check.createdby);
  mailSender.SendStatusMail(check, URLstatus, user.email);

  console.log(check.name + " " + URLstatus);
}

module.exports = { addNewCheck };
