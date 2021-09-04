const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const ApiKey = process.env.SendGridAPIKEY;
const ServerURL = process.env.ClientURL;

async function SendVerifyMail(mail, token) {
  sgMail.setApiKey(ApiKey);
  const msg = {
    to: mail,
    from: "bosta_assessment@hotmail.com",
    subject: "Up time monitor account activation link",
    html: ` <h2> Please click on the link below to activate your account </h2>
      <p><a href="${ServerURL}/users/verify-email?token=${token}"> Activation link </a></p>
      `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

async function SendStatusMail(check, checkStatus, mail) {
  sgMail.setApiKey(ApiKey);
  const msg = {
    to: mail,
    from: "bosta_assessment@hotmail.com",
    subject: `${check.name} Check Status`,
    html: ` <h2> ${check.name} check status is ${checkStatus}  </h2>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  SendVerifyMail,
  SendStatusMail,
};
