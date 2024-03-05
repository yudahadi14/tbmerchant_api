const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_referensi', {
    lineid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    jenisdokumen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    value1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    value2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    harga: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    biayapihaklain: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'm_referensi',
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
