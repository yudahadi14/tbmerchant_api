const express = require("express");
const router = express.Router();
const {
  jadwalDokter,
  listDokter,
  listPoli,
  fotoDokter,
  postJadwal,
} = require("../../controllers/api/doctorController");
const { error } = require("../../helpers/utility/response");
const upload = require("../../helpers/utility/uploads");
const { getJadwal, postFoto } = require("../../helpers/validators/doctor");
router.get("/jadwal", getJadwal, jadwalDokter);
router.get("/poli", listPoli);
/**
 * @swagger
 * components:
 *    schemas:
 *      Response:
 *        type: object
 *        properties:
 *          status:
 *            type: string
 *            description: Auto
 *          message:
 *            type: string
 *            description: Auto
 *          data:
 *            type: array
 *            items:
 *              type: object
 *
 */

/**
 * @swagger
 * /doctor/jadwal:
 *  get:
 *    summary: Lihat jadwal dokter
 *    parameters:
 *     - in: query
 *       name: periode
 *       schema:
 *        type: integer
 *       description: Periode quarter 1 - 4
 *     - in: query
 *       name: tahun
 *       schema:
 *        type: integer
 *       required: true
 *     - in: query
 *       name: peg_id
 *       schema:
 *        type: integer
 *       description: Isi jika ingin melihat jadwal per dokter
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

router.get("/list", listDokter);

/**
 * @swagger
 * /doctor/list:
 *  get:
 *    summary: List jadwal dokter
 *    parameters:
 *     - in: query
 *       name: layanan_id
 *       schema:
 *        type: integer
 *       description: Isi jika ingin filter by layanan/poli
 *     - in: query
 *       name: nama_dokter
 *       schema:
 *        type: string
 *       description: Isi jika ingin filter by nama dokter
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
const single = upload("doctors").single("file");

router.post(
  "/foto-dokter",
  (req, res, next) =>
    single(req, res, (err) => {
      if(err) {
        return error(req, res, [], err.message);
      }
      next();
    }),
  postFoto,
  fotoDokter
);

router.post(
  "/jadwal-dokter", postFoto, postJadwal
);

module.exports = router;
