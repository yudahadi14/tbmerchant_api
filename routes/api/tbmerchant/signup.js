let express = require("express");
let { insertSignup, getLogin, cekloginKode, cekLoginIDDevice, lupaPassword, lupaPasswordKode, updateprofile, historyorder, inorder, logout, caridriver,
    historywithdraw, proseswithdraw } = require("../../../controllers/api/tbmerchant/signup");
let { validUserSignup,validUserLogin, validkodeLogin,validlupaPassword, 
    validlupaPasswordKode,validupdateprofile, validFullname, validproseswithdraw } = require("../../../helpers/validators/tbmerchant/signup");
let router = express.Router();
const uploads = require("../../../helpers/utility/uploads");

const single = uploads("/").any("foto_profile");

router.post("/signup",validUserSignup, insertSignup);
router.post("/login",validUserLogin, getLogin);
router.post("/logout", logout);
router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
router.post("/cekLoginIDDevice", cekLoginIDDevice);
router.post("/lupaPassword",validlupaPassword, lupaPassword);
router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);

router.post("/ubahprofile",
    (req,res, next) =>
        //console.log(req.file)
        //validateEditUserMakanan,
        single(req, res, (err) => {
            //console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),
        updateprofile
);
// router.post("/ubahprofile",validupdateprofile, updateprofile);

router.post("/historyorder",validFullname, historyorder);
router.post("/inorder",validFullname, inorder);

router.post("/caridriver", caridriver);

router.post("/historywithdraw", historywithdraw);

router.post("/proseswithdraw", validproseswithdraw, proseswithdraw);





//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;