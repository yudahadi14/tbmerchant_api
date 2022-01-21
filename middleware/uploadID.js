var fs = require("fs");
var path = require("path");
const base64ToFile = require("../helpers/utility/base64ToFile");
const { error } = require("../helpers/utility/response");
const uploadID = (req, res, next) => {
  let { filePhoto, jenisIdnomor } = req.body;
let fileName = jenisIdnomor + "_" + Date.now();
let fileName = jenisIdnomor;

  return base64ToFile(filePhoto, "/identitas/" + fileName)
    .then(() => {
      req.fileName = fileName;
      return next();
    })
    .catch((err) => {
      return error(
        req,
        res,
        {},
        "Gagal Upload Foto, coba ulang kembali.",
        undefined,
        err
      );
    });
};

module.exports = uploadID;
