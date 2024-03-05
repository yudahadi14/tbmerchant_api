const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ratings', {
    lineid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fk_id_merchant: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fk_id_driver: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fk_id_customer: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    nilai: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    type_dokumen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_transaksi: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    komentar: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ratings',
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
