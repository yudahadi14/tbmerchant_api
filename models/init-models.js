var DataTypes = require("sequelize").DataTypes;
var _user_devicelog = require("./user_devicelog");

function initModels(sequelize) {
  var user_devicelog = _user_devicelog(sequelize, DataTypes);


  return {
    user_devicelog,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
