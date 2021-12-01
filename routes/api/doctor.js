const express = require("express");
const router = express.Router();
const {
  jadwalDokter, listDokter,
} = require("../../controllers/api/doctorController");
const { getJadwal } = require("../../helpers/validators/doctor");

router.get("/jadwal", getJadwal, jadwalDokter);

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



module.exports = router;