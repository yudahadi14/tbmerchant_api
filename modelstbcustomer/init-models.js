var DataTypes = require("sequelize").DataTypes;
var _user_devicelog = require("./user_devicelog");
var _user_login = require("./user_login");

function initModels(sequelize) {
  var user_devicelog = _user_devicelog(sequelize, DataTypes);
  var user_login = _user_login(sequelize, DataTypes);


  return {
    user_devicelog,
    user_login,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
