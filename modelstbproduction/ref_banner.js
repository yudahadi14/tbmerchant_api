const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ref_banner', {
    lineid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1. Atas\r\n2. Tengah\r\n3. Bawah"
    },
    filename: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type_app: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1. Customer\r\n2. Merchant\r\n3. Driver"
    },
    date_input: {
      type: DataTypes.DATE,
      allowNull: true
    },
    peg_input: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ref_banner',
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
