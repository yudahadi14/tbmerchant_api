const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asp_ref_jenis_kartu_identitas', {
    ref_jki_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    ref_jki_ket: {
      type: DataTypes.STRING(25),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'asp_ref_jenis_kartu_identitas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asp_ref_jenis_kartu_identitas_pkey",
        unique: true,
        fields: [
          { name: "ref_jki_id" },
        ]
      },
    ]
  });
};
