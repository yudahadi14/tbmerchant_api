const { validationResult, body } = require("express-validator");

exports.validDaftarOnline = [
  body("jenisId").notEmpty().withMessage("Mohon isi jenis identitas!."),
  body("jenisIdnomor").notEmpty().withMessage("Mohon isi nomor identitas!."),
  body("namaLengkap").notEmpty().withMessage("Mohon isi nama lengkap!."),
  body("tempatLahir").notEmpty().withMessage("Mohon isi tempat lahir!."),
  body("tglLahir").notEmpty().withMessage("Mohon isi tgl lahir!."),
  body("jenisKelamin").notEmpty().withMessage("Mohon isi jenis kelamin!."),
  body("alamat").notEmpty().withMessage("Mohon isi alamat!."),
  body("rt").notEmpty().withMessage("Mohon isi rt!."),
  body("rw").notEmpty().withMessage("Mohon isi rw!."),
  body("kelurahan").notEmpty().withMessage("Mohon isi kelurahan!."),
  body("kecamatan").notEmpty().withMessage("Mohon isi kecamatan!."),
  body("kotaDati").notEmpty().withMessage("Mohon isi kotaDati!."),
  body("kodePos").notEmpty().withMessage("Mohon isi kodePos!."),
  body("propinsi").notEmpty().withMessage("Mohon isi propinsi!."),
  body("noTelpon").notEmpty().withMessage("Mohon isi noTelpon!."),
  body("agama").notEmpty().withMessage("Mohon isi agama!."),
  body("nilaiYakin").notEmpty().withMessage("Mohon isi nilai keyakinan!."),
  body("statusNikah").notEmpty().withMessage("Mohon isi status pernikahan!."),
  body("statusWarganegara")
    .notEmpty()
    .withMessage("Mohon isi status warga negara!."),
  body("infoAyah").notEmpty().withMessage("Mohon isi info ayah!."),
  body("namaWaliDarurat")
    .notEmpty()
    .withMessage("Mohon isi nama wali darurat!."),
  body("telponWaliDarurat")
    .notEmpty()
    .withMessage("Mohon isi telpon wali darurat!."),
  body("fileUpload").notEmpty().withMessage("Mohon isi foto!."),
  body("alamatDomisili").notEmpty().withMessage("Mohon isi alamat domisili!."),
  body("bahasa").notEmpty().withMessage("Mohon isi bahasa!."),
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


exports.validDaftarVaksin = [
  body("jenisVaksin").notEmpty().withMessage("Mohon isi jenis vaksin!."),
  body("jenisId").notEmpty().withMessage("Mohon isi jenis identitas!."),
  body("jenisIdnomor").notEmpty().withMessage("Mohon isi nomor identitas!."),
  body("namaLengkap").notEmpty().withMessage("Mohon isi nama lengkap!."),
  body("tempatLahir").notEmpty().withMessage("Mohon isi tempat lahir!."),
  body("tglLahir").notEmpty().withMessage("Mohon isi tgl lahir!."),
  body("jenisKelamin").notEmpty().withMessage("Mohon isi jenis kelamin!."),
  body("alamat").notEmpty().withMessage("Mohon isi alamat!."),
  body("rt").notEmpty().withMessage("Mohon isi rt!."),
  body("rw").notEmpty().withMessage("Mohon isi rw!."),
  body("kelurahan").notEmpty().withMessage("Mohon isi kelurahan!."),
  body("kecamatan").notEmpty().withMessage("Mohon isi kecamatan!."),
  body("kotaDati").notEmpty().withMessage("Mohon isi kotaDati!."),
  body("kodePos").notEmpty().withMessage("Mohon isi kodePos!."),
  body("propinsi").notEmpty().withMessage("Mohon isi propinsi!."),
  body("noTelpon").notEmpty().withMessage("Mohon isi noTelpon!."),
  body("agama").notEmpty().withMessage("Mohon isi agama!."),
  body("statusNikah").notEmpty().withMessage("Mohon isi status pernikahan!."),
  body("alamatDomisili").notEmpty().withMessage("Mohon isi alamat domisili!."),
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
