const express = require("express");
const router = express.Router();
const {
  listDatakamar
} = require("../../controllers/api/simrsController");
// const { getJadwal } = require("../../helpers/validators/doctor");

// router.get("/data_kamar", getJadwal, jadwalDokter);

router.get("/data_kamar", listDatakamar);


/**
 * @swagger
 * /simrs/data_kamar:
 *  get:
 *    summary: Lihat data kamar
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 *      400:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Response'
 *              
 *              
 */



module.exports = router;