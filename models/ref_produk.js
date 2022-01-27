const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ref_produk', {
    ref_prod_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ref_prod_nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ref_prod_status_generik: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_nama_resep: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ref_prod_id_grup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    ref_prod_farma: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: ""
    },
    ref_prod_pabrik: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "tdk dgunakan, bila dhapus field ini, khawatir memiliki efek berantai"
    },
    ref_prod_jns_obat: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ref_prod_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ref_prod_ket: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ref_prod_id_pabrik: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_satuan_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_biaya: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_pndpt_cash: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_pndpt_non_cash: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_jasa_dokter: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_jasa_perawat: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_jasa_rs: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_jasa_yayasan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_id_persediaan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_brg_hbs_pakai: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ref_prod_id_kategori: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "1. Konsultasi\r\n2. Pemeriksaan\r\n3. Tindakan\r\n4. Farmasi\r\n5. CT Scan\r\n6. Kamar Perawatan"
    },
    ref_prod_id_layanan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_urutan: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ref_prod_hargaperolehan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_hargadasar: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_hargajual: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_administrasi: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_pemeriksaan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_operator: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_anastesi: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_lainnya: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_tindparamedis: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_alatbahan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_oksigen: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_investasi: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_pihak3: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_akuncost_komp_administrasi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_pemeriksaan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_operator: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_anastesi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_lainnya: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_tindparamedis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_alatbahan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_oksigen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_investasi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_akuncost_komp_pihak3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_tariff: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      comment: "kode tarif untuk produk bersangkutan"
    },
    ref_prod_is_registrasi: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "Status Bahwa Produk merupakan Registrasi rekam medis"
    },
    ref_prod_is_pemeriksaan: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: "Status Bahwa Produk merupakan pemeriksaan dokter"
    },
    ref_prod_percentcito: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_hargacito: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: "Status aktif produk bersangkutan"
    },
    ref_prod_inv_reorder: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    ref_prod_inv_minimum: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    ref_prod_id_kelas_inap: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'ref_kelas_inap',
        key: 'ref_kls_inap_id'
      }
    },
    ref_prod_id_grup_tagdnas: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      references: {
        model: 'ref_grup_tagihan_dinas_ranap',
        key: 'ref_grp_tagdnas_id'
      }
    },
    ref_prod_komp_operator_jkn: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_anastesi_jkn: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_komp_lainnya_jkn: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ref_prod_id_icd9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_kateg_inacbg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ref_prod_id_modality_radio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'ref_produk',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "ref_produk_id_grup_is_1_2",
        fields: [
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "ref_produk_id_grup_is_7",
        fields: [
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "ref_produk_pkey",
        unique: true,
        fields: [
          { name: "ref_prod_id" },
        ]
      },
      {
        name: "ref_produk_ref_prod_code_key",
        fields: [
          { name: "ref_prod_code" },
        ]
      },
      {
        name: "ref_produk_ref_prod_code_ref_prod_nama_key",
        fields: [
          { name: "ref_prod_code" },
          { name: "ref_prod_nama" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_grup",
        fields: [
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_grup_in3",
        fields: [
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_grup_tdk_8",
        fields: [
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_icd9",
        fields: [
          { name: "ref_prod_id_icd9" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_layanan_key",
        fields: [
          { name: "ref_prod_id_layanan" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_ref_prod_is_registrasi",
        fields: [
          { name: "ref_prod_id" },
          { name: "ref_prod_is_registrasi" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_ref_prod_is_registrasi_true",
        fields: [
          { name: "ref_prod_id" },
          { name: "ref_prod_is_registrasi" },
        ]
      },
      {
        name: "ref_produk_ref_prod_id_ref_prod_nama",
        fields: [
          { name: "ref_prod_id" },
          { name: "ref_prod_nama" },
        ]
      },
      {
        name: "ref_produk_ref_prod_is_active",
        fields: [
          { name: "ref_prod_id_grup" },
          { name: "ref_prod_is_active" },
        ]
      },
      {
        name: "ref_produk_ref_prod_nama",
        fields: [
          { name: "ref_prod_nama" },
        ]
      },
      {
        name: "ref_produk_ref_prod_nama_ilike_kamar",
        fields: [
          { name: "ref_prod_nama" },
        ]
      },
      {
        name: "ref_produk_ref_prod_nama_ref_prod_id_grup",
        fields: [
          { name: "ref_prod_nama" },
          { name: "ref_prod_id_grup" },
        ]
      },
      {
        name: "rfproduk_code_id_ulay",
        fields: [
          { name: "ref_prod_code" },
          { name: "ref_prod_id_layanan" },
        ]
      },
    ]
  });
};
