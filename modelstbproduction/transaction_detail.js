const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_detail', {
    id_transaction_detail: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_product: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fk_transaction_header: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    id_transaction_status: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ket_transaction_status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    hargajual_produk: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    totalharga_produk: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    stok_produk: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    input_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    note_produk: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    id_ref_biayalain: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transaction_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_transaction_detail" },
        ]
      },
    ]
  });
};
