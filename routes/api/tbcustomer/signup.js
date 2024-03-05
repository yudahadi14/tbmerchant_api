
let express = require("express");
let { insertSignup, getLogin, cekloginKode, cekLoginIDDevice, lupaPassword, lupaPasswordKode, cekadabasket, inorder, inorderbyid,
    deleteBasket, produkpulsa, topupdigiflazz, produkpulsapasca, ceknomortoken, getbanner, createrating, getdataprofile, logout,getdatakomentar,chats,insertchats } = require("../../../controllers/api/tbcustomer/signup");
let { validUserSignup,validUserLogin, validkodeLogin,validlupaPassword, validlupaPasswordKode,validcreaterating,validinsertchats } = require("../../../helpers/validators/tbcustomer/signup");
let router = express.Router();

router.post("/signup",validUserSignup, insertSignup);
router.post("/login",validUserLogin, getLogin);
router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
router.post("/cekLoginIDDevice", cekLoginIDDevice);

router.post("/cekadabasket", cekadabasket);

router.post("/inorder", inorder);
router.post("/inorderbyid", inorderbyid);

router.post("/deletebasket", deleteBasket);

router.post("/produkpulsa", produkpulsa);

router.post("/produkpulsapasca", produkpulsapasca);

router.post("/topupdigiflazz", topupdigiflazz);

router.post("/ceknomortoken", ceknomortoken);

router.post("/getbanner", getbanner);

router.post("/createrating",validcreaterating, createrating);

router.post("/getdataprofile", getdataprofile);

router.post("/logout", logout);

router.post("/getdatakomentar", getdatakomentar);

router.post("/chats", chats);

router.post("/insertchats",validinsertchats, insertchats);
















// router.post("/lupaPassword",validlupaPassword, lupaPassword);
// router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);
//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;