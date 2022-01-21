const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ref_pekerjaan', {
    ref_pkrjn_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ref_pkrjn_nama: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ref_pekerjaan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ref_pekerjaan_pkey",
        unique: true,
        fields: [
          { name: "ref_pkrjn_id" },
        ]
      },
    ]
  });
};
