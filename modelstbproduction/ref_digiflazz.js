const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ref_digiflazz', {
    id_ref: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    seller_name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    buyer_sku_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "ref_digiflazz_UN"
    },
    buyer_product_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    seller_product_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    unlimited_stock: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    stock: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    multi: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    start_cut_off: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_cut_off: {
      type: DataTypes.TIME,
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price_jual: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_telepon: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    admin: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    commision: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ref_digiflazz',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ref" },
        ]
      },
      {
        name: "ref_digiflazz_UN",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "buyer_sku_code" },
        ]
      },
    ]
  });
};
