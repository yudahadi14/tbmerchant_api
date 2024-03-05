const {
  validationResult,
  body,
} = require("express-validator");

exports.postLogin = [
  body("password").notEmpty().withMessage("Mohon isi password!."),
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(400).json({
        status: 400,
        message: firstError,
        data: {},
      });
    }
    next();
  },
];
