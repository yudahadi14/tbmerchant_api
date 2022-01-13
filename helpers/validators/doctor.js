const {
  query,
  validationResult,
  oneOf,
  header,
  check,
  body,
} = require("express-validator");

exports.getJadwal = [
  query("bulan1").notEmpty().withMessage("Mohon isi bulan awal!."),
  query("bulan2").notEmpty().withMessage("Mohon isi bulan akhir!."),
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

exports.postFoto = [
  body("peg_id").notEmpty().withMessage("Mohon isi peg_id!."),
  (req, res, next) => {
    const errors = validationResult(req);

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
