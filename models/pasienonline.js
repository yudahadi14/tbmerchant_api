const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pasienonline', {
    regpsonline_id_reg: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    regpsonline_id_jns_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    regpsonline_id_jns_id_nomor: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_namalengkap: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_namapanggilan: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_tmptlahir: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    regpsonline_tgllahir: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    regpsonline_jnskelamin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    regpsonline_alamat: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_rtrw: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    regpsonline_kelurahan: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_kecamatan: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_kotadati: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_kdpos: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    regpsonline_propinsi: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_notelpon: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    regpsonline_agama: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    regpsonline_nilaiyakin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regpsonline_textnilaiyakin: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_stsnikah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    regpsonline_stswarganegara: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regpsonline_infoibu: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_infoayah: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_infoistrisuami: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_nopenjamin: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_nmwalidarurat: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_telponwalidarurat: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_fileupload: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    regpsonline_filephoto: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_flig_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    regpsonline_inputwaktu: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    regpasienonline_notelpon2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    regpsonline_alamat_domisili: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_updatewaktu: {
      type: DataTypes.DATE,
      allowNull: true
    },
    regpsonline_updatewaktu_pegawai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    regpsonline_stspendidikan: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    regpsonline_penjamin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1 umum\n2 bpjs\n3 perusahaan\n4 asuransi"
    },
    regpsonline_bahasa: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_infokerja: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    regpsonline_penjamin_subjenis: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "BPMPKB Provinsi DKI Jakarta\t--- 85855\nFlu Burung\t                --- 85811\nGepeng\/Terlantar\/Dinas\t--- 85808\nJamkesmas\t                --- 85791\nJasa Raharja, PT (Persero)\t--- 85853\nJKN non PBI\t                --- 85892\nJKN PBI\t                                --- 85891\nJKN PRB\t                                --- 85894\nJPK Gakin\t                                --- 4\nKDRT\t                                --- 85810\nKLB\t                                --- 85813\nPASIEN UMUM\t                     -1\nRencana SKTM \/ "
    },
    regpsonline_id_pasien_ps_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    regpsonline_produk_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pasienonline',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pasienonline_pkey",
        unique: true,
        fields: [
          { name: "regpsonline_id_reg" },
        ]
      },
    ]
  });
};
