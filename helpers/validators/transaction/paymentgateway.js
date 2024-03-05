const { validationResult, body } = require("express-validator");


exports.validate = [

    body("username").notEmpty().withMessage("Mohon isi User!."),
    body("password").notEmpty().withMessage("Mohon isi Password!."),
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

]