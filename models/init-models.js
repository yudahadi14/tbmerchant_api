var DataTypes = require("sequelize").DataTypes;
// var _lis_header = require("./lis_header");

function initModels(sequelize) {
  //var lis_header = _lis_header(sequelize, DataTypes);


  return {
   // lis_header,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
