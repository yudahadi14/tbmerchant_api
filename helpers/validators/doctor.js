const { query, validationResult, oneOf, header } = require("express-validator");

exports.getJadwal = [
  query("bulan").notEmpty().withMessage("Mohon isi bulan!."),
  query("tahun").notEmpty().withMessage("Mohon isi tahun!."),
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(400).json({
        status: 400,
        message: firstError,
        data: [],
      });
    }
    next();
  },
];
