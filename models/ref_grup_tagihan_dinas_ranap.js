const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ref_grup_tagihan_dinas_ranap', {
    ref_grp_tagdnas_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ref_grp_tagdnas_nama: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ref_grp_tagdnas_urutan: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ref_grp_tagdnas_ket: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ref_grup_tagihan_dinas_ranap',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ref_grup_tagihan_dinas_ranap_pkey",
        unique: true,
        fields: [
          { name: "ref_grp_tagdnas_id" },
        ]
      },
    ]
  });
};
