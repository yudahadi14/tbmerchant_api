const express = require("express");
const router = express.Router();
const { daftarOnline } = require("../../controllers/api/layananController");
const { validDaftarOnline, validDaftarVaksin } = require("../../helpers/validators/layanan");
const uploadID = require("../../middleware/uploadID");

router.post("/daftar-baru", validDaftarOnline, uploadID, daftarOnline);
router.post("/daftar-vaksin", validDaftarVaksin, daftarOnline);

module.exports = router;
