
let express = require("express");
let { insertSignup, getLogin, cekloginKode, cekLoginIDDevice, lupaPassword, lupaPasswordKode, addEditDriver, listaddresstoko,
    listdrivertoko, inorder, historyorder,drivermengambil, drivermengantar, driverselesai, driverkonfirmasi, ubahstatusinorder
, cekProfile, updateprofile, logout,historywithdraw, proseswithdraw, prosestopup, cektransaksilinkqu} = require("../../../controllers/api/tbdriver/signup");
let { validUserSignup,validUserLogin, validkodeLogin,validlupaPassword, validlupaPasswordKode,validAllToko,
    validDriverAnterPesanan , validcekProfile, validproseswithdraw} = require("../../../helpers/validators/tbdriver/signup");
const uploads = require("../../../helpers/utility/uploads_driver");

let router = express.Router();

const single = uploads("tb_driver/").any("foto_sim");
const single2 = uploads("tb_driver/").any("foto_barang");

const singleprofile = uploads("tb_driver/").any("foto_profile");



router.post("/signup",validUserSignup, insertSignup);
router.post("/login",validUserLogin, getLogin);
router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
router.post("/cekLoginIDDevice", cekLoginIDDevice);
router.post("/lupaPassword",validlupaPassword, lupaPassword);
router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);

router.get("/listaddresstoko",validAllToko, listaddresstoko);
router.get("/listdrivertoko",validAllToko, listdrivertoko);

router.get("/inorder",validAllToko, inorder);
router.post("/historyorder",validAllToko, historyorder);
// router.get("/ambilpesanan",validDriverAmbilPesanan, drivermengambil);

router.post("/konfirmasipesanan",validDriverAnterPesanan, driverkonfirmasi);
router.post("/ambilpesanan",
    (req,res, next) =>
        //console.log(req.file)
        //validateEditUserMakanan,
        single2(req, res, (err) => {
            console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),
        drivermengambil
);
router.post("/anterpesanan",validDriverAnterPesanan, drivermengantar);
// router.post("/selesaipesanan",validDriverAnterPesanan, driverselesai);
router.post("/selesaipesanan",
    (req,res, next) =>
        //console.log(req.file)
        //validateEditUserMakanan,
        single2(req, res, (err) => {
            //console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),
        driverselesai
);

router.post("/ubahstatusinorder",validDriverAnterPesanan, ubahstatusinorder);



router.post("/add_edit",
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
        addEditDriver
);

router.post("/cekProfile",validcekProfile, cekProfile);

router.post("/ubahprofile",
    (req,res, next) =>
        //console.log(req.file)
        //validateEditUserMakanan,
        singleprofile(req, res, (err) => {
            //console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),
        updateprofile
);

router.post("/logout", logout);

router.post("/historywithdraw", historywithdraw);

router.post("/proseswithdraw", validproseswithdraw, proseswithdraw);

router.post("/prosestopup", validproseswithdraw, prosestopup);

router.get("/cektransaksidriver", cektransaksilinkqu);


//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;