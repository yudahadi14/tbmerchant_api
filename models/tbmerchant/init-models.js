var DataTypes = require("sequelize").DataTypes;
//var _user_login = require("./user_login");

function initModels(sequelize) {
  //var user_login = _user_login(sequelize, DataTypes);


  return {
    //user_login,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
