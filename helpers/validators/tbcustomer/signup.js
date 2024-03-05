const { validationResult, body } = require("express-validator");

exports.validUserSignup = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    body("emailphone").notEmpty().withMessage("Mohon isi Email / Number Phone!."),
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

exports.validUserLogin = [
    body("emailphone").notEmpty().withMessage("Mohon isi Email / Nomor HP!."),
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

exports.validkodeLogin = [
    body("emailphone").notEmpty().withMessage("Mohon isi Email/ Nomor HP."),
    body("kodeotp").notEmpty().withMessage("Mohon isi Kode OTP!."),
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

exports.validlupaPassword = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    body("passLama").notEmpty().withMessage("Mohon isi Password Lama Anda."),
    body("passBaru").notEmpty().withMessage("Mohon isi Password Baru Anda."),
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

exports.validlupaPasswordKode = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    body("iddevice").notEmpty().withMessage("Mohon isi ID Device"),
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

  exports.validcreaterating = [
    body("idtransaksi").notEmpty().withMessage("Mohon isi ID Transaksi!."),
    body("iddriver").notEmpty().withMessage("Mohon isi ID Driver!."),
    body("idmerchant").notEmpty().withMessage("Mohon isi ID Merchant!."),
    body("type_dokumen").notEmpty().withMessage("Mohon isi Type Dokumen!."),
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

  exports.validinsertchats = [
    body("iscustomer").notEmpty().withMessage("Error Kesalahan Server!"),
    body("produkidheader").notEmpty().withMessage("Error Kesalahan Server!"),
    body("custchat").notEmpty().withMessage("Error Kesalahan Server!"),
    body("komentar").notEmpty().withMessage("Error Kesalahan Server!"),
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

  



  



  