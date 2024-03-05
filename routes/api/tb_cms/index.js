const { error, success } = require("../../../helpers/utility/response");
let express = require("express");
let {  userlogin  } = require("../../../controllers/api/tb_cms/index");
let { validUser } = require("../../../helpers/validators/tb_cms/index");
const uploads = require("../../../helpers/utility/uploads");
//let {error} = require("../../../helpers/utility/response");
const multer = require("multer");
//const upload = multer({ dest: "../../../public/upload/" });

let router = express.Router();


router.post("/cms",validUser, userlogin);



module.exports = router;