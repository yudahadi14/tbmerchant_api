var DataTypes = require("sequelize").DataTypes;
var _asp_ref_status_nikah = require("./asp_ref_status_nikah");

function initModels(sequelize) {
  var asp_ref_status_nikah = _asp_ref_status_nikah(sequelize, DataTypes);


  return {
    asp_ref_status_nikah,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
