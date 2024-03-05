const multer = require("multer");
//untuk menambahkan path
const path = require("path");
const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /js/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Invalid mime type"), false);
  }
};

const upload = (directory) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), "public/upload/tb_merchant/" + directory));
    },
    filename: function (req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  let mult = multer({
    storage: diskStorage,
    //limits: { fileSize: 5 * 1024 * 1024 },
    // fileFilter: function (req, file, cb) {
    //   checkFileType(file, cb);
    // },
  });
  return mult;
};
module.exports = upload;
