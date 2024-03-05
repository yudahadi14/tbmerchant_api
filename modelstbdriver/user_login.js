const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_login', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_fullname: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    user_email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    user_notlp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_password: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    input_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nama_kendaraan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nomor_kendaraan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tgl_aktif_sim: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    jenis_driver: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    foto_link_sim: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    foto_link_stnk: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    tgl_aktif_stnk: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    merchant_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    alamat: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_login',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
