const { validationResult, body } = require("express-validator");

exports.validUserSignup = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    body("userpass").notEmpty().withMessage("Mohon isi Password!."),
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
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    body("userpass").notEmpty().withMessage("Mohon isi Password!."),
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
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
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

  