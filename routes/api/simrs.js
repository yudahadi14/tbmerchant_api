const express = require("express");
const router = express.Router();
const {
  listDatakamar
} = require("../../controllers/api/simrsController");
// const { getJadwal } = require("../../helpers/validators/doctor");

// router.get("/data_kamar", getJadwal, jadwalDokter);
router.get("/data_kamar", listDatakamar);



module.exports = router;