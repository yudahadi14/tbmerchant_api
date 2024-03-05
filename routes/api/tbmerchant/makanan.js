let express = require("express");
let { listUserMakanan, addUserMakanan, uploadFotoUserMakanan } = require("../../../controllers/api/tbmerchant/makanan");
let { validateUserMakanan, validateAddUserMakanan } = require("../../../helpers/validators/tbmerchant/makanan");
const upload = require("../../../helpers/utility/uploads");
let {error} = require("../../../helpers/utility/response");

let router = express.Router();

let single = upload("tbmerchant/makanan").any("file");

router.post("/list",validateUserMakanan, listUserMakanan);
router.post("/add",validateAddUserMakanan, addUserMakanan);
router.post("/upload", uploadFotoUserMakanan);

router.post("/uploadtest",
    (req,res,next) => {
        single(req, res, (err) => {
            if(err)
            {
                return error(req, res, [], err.message);
            }
            next();
        });
    },
    addUserMakanan
);

// router.post("/login",validUserLogin, getLogin);
// router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
// router.post("/cekLoginIDDevice", cekLoginIDDevice);
// router.post("/lupaPassword",validlupaPassword, lupaPassword);
// router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);
//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;