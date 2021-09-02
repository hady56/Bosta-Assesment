const axios = require("axios").default;
const checkController = require("./Controllers/check_controller");
const checksMap = new Map();
const https=require("https");


function monitorurl(check){
  
  let URL = check.protocol + "://" + check.url;
  if (check.port!='') URL = URL + ":" + check.port;
  if (check.path!='') URL = URL + check.path;

  let api = createAPI(URL, check);

  function newCheck() {
    try {
      api.get().then((rest, err) => {
        if (err) return err;
        console.log(check.name+" "+rest.isAxiosError);
        return rest;
      });
    } catch (err) {
      console.log("404 not found");
      return err;
    }
  }
  let intr = setInterval(newCheck, check.interval);

  //clearInterval(intr);
}

function createAPI(url, check) {

  const API = axios.create({
    baseURL: url,
    timeout: check.timeout,
    headers: check.httpHeaders,
    auth: {
      username: check.authentication.username,
      password: check.authentication.password,
    },
    httpsAgent: new https.Agent({  
      rejectUnauthorized: check.ignoreSSL
    })
    
  });

  /*
   * setting interceptors to be able
   * to know response time of the each request
   */

  API.interceptors.request.use(
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
  API.interceptors.response.use(
    (response) => {
      const newRes = { ...response };
      newRes.config.metadata.endTime = new Date();
      newRes.duration =
        newRes.config.metadata.endTime - newRes.config.metadata.startTime;
      //console.log(newRes.duration)
      return newRes;
    },
    (error) => {
      const newError = { ...error };
      newError.config.metadata.endTime = new Date();
      newError.duration =
        newError.config.metadata.endTime - newError.config.metadata.startTime;
      console.log(newError.isAxiosError)
      return newError;
    }
  );
  return API;
}
module.exports = {monitorurl};
