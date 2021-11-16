const { query, validationResult, oneOf, header } = require("express-validator");

exports.getJadwal = [
  query("periode").notEmpty().withMessage("Mohon isi periode!."),
  query("tahun").notEmpty().withMessage("Mohon isi tahun!."),
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      // console.log(firstError);
      return res.status(200).json({
        status: 422,
        message: {
          eng: firstError[0],
          ind: firstError[1],
        },
        data: {},
      });
    }
    next();
  },
];
