const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asp_ref_pendidikan', {
    pend_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    pend_nama: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'asp_ref_pendidikan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asp_ref_pendidikan_pkey",
        unique: true,
        fields: [
          { name: "pend_id" },
        ]
      },
    ]
  });
};
