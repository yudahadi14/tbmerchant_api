const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_header', {
    id_transaction_header: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    id_driver: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    transaction_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    input_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    input_datecustomer: {
      type: DataTypes.DATE,
      allowNull: true
    },
    input_datedriver: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_merchant: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    id_transaction_status: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ket_transaction_status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_transaksi: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    foto_barang: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_driver_anter: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_driver_selesai: {
      type: DataTypes.DATE,
      allowNull: true
    },
    coordinate_driver_anter: {
      type: "POINT",
      allowNull: true
    },
    coordinate_driver_selesai: {
      type: "POINT",
      allowNull: true
    },
    total_harga_detail: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    coordinate_driver_ambil: {
      type: "POINT",
      allowNull: true
    },
    date_driver_ambil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    coordinate_customer: {
      type: "POINT",
      allowNull: true
    },
    detail_alamatcustomer: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    alamatlengkap_customer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_merchant_konfirmasi: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_header',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_transaction_header" },
        ]
      },
    ]
  });
};
