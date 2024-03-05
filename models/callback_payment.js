const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('callback_payment', {
    id_callback: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    serialnumber: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    payment_reff: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    va_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    partner_reff: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    partner_reff2: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    additionalfee: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    credit_balance: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    va_number: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    customer_name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    jenisbayar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fk_id_payment: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'callback_payment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_callback" },
        ]
      },
    ]
  });
};
