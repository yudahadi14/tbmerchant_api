var models = require("../../models");
const { QueryTypes } = require("sequelize");
const { parseJadwal } = require("../../helpers/parser/doctorParser");
const { success, error } = require("../../helpers/utility/response");
const base64ToFile = require("../../helpers/utility/base64ToFile");
exports.daftarBaru = (req, res) => {
  // let { image, filename } = req.body;

  const {
    jenisId,
    jenisIdnomor,
    namaLengkap,
    namaPanggilan,
    tempatLahir,
    tglLahir,
    jenisKelamin,
    alamat,
    rt,
    rw,
    kelurahan,
    kecamatan,
    kotaDati,
    kodePos,
    propinsi,
    noTelpon,
    agama,
    nilaiYakin,
    textNilaiYakin,
    statusNikah,
    statusWarganegara,
    infoIbu,
    infoAyah,
    infoIstriSuami,
    noPenjamin,
    namaWaliDarurat,
    telponWaliDarurat,
    fileUpload,
    filePhoto,
    noTelpon2,
    alamatDomisili,
    statusPendidikan,
    penjamin,
    bahasa,
    infoKerja,
    penjaminSubjenis,
  } = req.body;
 
  let payload = {
    regpsonline_id_jns_id: jenisId || null,
    regpsonline_id_jns_id_nomor: jenisIdnomor || null,
    regpsonline_namalengkap: namaLengkap || null,
    regpsonline_namapanggilan: namaPanggilan || null,
    regpsonline_tmptlahir: tempatLahir || null,
    regpsonline_tgllahir: tglLahir || null,
    regpsonline_jnskelamin: jenisKelamin || null,
    regpsonline_alamat: alamat || null,
    regpsonline_rtrw: rt + "/" + rw || null,
    regpsonline_kelurahan: kelurahan || null,
    regpsonline_kecamatan: kecamatan || null,
    regpsonline_kotadati: kotaDati || null,
    regpsonline_kdpos: kodePos || null,
    regpsonline_propinsi: propinsi || null,
    regpsonline_notelpon: noTelpon || null,
    regpsonline_agama: agama || null,
    regpsonline_nilaiyakin: nilaiYakin || null,
    regpsonline_textnilaiyakin: textNilaiYakin || null,
    regpsonline_stsnikah: statusNikah || null,
    regpsonline_stswarganegara: statusWarganegara || null,
    regpsonline_infoibu: infoIbu || null,
    regpsonline_infoayah: infoAyah || null,
    regpsonline_infoistrisuami: infoIstriSuami || null,
    regpsonline_nopenjamin: penjamin || null,
    regpsonline_nmwalidarurat: namaWaliDarurat || null,
    regpsonline_telponwalidarurat: telponWaliDarurat || null,
    regpsonline_fileupload: req.fileName || null,
    regpsonline_filephoto: req.fileName || null,
    regpsonline_flig_flag: true || null,
    regpasienonline_notelpon2: noTelpon2 || null,
    regpsonline_alamat_domisili: alamatDomisili || null,
    regpsonline_stspendidikan: statusPendidikan || null,
    regpsonline_penjamin: penjamin || null,
    regpsonline_bahasa: bahasa || null,
    regpsonline_infokerja: infoKerja || null,
    // regpsonline_penjamin_subjenis: 0,
    // regpsonline_id_pasien_ps_id: null,
  };
  return models.pasienonline
    .create({
      regpsonline_id_jns_id: jenisId || null,
      regpsonline_id_jns_id_nomor: jenisIdnomor || null,
      regpsonline_namalengkap: namaLengkap || null,
      regpsonline_namapanggilan: namaPanggilan || null,
      regpsonline_tmptlahir: tempatLahir || null,
      regpsonline_tgllahir: tglLahir || null,
      regpsonline_jnskelamin: jenisKelamin || null,
      regpsonline_alamat: alamat || null,
      regpsonline_rtrw: rt + "/" + rw || null,
      regpsonline_kelurahan: kelurahan || null,
      regpsonline_kecamatan: kecamatan || null,
      regpsonline_kotadati: kotaDati || null,
      regpsonline_kdpos: kodePos || null,
      regpsonline_propinsi: propinsi || null,
      regpsonline_notelpon: noTelpon || null,
      regpsonline_agama: agama || null,
      regpsonline_nilaiyakin: nilaiYakin || null,
      regpsonline_textnilaiyakin: textNilaiYakin || null,
      regpsonline_stsnikah: statusNikah || null,
      regpsonline_stswarganegara: statusWarganegara || null,
      regpsonline_infoibu: infoIbu || null,
      regpsonline_infoayah: infoAyah || null,
      regpsonline_infoistrisuami: infoIstriSuami || null,
      regpsonline_nopenjamin: penjamin || null,
      regpsonline_nmwalidarurat: namaWaliDarurat || null,
      regpsonline_telponwalidarurat: telponWaliDarurat || null,
      regpsonline_fileupload: req.fileName || null,
      regpsonline_filephoto: req.fileName || null,
      regpsonline_flig_flag: true || null,
      regpasienonline_notelpon2: noTelpon2 || null,
      regpsonline_alamat_domisili: alamatDomisili || null,
      regpsonline_stspendidikan: statusPendidikan || null,
      regpsonline_penjamin: penjamin || null,
      regpsonline_bahasa: bahasa || null,
      regpsonline_infokerja: infoKerja || null,
      // regpsonline_penjamin_subjenis: 0,
      // regpsonline_id_pasien_ps_id: null,
    })
    .then((pasien) => {
      if (pasien) {
        return success(req, res, pasien, "Pasien berhasil terdaftar.");
      }
      return error(req, res, {}, "Gagal mendaftar", 400);
    })
    .catch((err) => {
      return error(req, res, {}, "Gagal mendaftar", 500, err);
    });
};

// regpsonline_id_reg: 2,
