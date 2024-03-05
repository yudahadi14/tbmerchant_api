const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_marketing', {
    id_marketing: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kode_referal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isleader: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    idleader: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    input_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isaktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isdelete: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_marketing',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_marketing" },
        ]
      },
    ]
  });
};
