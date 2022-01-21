const express = require("express");
const router = express.Router();
const { pekerjaan, pendidikan,agama, jenisIdentitas, statusNikah } = require("../../controllers/api/masterController");

router.get("/agama", agama);
router.get("/pekerjaan", pekerjaan);
router.get("/pendidikan", pendidikan);
router.get("/status-nikah", statusNikah);
router.get("/jenis-identitas", jenisIdentitas);

module.exports = router;