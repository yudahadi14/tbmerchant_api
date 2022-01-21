const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asp_ref_status_nikah', {
    stat_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    stat_ket: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'asp_ref_status_nikah',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asp_ref_status_nikah_pkey",
        unique: true,
        fields: [
          { name: "stat_id" },
        ]
      },
    ]
  });
};
