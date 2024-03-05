const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_payment', {
    id_payment: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_transaction_header: {
      type: DataTypes.BIGINT,
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
    ref_id_bayar: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_payment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_payment" },
        ]
      },
    ]
  });
};
