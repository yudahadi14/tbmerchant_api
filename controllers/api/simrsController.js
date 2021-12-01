var models = require("../../model_simrs");
const { QueryTypes } = require("sequelize");
// const { parseJadwal } = require("../../helpers/parser/doctorParser");
const { success, error } = require("../../helpers/utility/response");

// exports.jadwalDokter = (req, res) => {
//   const query = `
//   select 
//   cast(
//     (
//       periodeawal || '-' || periodeakhir || '  ' || thn
//     ) as varchar (100)
//   ) as periode, 
//   id, 
//   peg_id,
//   peg_nama, 
//   ref_layanan_id,
//   ref_layanan_nama, 
//   hari_praktek, 
//   jam_praktek_mulai, 
//   jam_praktek_akhir, 
//   jam_praktek_lainnya 
// from 
//   jadwal_praktek_dokter 
//   left join pegawai on peg_id = id_dokter 
//   left join ref_layanan on ref_layanan_id = id_poli 
// where 
//   thn = :tahun 
//   and aktif = true 
//   and blnint1 = :periode
//   ${req.query.peg_id ? "and peg_id = :peg_id" : ""} 
// order by 
//   ref_layanan_nama, 
//   peg_nama, 
//   CASE WHEN hari_praktek = 'Senin' THEN 1 WHEN hari_praktek = 'Selasa' THEN 2 WHEN hari_praktek = 'Rabu' THEN 3 WHEN hari_praktek = 'Kamis' THEN 4 WHEN hari_praktek = 'Jumat' THEN 5 WHEN hari_praktek = 'Sabtu' THEN 6 WHEN hari_praktek = 'Minggu' THEN 7 END ASC
// `;

//   return models.sequelize
//     .query(query, {
//       replacements: {
//         periode: req.query.periode,
//         tahun: req.query.tahun,
//         peg_id: req.query.peg_id,
//       },
//       type: QueryTypes.SELECT,
//     })
//     .then((payload) => {
//       let result = parseJadwal(payload);
//       return success(req, res, result);
//     })
//     .catch((err) => {
//       return error(req, res, err, null);
//     });
// };

exports.listDatakamar = (req, res) => {
  const query = `
  select
  *
  ,(kapasitas - terisi) as kosong
from
  (
  select
      ruang
      ,kelas
      ,case
          when (ref_kls_inap_id = 11 and ref_ruang_id = 9)
              then (kapasitas - 5)
  --		when (ref_kls_inap_id = 11 and ref_ruang_id = 8)
  --			then (kapasitas - 5)
          --when (ref_kls_inap_id = 11 and ref_ruang_id = 2)
          --	then (kapasitas - 5)
          --when (ref_kls_inap_id = 10 and ref_ruang_id = 7)
              --then (kapasitas - 5)
          --when (ref_kls_inap_id = 11 and ref_ruang_id = 7)
              --then (kapasitas - 10)
      --	when (ref_kls_inap_id = 27 and ref_ruang_id = 20)
      --		then (kapasitas - 2)
      --	when (ref_kls_inap_id = 27 and ref_ruang_id = 19)
      --		then (kapasitas - 1)
          else
              kapasitas
      end as kapasitas
      ,case
          when (ref_kls_inap_id = 11 and ref_ruang_id = 9)
              then
                  case when terisi >= (kapasitas - 5)
                      then (kapasitas - 5)
                      else terisi
                  end
      --	when (ref_kls_inap_id = 11 and ref_ruang_id = 8)
          --	then
              --	case when terisi >= (kapasitas - 5)
                  --	then (kapasitas - 5)
                  --	else terisi
              --	end
      --	when (ref_kls_inap_id = 11 and ref_ruang_id = 2)
          --	then
          --		case when terisi >= (kapasitas - 5)
              --		then (kapasitas - 5)
              --		else terisi
          --		end
          --when (ref_kls_inap_id = 10 and ref_ruang_id = 7)
              --then
                  --case when terisi >= (kapasitas - 10)
                      --then (kapasitas - 5)
                      --else terisi
                  --end
          --when (ref_kls_inap_id = 11 and ref_ruang_id = 7)
              --then
                  --case when terisi >= (kapasitas - 10)
                      --then (kapasitas - 10)
                      --else terisi
                  --end
              
      --	when (ref_kls_inap_id = 27 and ref_ruang_id = 20)
      --		then
          --		case when terisi >= (kapasitas - 2)
      --			then (kapasitas - 2)
          --			else terisi
          --		end
      --	when (ref_kls_inap_id = 27 and ref_ruang_id = 19)
      --		then
      --			case when terisi >= (kapasitas - 1)
      --				then (kapasitas - 1)
      --				else terisi
      --			end
          else
              terisi
      end as terisi
      
      
      
  from
      (
      select
          (select count(*) from v_kamar_rs_jk_2 b where b.ref_kls_inap_id = a.ref_kls_inap_id and b.ref_ruang_id = a.ref_ruang_id and ( stat_tmpt_tdr_id_status = 4 or stat_tmpt_tdr_id_status = 3)) as terisi
          ,jml as kapasitas
          ,ref_ruang_nama as ruang
          ,ref_kls_inap_nama as kelas
          ,ref_kls_inap_id
          ,ref_ruang_id
      from
          v_kamar_rs_kapasitas_2 a
      where
          ref_kls_inap_id > 0 
          --and ref_ruang_nama not ilike '%durian%'  
          and ref_ruang_nama not ilike '%vk%'
      ) as data
      where (kelas not ilike '%Non Kelas%' or ruang not ilike '%durian%')
  ) as dataa
  `;
  return models.sequelize
    .query(query, {
      type: QueryTypes.SELECT,
      replacements: {
        ruang : req.query.ruang,
        kelas : req.query.kelas,
        kapasitas : req.query.kapasitas,
        terisi : req.query.terisi,
        kosong : req.query.kosong,
      },
    })
    .then((payload) => {
      return success(req, res, payload);
    });
};
