var models = require("../../models");
const { QueryTypes } = require("sequelize");
const { parseJadwal } = require("../../helpers/parser/doctorParser");
const { success, error } = require("../../helpers/utility/response");
exports.pendidikan = (req, res) => {
  return models.asp_ref_pendidikan
    .findAll({
      order:[['pend_id', 'ASC']],
    })
    .then((payload) => {
      return success(req, res, payload, "Pendidikan termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
exports.agama = (req, res) => {
  return models.ref_agama
    .findAll({
      order: [["ref_agama_id", "ASC"]],
    })
    .then((payload) => {
      return success(req, res, payload, "Agama termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
exports.pekerjaan = (req, res) => {
  return models.ref_pekerjaan
    .findAll({
      order: [["ref_pkrjn_id", "ASC"]],
    })
    .then((payload) => {
      return success(req, res, payload, "Pekerjaan termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
exports.jenisIdentitas = (req, res) => {
  return models.asp_ref_jenis_kartu_identitas
    .findAll({
      order: [["ref_jki_id", "ASC"]],
    })
    .then((payload) => {
      return success(req, res, payload, "Jenis ID termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
exports.statusNikah = (req, res) => {
  return models.asp_ref_status_nikah
    .findAll({
      order: [["stat_id", "ASC"]],
    })
    .then((payload) => {
      return success(req, res, payload, "Status Nikah termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};

