const { validationResult, body } = require("express-validator");


exports.validateListProduk = [
    body("kategori_id").notEmpty().withMessage("Mohon isi Kategori Nama!."),
    (req, res, next) => {
      let errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
        let firstError = errors.array().map((error) => error.msg)[0];
        return res.status(400).json({
          status: 400,
          message: firstError,
          data: {},
        });
      }
      next();
    },
  ];

exports.validateOnesignal = [
    body("idonesignal").notEmpty().withMessage("Mohon isi ID!."),
    (req, res, next) => {
      let errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
        let firstError = errors.array().map((error) => error.msg)[0];
        return res.status(400).json({
          status: 400,
          message: firstError,
          data: {},
        });
      }
      next();
    },
  ];

exports.validatetambahdetailpesanan = [
    body("idcustomer").notEmpty().withMessage("Mohon isi ID!."),
    body("jumlah").notEmpty().withMessage("Mohon isi ID!."),
    body("hargajual").notEmpty().withMessage("Mohon isi ID!."),
    body("id_product").notEmpty().withMessage("Mohon isi ID!."),
    body("stokproduk").notEmpty().withMessage("Mohon isi ID!."),
    body("totalharga").notEmpty().withMessage("Mohon isi ID!."),
    body("idmerchant").notEmpty().withMessage("Mohon isi ID!."),
    (req, res, next) => {
      let errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
        let firstError = errors.array().map((error) => error.msg)[0];
        return res.status(400).json({
          status: 400,
          message: firstError,
          data: {},
        });
      }
      next();
    },
  ];

exports.validateeditdetailpesanan = [
    body("jumlah").notEmpty().withMessage("Mohon isi jumlah!."),
    body("hargajual").notEmpty().withMessage("Mohon isi hargajual!."),
    body("totalharga").notEmpty().withMessage("Mohon isi totalharga!."),
    body("stokproduk").notEmpty().withMessage("Mohon isi stokproduk!."),
    body("idtrxdetail").notEmpty().withMessage("Mohon isi idtrxdetail!."),
    (req, res, next) => {
      let errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
        let firstError = errors.array().map((error) => error.msg)[0];
        return res.status(400).json({
          status: 400,
          message: firstError,
          data: {},
        });
      }
      next();
    },
  ];

  