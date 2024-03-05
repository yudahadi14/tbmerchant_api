const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_pulsatagihan', {
    lineid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ref_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    customer_no: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    buyer_sku_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userid_customer: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ref_id_digiflazz: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status_pembayaran: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status_digiflazz: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    data_digiflazz: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kodeuniktrf: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    jmltrf: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    batas_trf: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idbayar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    customer_nama: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    partner_reff: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    expired: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    customer_phone: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    customer_email: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    bank_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    pin: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    virtual_account: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    namapelanggan: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_pulsatagihan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lineid" },
        ]
      },
    ]
  });
};
