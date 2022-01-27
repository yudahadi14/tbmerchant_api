let log4js = require("log4js");
let moment = require("moment");

log4js.configure({
  appenders: {
    app: {
      type: "file",
      filename: `log/${moment().format("YYYY_MM_DD")}.log`,
    },
    log: {
      type: "console",
    },
  },
  categories: { default: { appenders: ["app", "log"], level: "all" } },
});
let logger = log4js.getLogger("app");

exports.success = (
  req,
  res,
  data = null,
  message = "Berhasil",
  status = 200
) => {
  // logger.info(message);
  return res.json({
    status: status,
    message: message,
    data: data,
  });
};

exports.error = (
  req,
  res,
  data = null,
  message = "Ada Kesalahan",
  status = 400,
  err
) => {
  if (err.response) {
    logger.warn(err.response);
  } else {
    logger.fatal(err.toString());
  }
  return res.json({
    status: status,
    message: message,
    data: data,
  });
};
