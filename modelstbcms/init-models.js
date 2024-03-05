var DataTypes = require("sequelize").DataTypes;
var _role_user = require("./role_user");
var _user_login = require("./user_login");

function initModels(sequelize) {
  var role_user = _role_user(sequelize, DataTypes);
  var user_login = _user_login(sequelize, DataTypes);


  return {
    role_user,
    user_login,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
