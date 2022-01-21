const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "ref_agama",
    {
      ref_agama_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ref_agama_ket: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ref_agama",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "ref_agama_pkey",
          unique: true,
          fields: [{ name: "ref_agama_id" }],
        },
      ],
    }
  );
};
