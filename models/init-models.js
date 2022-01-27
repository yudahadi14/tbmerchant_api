var DataTypes = require("sequelize").DataTypes;
var _pasienonline = require("./pasienonline");

function initModels(sequelize) {
  var pasienonline = _pasienonline(sequelize, DataTypes);


  return {
    pasienonline,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
