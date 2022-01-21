const express = require("express");
const { getToken, refreshToken } = require("../../controllers/api/authController");
const { postLogin } = require("../../helpers/validators/auth");
const router = express.Router();

router.post("/login-pasien", postLogin, getToken);
router.get("/refresh-token", refreshToken);
module.exports = router;
