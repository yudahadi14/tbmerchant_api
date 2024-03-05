const { error, success } = require("../../../helpers/utility/response");
let express = require("express");
let { listUserMakanan, addUserMakanan, editUserMakanan, deleteUserMakanan, listUserMakananbyIddevice, NewUserMakanan, editbatchUserMakanan } = require("../../../controllers/api/tbmerchant/ibubayi");
let { validateUserMakanan, validateDeleteUserMakanan, validateEditUserMakanan, validateIddevice } = require("../../../helpers/validators/tbmerchant/ibubayi");
const uploads = require("../../../helpers/utility/uploads");
//let {error} = require("../../../helpers/utility/response");
const multer = require("multer");
//const upload = multer({ dest: "../../../public/upload/" });

let router = express.Router();

const single = uploads("ibubayi/").any("foto_toko");

router.get("/list",validateUserMakanan, listUserMakanan);
router.get("/listbyiddevice",validateIddevice, listUserMakananbyIddevice);
//router.post("/add",validateAddUserMakanan, addUserMakanan);
router.post("/new", (req,res, next) => 
            single(req, res, (err) => {
                //console.log(req.file);
                if(err)
                {
                    return res.json({ message: err.message });
                }
                next()
            }),        
            NewUserMakanan
);

router.post("/add", 
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
        addUserMakanan
);

router.post("/edit", 

    (req,res, next) => 
        single(req, res, (err) => {
            //console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),        
        editUserMakanan
);

router.post("/editbatch", 

    (req,res, next) => 
        single(req, res, (err) => {
            //console.log(req.file);
            if(err)
            {
                return res.json({ message: err.message });
            }
            next()
        }),        
        editbatchUserMakanan
);

router.post("/delete",validateDeleteUserMakanan, deleteUserMakanan);


// function uploadFiles(req, res) {
//     console.log(req.body);
//     console.log(req.files);
//     res.json({ message: "Successfully uploaded files" });
// }

// router.post("/upload_files", upload.any("files"),
//     uploadFiles
// );

// router.post('/post',function(req,res){
//     console.log(req.body) //you will get your data in this as object.
//     return success(req, res, req.body, "List Produk Makanan "+req.body.fullname+"", true);
//   });

// router.post("/login",validUserLogin, getLogin);
// router.post("/cekkodeLogin", validkodeLogin, cekloginKode);
// router.post("/cekLoginIDDevice", cekLoginIDDevice);
// router.post("/lupaPassword",validlupaPassword, lupaPassword);
// router.post("/lupaPasswordKode",validlupaPasswordKode, lupaPasswordKode);
//router.post("/kirimKodeUlang", cekLoginIDDevice);

// router.post("/get-token", getToken);
// router.get("/refresh-token", refreshToken);
module.exports = router;