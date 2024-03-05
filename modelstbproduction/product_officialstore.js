const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_officialstore', {
    produk_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    produk_nama: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    produk_harga: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    produk_stok: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    produk_kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    produk_kategori_nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    produk_foto: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    prod_id_header: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product_officialstore',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "produk_id" },
        ]
      },
    ]
  });
};
