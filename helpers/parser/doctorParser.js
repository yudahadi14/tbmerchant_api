exports.parseJadwal = (payload) => {
    let root = [];
    payload.forEach((element) => {
        let found = root.find((index) => index.peg_id == element.peg_id);
        if(found){
            found.jadwal.push({
              id: element.id,
              hari_praktek: element.hari_praktek,
              jam_praktek_mulai: element.jam_praktek_mulai,
              jam_praktek_akhir: element.jam_praktek_akhir,
            });
        }   else {
            root.push({
              peg_id: element.peg_id,
              nama_dokter: element.peg_nama,
              periode: element.periode,
              ref_layanan_id: element.ref_layanan_id,
              ref_layanan_nama: element.ref_layanan_nama,
              jadwal: [
                {
                  hari_praktek: element.hari_praktek,
                  jam_praktek_mulai: element.jam_praktek_mulai,
                  jam_praktek_akhir: element.jam_praktek_akhir,
                },
              ],
            });
        }     
    });
    return root;
}