var DataTypes = require("sequelize").DataTypes;
var _callback_payment = require("./callback_payment");
var _chats = require("./chats");
var _m_referensi = require("./m_referensi");
var _mref_bank_linkqu = require("./mref_bank_linkqu");
var _product_atk = require("./product_atk");
var _product_buahsayur = require("./product_buahsayur");
var _product_elektronik = require("./product_elektronik");
var _product_fashion = require("./product_fashion");
var _product_header = require("./product_header");
var _product_ibubayi = require("./product_ibubayi");
var _product_mainananak = require("./product_mainananak");
var _product_makanan = require("./product_makanan");
var _product_matrial = require("./product_matrial");
var _product_officialstore = require("./product_officialstore");
var _product_olahraga = require("./product_olahraga");
var _product_otomotif = require("./product_otomotif");
var _product_pharmacy = require("./product_pharmacy");
var _ratings = require("./ratings");
var _ref_banner = require("./ref_banner");
var _ref_digiflazz = require("./ref_digiflazz");
var _transaction_detail = require("./transaction_detail");
var _transaction_header = require("./transaction_header");
var _transaction_payment = require("./transaction_payment");
var _transaction_pulsatagihan = require("./transaction_pulsatagihan");
var _transaction_withdraw = require("./transaction_withdraw");
var _user_devicelog = require("./user_devicelog");
var _user_devicelog_customer = require("./user_devicelog_customer");
var _user_devicelog_driver = require("./user_devicelog_driver");
var _user_login = require("./user_login");
var _user_login_customer = require("./user_login_customer");
var _user_login_driver = require("./user_login_driver");
var _user_marketing = require("./user_marketing");

function initModels(sequelize) {
  var callback_payment = _callback_payment(sequelize, DataTypes);
  var chats = _chats(sequelize, DataTypes);
  var m_referensi = _m_referensi(sequelize, DataTypes);
  var mref_bank_linkqu = _mref_bank_linkqu(sequelize, DataTypes);
  var product_atk = _product_atk(sequelize, DataTypes);
  var product_buahsayur = _product_buahsayur(sequelize, DataTypes);
  var product_elektronik = _product_elektronik(sequelize, DataTypes);
  var product_fashion = _product_fashion(sequelize, DataTypes);
  var product_header = _product_header(sequelize, DataTypes);
  var product_ibubayi = _product_ibubayi(sequelize, DataTypes);
  var product_mainananak = _product_mainananak(sequelize, DataTypes);
  var product_makanan = _product_makanan(sequelize, DataTypes);
  var product_matrial = _product_matrial(sequelize, DataTypes);
  var product_officialstore = _product_officialstore(sequelize, DataTypes);
  var product_olahraga = _product_olahraga(sequelize, DataTypes);
  var product_otomotif = _product_otomotif(sequelize, DataTypes);
  var product_pharmacy = _product_pharmacy(sequelize, DataTypes);
  var ratings = _ratings(sequelize, DataTypes);
  var ref_banner = _ref_banner(sequelize, DataTypes);
  var ref_digiflazz = _ref_digiflazz(sequelize, DataTypes);
  var transaction_detail = _transaction_detail(sequelize, DataTypes);
  var transaction_header = _transaction_header(sequelize, DataTypes);
  var transaction_payment = _transaction_payment(sequelize, DataTypes);
  var transaction_pulsatagihan = _transaction_pulsatagihan(sequelize, DataTypes);
  var transaction_withdraw = _transaction_withdraw(sequelize, DataTypes);
  var user_devicelog = _user_devicelog(sequelize, DataTypes);
  var user_devicelog_customer = _user_devicelog_customer(sequelize, DataTypes);
  var user_devicelog_driver = _user_devicelog_driver(sequelize, DataTypes);
  var user_login = _user_login(sequelize, DataTypes);
  var user_login_customer = _user_login_customer(sequelize, DataTypes);
  var user_login_driver = _user_login_driver(sequelize, DataTypes);
  var user_marketing = _user_marketing(sequelize, DataTypes);


  return {
    callback_payment,
    chats,
    m_referensi,
    mref_bank_linkqu,
    product_atk,
    product_buahsayur,
    product_elektronik,
    product_fashion,
    product_header,
    product_ibubayi,
    product_mainananak,
    product_makanan,
    product_matrial,
    product_officialstore,
    product_olahraga,
    product_otomotif,
    product_pharmacy,
    ratings,
    ref_banner,
    ref_digiflazz,
    transaction_detail,
    transaction_header,
    transaction_payment,
    transaction_pulsatagihan,
    transaction_withdraw,
    user_devicelog,
    user_devicelog_customer,
    user_devicelog_driver,
    user_login,
    user_login_customer,
    user_login_driver,
    user_marketing,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
