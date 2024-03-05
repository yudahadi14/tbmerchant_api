let express = require("express");
let { insertSignup, getLogin, cekloginKode, cekLoginIDDevice, lupaPassword, lupaPasswordKode } = require("../../../controllers/api/tbmerchant/signup");
let { validUserSignup,validUserLogin, validkodeLogin,validlupaPassword, validlupaPasswordKode } = require("../../../helpers/validators/tbmerchant/signup");
let router = express.Router();

router.post("/signup",validUserSignup, insertSignup);
router.post("/login",validUserLogin, getLogin);
router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
router.post("/cekLoginIDDevice", cekLoginIDDevice);
router.post("/lupaPassword",validlupaPassword, lupaPassword);
router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);
//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;