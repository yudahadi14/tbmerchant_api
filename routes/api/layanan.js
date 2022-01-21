const express = require("express");
const router = express.Router();
const { daftarBaru } = require("../../controllers/api/layananController");
const { validDaftarBaru } = require("../../helpers/validators/layanan");
const uploadID = require("../../middleware/uploadID");

router.post("/daftar-baru", validDaftarBaru, uploadID, daftarBaru);

module.exports = router;
