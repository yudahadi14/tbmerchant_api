const { validationResult, body } = require("express-validator");

exports.validUser = [
    body("username").notEmpty().withMessage("Mohon isi Username."),
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