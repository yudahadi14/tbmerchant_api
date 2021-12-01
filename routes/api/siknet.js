const express = require("express");
const router = express.Router();

// const {
//   jadwalDokter, listDokter,
// } = require("../../controllers/api/doctorController");
// const { getJadwal } = require("../../helpers/validators/doctor");

// router.get("/jadwal", getJadwal, jadwalDokter);
// router.get("/list", listDokter);

router.get("/list", list);



module.exports = router;