const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_login_customer', {
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
    jenis_kelamin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_tgllahir: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_bio: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    user_username: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    user_foto: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    user_referalcode: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_login_customer',
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
