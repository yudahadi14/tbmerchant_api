const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_header', {
    prod_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fk_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    kategori_nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nama_toko: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    alamat_toko: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    coordinate: {
      type: "POINT",
      allowNull: true
    },
    alamatlengkap: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kodepos: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kota: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kecamatan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kelurahan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alamatket: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    biayapackaging: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'product_header',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prod_id" },
        ]
      },
    ]
  });
};
