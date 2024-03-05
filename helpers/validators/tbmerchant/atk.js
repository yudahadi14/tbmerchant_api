const { validationResult, body } = require("express-validator");


exports.validateUserMakanan = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
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

  exports.validateIddevice = [
    body("iddevice").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
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

exports.validateAddUserMakanan = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
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

  exports.validateEditUserMakanan = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
    (req, res, next) => {
      let errors = validationResult(req.file);
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

exports.validateDeleteUserMakanan = [
    body("fullname").notEmpty().withMessage("Mohon isi Full Name / Merchant!."),
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

  

  