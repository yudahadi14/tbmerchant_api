const express = require("express");
const { refreshToken } = require("../../controllers/api/authController");
const { postLogin } = require("../../helpers/validators/auth");
const router = express.Router();

//router.post("/get-token", getToken);
router.get("/refresh-token", refreshToken);
module.exports = router;
