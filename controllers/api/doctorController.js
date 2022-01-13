var models = require("../../models");
const { QueryTypes } = require("sequelize");
const { parseJadwal } = require("../../helpers/parser/doctorParser");
const { success, error } = require("../../helpers/utility/response");

exports.jadwalDokter = (req, res) => {
  const query = `
SELECT 
  cast(
    (
      periodeawal || '-' || periodeakhir || '  ' || thn
    ) as varchar (100)
  ) AS periode, 
  id, 
  peg_id,
  peg_nama, 
  ref_layanan_id,
  ref_layanan_nama, 
  hari_praktek, 
  jam_praktek_mulai, 
  jam_praktek_akhir, 
  jam_praktek_lainnya 
FROM 
  jadwal_praktek_dokter 
  left join pegawai ON peg_id = id_dokter 
  left join ref_layanan ON ref_layanan_id = id_poli 
WHERE 
  thn = :tahun 
  and aktif = true 
  and blnint1 = :bulan1
  and blnint2 = :bulan2
  and peg_nama not in ('ga ad nama', 'DOKTER RSUD', 'FISIOTHERAPIST')
  ${req.query.peg_id ? "and peg_id = :peg_id" : ""} 
ORDER BY 
  ref_layanan_nama, 
  peg_nama, 
  CASE WHEN hari_praktek = 'Senin' THEN 1 WHEN hari_praktek = 'Selasa' THEN 2 WHEN hari_praktek = 'Rabu' THEN 3 WHEN hari_praktek = 'Kamis' THEN 4 WHEN hari_praktek = 'Jumat' THEN 5 WHEN hari_praktek = 'Sabtu' THEN 6 WHEN hari_praktek = 'Minggu' THEN 7 END ASC
`;

  return models.sequelize
    .query(query, {
      replacements: {
        bulan1: req.query.bulan1,
        bulan2: req.query.bulan2,
        tahun: req.query.tahun,
        peg_id: req.query.peg_id,
      },
      type: QueryTypes.SELECT,
    })
    .then((payload) => {
      let result = parseJadwal(payload);
      return success(req, res, result);
    })
    .catch((err) => {
      return error(req, res, err, null);
    });
};

exports.listDokter = (req, res) => {
  const query = `
select 
  p.peg_id, 
  p.peg_nopeg, 
  p.peg_nama as nama_dokter, 
  rl.ref_layanan_nama, 
  rl.ref_layanan_id 
from 
  dokter d 
  inner join pegawai p on p.peg_id = d.dr_peg_id 
  left join jadwal_praktek_dokter jpd on jpd.id_dokter = d.dr_peg_id 
  left join ref_layanan rl on rl.ref_layanan_id = jpd.id_poli 
where 
  UPPER(p.peg_nama) like UPPER(:nama_dokter)
  AND peg_nama not in ('ga ad nama', 'DOKTER RSUD', 'FISIOTHERAPIST')
  AND 
  ${
    req.query.layanan_id
      ? "rl.ref_layanan_id = :layanan_id"
      : "rl.ref_layanan_id != 0"
  }
group by 
  p.peg_id, 
  p.peg_nopeg, 
  p.peg_nama, 
  rl.ref_layanan_nama, 
  rl.ref_layanan_id 
order by 
  nama_dokter ASC;
  `;
  return models.sequelize
    .query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        nama_dokter: "%" + req.query.nama_dokter + "%" || "",
        layanan_id: req.query.layanan_id,
      },
    })
    .then((payload) => {
      return success(req, res, payload);
    });
};

exports.listPoli = (req, res) => {
  const query = `
SELECT 
  jpd.id_poli, 
  rl.ref_layanan_nama 
FROM 
  ref_layanan rl 
  INNER JOIN jadwal_praktek_dokter jpd ON rl.ref_layanan_id = jpd.id_poli
WHERE rl.ref_layanan_nama not in ('---', 'USG 4D')
GROUP BY 
  jpd.id_poli, 
  rl.ref_layanan_nama 
ORDER BY 
  rl.ref_layanan_nama ASC

    `;

  return models.sequelize
    .query(query, {
      type: QueryTypes.SELECT,
    })
    .then((payload) => {
      return success(req, res, payload);
    })
    .catch((err) => {
      return error(req, res, err, null);
    });
};

exports.postJadwal = (req, res) => {
  const findQ = `
SELECT * FROM jadwal_praktek_dokter
WHERE
 id_dokter = :peg_id
 AND hari_praktek = :hari_praktek
 AND jam_praktek_mulai = :jam_praktek_mulai
 AND jam_praktek_akhir = :jam_praktek_akhir
 AND periodeawal = :periodeawal
 AND periodeakhir = :periodeakhir
 AND thn = :thn
 AND blnint1 = :blnint1
 AND blnint2 = :blnint2 
 AND id_poli = :id_poli
LIMIT 1;
  `;
  const insQ = `
  insert into jadwal_praktek_dokter (
    id_dokter, hari_praktek, jam_praktek_mulai, 
    jam_praktek_akhir, id_poli, periodeawal, 
    periodeakhir, tgl_input, thn, blnint1, 
    blnint2, aktif
  ) 
  values 
  (
    :peg_id, :hari_praktek, :jam_praktek_mulai, :jam_praktek_akhir, 
    :id_poli, :periodeawal, :periodeakhir, now(), :thn, 
    :blnint1, :blnint2, true
  )
  `;
  const {
    peg_id,
    hari_praktek,
    jam_praktek_mulai,
    jam_praktek_akhir,
    periodeawal,
    periodeakhir,
    blnint1,
    blnint2,
    id_poli,
    thn,
  } = req.body;

  return models.sequelize
    .query(findQ, {
      type: QueryTypes.SELECT,
      replacements: {
        peg_id: peg_id,
        hari_praktek: hari_praktek,
        jam_praktek_mulai: jam_praktek_mulai,
        jam_praktek_akhir: jam_praktek_akhir,
        periodeawal: periodeawal,
        periodeakhir: periodeakhir,
        blnint1: blnint1,
        blnint2: blnint2,
        id_poli: id_poli,
        thn: thn,
      },
    })
    .then((jadwal) => {
      console.log(jadwal);
      if (jadwal.length > 0) {
        throw new Error("Jadwal sudah ada.");
      }
      return models.sequelize.query(insQ, {
        type: QueryTypes.INSERT,
        replacements: {
          peg_id: peg_id,
          hari_praktek: hari_praktek,
          jam_praktek_mulai: jam_praktek_mulai,
          jam_praktek_akhir: jam_praktek_akhir,
          periodeawal: periodeawal,
          periodeakhir: periodeakhir,
          blnint1: blnint1,
          blnint2: blnint2,
          id_poli: id_poli,
          thn: thn,
        },
      });
    })
    .then((payload) => {
      return success(req, res, payload);
    })
    .catch((err) => {
      return error(req, res, err, err.message);
    });
};

exports.fotoDokter = (req, res) => {
  const file = req.file;
  const { filename } = req.file;
  const { peg_id } = req.body;
  if (!file) {
    return error(req, res, "Error", null);
  }
  const findQ = `SELECT * FROM foto_dokter WHERE peg_id = :peg_id LIMIT 1`;
  const insQ = `
        INSERT INTO foto_dokter (peg_id, filename)
        VALUES (:peg_id, :filename)
      `;
  const updQ = `
        UPDATE foto_dokter SET filename = :filename WHERE peg_id = :peg_id
      `;
  return models.sequelize
    .query(findQ, {
      type: QueryTypes.SELECT,
      replacements: {
        peg_id: peg_id,
      },
    })
    .then((payload) => {
      if (payload.data) {
        return models.sequelize.query(updQ, {
          type: QueryTypes.UPDATE,
          replacements: {
            peg_id: peg_id,
            filename: filename,
          },
        });
      } else {
        return models.sequelize.query(insQ, {
          type: QueryTypes.INSERT,
          replacements: {
            peg_id: peg_id,
            filename: filename,
          },
        });
      }
    })
    .then(() => {
      return models.sequelize.query(findQ, {
        type: QueryTypes.SELECT,
        replacements: {
          peg_id: peg_id,
        },
      });
    })
    .then((payload) => {
      return success(req, res, payload);
    })
    .catch((err) => {
      return error(req, res, err, null);
    });
};

