const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_mobile', {
    id_user: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mr: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tgl_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    no_telp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_login: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    device_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    tgl_daftar: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fk_onesignal: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_mobile',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_mobile_pkey",
        unique: true,
        fields: [
          { name: "mr" },
        ]
      },
    ]
  });
};


// sequelize-auto -h 192.168.200.200 -d rsudc -u admin -x admin   --dialect postgres -c ./config/config.js -o ./models -t billing_va_dki
