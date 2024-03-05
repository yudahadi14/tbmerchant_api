const { error, success } = require("../../../helpers/utility/response");
let express = require("express");
let {  listproduk,listprodukheader,listpesananbasket,tambahdetailpesanan,listpesananbasketdetail,editdetailpesanan,
    getbiayalainlain, getnotransfer, getdetaillokasi, listprodukheadermaps, topupdigiflazz,
    cekstatustopup , listprodukheaderall } = require("../../../controllers/api/transaction/transaction");
let { validateListProduk,validateOnesignal, validatetambahdetailpesanan, validateeditdetailpesanan } = require("../../../helpers/validators/transaction/transaction");
const uploads = require("../../../helpers/utility/uploads");
//let {error} = require("../../../helpers/utility/response");
const multer = require("multer");
//const upload = multer({ dest: "../../../public/upload/" });

let router = express.Router();


router.get("/listproduk",validateListProduk, listproduk);
router.get("/listprodukheader",validateListProduk, listprodukheader);
router.get("/listprodukheaderall",validateListProduk, listprodukheaderall);




router.post("/listbasketheader",validateOnesignal, listpesananbasket);

router.get("/listprodukheadermaps", listprodukheadermaps);



router.post("/tambahdetailpesanan",validatetambahdetailpesanan, tambahdetailpesanan);

router.post("/listpesananbasketdetail",validateOnesignal, listpesananbasketdetail);

router.post("/editdetailpesanan",validateeditdetailpesanan, editdetailpesanan);

router.post("/getbiayalainlain", getbiayalainlain);

router.post("/getnotransfer", getnotransfer);

router.post("/getdetaillokasi", getdetaillokasi);

router.post("/topupdigiflazz", topupdigiflazz);

router.post("/cekstatustopup", cekstatustopup);











module.exports = router;