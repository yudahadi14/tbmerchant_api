const models = require("../../models");
const { QueryTypes } = require("sequelize");
const { parseJadwal } = require("../../helpers/parser/doctorParser");
const { success, error } = require("../../helpers/utility/response");
const axios = require("axios");
const md5 = require("md5");
const moment = require("moment");
const convert = require("xml-js");
exports.pendidikan = (req, res) => {
  return models.asp_ref_pendidikan
    .findAll({
      order: [["pend_id", "ASC"]],
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

exports.produk = (req, res) => {
  const { category } = req.query;

  let whereAddOn = {};
  Object.assign(whereAddOn, {
    ref_prod_nama: ["Vaksinasi Meningitis", "Vaksinasi Influenza"],
  });
  return models.ref_produk
    .findAll({
      where: {
        ...whereAddOn,
      },
    })
    .then((payload) => {
      return success(req, res, payload, "Produk termuat.");
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
exports.getNIK = (req, res) => {
  const { nik } = req.query;
  let uname = "wsrsudckrg";
  let pass = "GWCkrgRSUDW5";
  let pkey = md5("RSUD" + md5(moment().format("DDMMYYYY")) + "CENGKARENG");

  let encodedNIK = encodeURIComponent(nik.trim());
  // console.log(moment().format("DDMMYYYY"));
  let url = "http://10.0.0.20/rsudcengkareng/xml.jsp";
  return axios
    .get(url, {
      params: {
        usernm: uname,
        pass: pass,
        app: "SILaporLahir",
        pget: "Kelahiran",
        pusr: "admin",
        proc: "GETNIK",
        nik: encodedNIK,
        pkey: pkey,
      },
    })
    .then((payload) => {
      let result1 = convert.xml2json(payload.data, {
        spaces: 4,
        compact: true,
      });
      let data = JSON.parse(result1);
      let identitas = data.DATA;
      if (identitas) {
        return success(req, res, identitas, "Identitas termuat.");
      } else {
        return error(req, res, {}, "Gagal mendapatkan NIK", 200, err);
      }
    })
    .catch((err) => {
      return error(req, res, {}, "Ada Kesalahan", 500, err);
    });
};
