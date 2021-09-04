const axios = require("axios").default;
const checksMap = new Map();
const https = require("https");

function monitorurl(check, cb) {
  let URL = check.protocol + "://" + check.url;
  if (check.port != "") URL = URL + ":" + check.port;
  if (check.path != "") URL = URL + check.path;

  let request = createRequestData(URL, check);

  function newCheck() {
    request.get().then((res, err) => {
      // call back function to manage the reports and sending mails to the user 
        cb(check, res, err);
    });
  }

  /*
  *  If the response of the request.get() does not contain the duration then the user made an error when the data is entered.
  *  So there is no need to run the newCheck more than once or send mail.
  *  The response of the request.get() is sent back to the addNewCheck to tell the user to fix the entered data. 
  */

  const response=request.get().then((res, err) => {
    if (res.duration) {
      let intr = setInterval(newCheck, check.interval);
    } 
    return res;
  });
  return response

  
  //clearInterval(intr);
}

function createRequestData(url, check) {
  const requestData = axios.create({
    baseURL: url,
    timeout: check.timeout,
    headers: check.httpHeaders,
    auth: {
      username: check.authentication.username,
      password: check.authentication.password,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: check.ignoreSSL,
    }),
  });

  /*
   * setting interceptors to be able
   * to know response time of the each request
   */

  requestData.interceptors.request.use(
    (config) => {
      const newConfig = { ...config };
      //console.log(newConfig)
      newConfig.metadata = { startTime: new Date() };

      return newConfig;
    },
    (error) => {
      return error;
    }
  );
  requestData.interceptors.response.use(
    (response) => {
      const newRes = { ...response };

      newRes.config.metadata.endTime = new Date();
      newRes.duration =
        newRes.config.metadata.endTime - newRes.config.metadata.startTime;
      //console.log(newRes)
      return newRes;
    },
    (error) => {
      try {
        const newError = { ...error };

        newError.config.metadata.endTime = new Date();
        newError.duration =
          newError.config.metadata.endTime - newError.config.metadata.startTime;

        return newError;
      } catch (err) {
        return err;
      }
    }
  );
  return requestData;
}
module.exports = { monitorurl };
