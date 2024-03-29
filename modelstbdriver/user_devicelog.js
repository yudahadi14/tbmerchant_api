const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_devicelog', {
    log_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    kode_otp: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    jenisdokumen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    iddevice: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    expired_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_login: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fk_userlogin: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_onesignal: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    firebasetoken: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    coordinate_alamat: {
      type: "POINT",
      allowNull: true
    },
    status_aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_devicelog',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "log_id" },
        ]
      },
    ]
  });
};
