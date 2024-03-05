const { error, success } = require("../../../helpers/utility/response");
let express = require("express");
let {  getdatabank, callbackuniquecode, getdatabankLinkqu,callbackva } = require("../../../controllers/api/transaction/paymentgateway");
let { validate } = require("../../../helpers/validators/transaction/paymentgateway");


let router = express.Router();


router.post("/listbank",validate, getdatabank);
router.post("/callbackuniquecode", callbackuniquecode);
router.post("/callbackva", callbackva);

router.post("/getdatabankLinkqu",validate, getdatabankLinkqu);







module.exports = router;