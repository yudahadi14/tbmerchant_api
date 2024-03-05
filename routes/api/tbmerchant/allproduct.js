const { error, success } = require("../../../helpers/utility/response");
let express = require("express");
let {  listUserAllProduct, listaddresstoko  } = require("../../../controllers/api/tbmerchant/produk_all");
let { validateUserMakanan } = require("../../../helpers/validators/tbmerchant/makanan");
const uploads = require("../../../helpers/utility/uploads");
//let {error} = require("../../../helpers/utility/response");
const multer = require("multer");
//const upload = multer({ dest: "../../../public/upload/" });

let router = express.Router();


router.get("/list",validateUserMakanan, listUserAllProduct);
router.get("/addresstoko/list",validateUserMakanan, listaddresstoko);



module.exports = router;