const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_withdraw', {
    lineid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fk_user_driver: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fk_user_merchant: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    tipedokumen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jumlahuang: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status_ket: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    bankcode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    accountnumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    partner_ref: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    inquiry_reff: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    signature: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    tanggal_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    virtualaccount: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_withdraw',
    hasTrigger: true,
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
