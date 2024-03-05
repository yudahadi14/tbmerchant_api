const { error, success } = require("../../helpers/utility/response");
const models = require("../../models");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");

exports.refreshToken = (req, res) => {
  let { refresh_token } = req.headers;
  if (!refresh_token) {
    return error(req, res, {}, "Mohon isi refreshToken!.", 400);
  }

  const verified = regenerateToken(refresh_token);
  if(verified.error){
    if (verified.name === "JsonWebTokenError") {
      return error(req, res, {}, "Token Invalid!.", 400);
    } else if (verified.name == "TokenExpiredError") {
      return error(req, res, {}, "Token Expired!.", 400);
    } else {
      return error(req, res, {}, "Token Invalid!.", 400);
    }
  }
  
  return success(
    req,
    res,
    signAuthJwt({
      mr: verified.mr,
      nama: verified.nama,
      tgl_lahir: verified.tgl_lahir,
      no_telp: verified.no_telp,
      email: verified.email,
    }),
    "Token diberikan."
  );

};

// exports.getToken = (req, res) => {
//   // let { no_tlp, email, no_mr, password } = req.body;
//   // const getUser = () => {
//   //   if (no_mr) {
//   //     return models.user_mobile.findOne({
//   //       where: {
//   //         mr: no_mr,
//   //       },
//   //     });
//   //   } else if (email) {
//   //     return models.user_mobile.findOne({
//   //       where: {
//   //         email: email,
//   //       },
//   //     });
//   //   } else if (no_tlp) {
//   //     return models.user_mobile.findOne({
//   //       where: {
//   //         no_telp: no_tlp,
//   //       },
//   //     });
//   //   } else {
//   //     return new Promise((resolve, reject) => {
//   //       reject("Isi salah satu");
//   //     });
//   //   }
//   // };

//   // const promise = new Promise((resolve, reject) => {
//   //   resolve(getUser());
//   // });

//   // promise
//   //   .then((payload) => {
//   //     if (!payload) {
//   //       throw Error("User tidak ditemukan");
//   //     }
//   //     let authToken = signAuthJwt({
//   //       mr: payload.mr,
//   //       nama: payload.nama,
//   //       tgl_lahir: payload.tgl_lahir,
//   //       no_telp: payload.no_telp,
//   //       email: payload.email,
//   //     });
//   //     let refreshToken = signRefreshJwt({
//   //       mr: payload.mr,
//   //       nama: payload.nama,
//   //       tgl_lahir: payload.tgl_lahir,
//   //       no_telp: payload.no_telp,
//   //       email: payload.email,
//   //     });
//   //     if (payload.password == md5(password)) {
//   //       return success(
//   //         req,
//   //         res,
//   //         {
//   //           authToken: authToken,
//   //           refreshToken: refreshToken,
//   //           data_pasien: {
//   //             mr: payload.mr,
//   //             nama: payload.nama,
//   //             tgl_lahir: payload.tgl_lahir,
//   //             no_telp: payload.no_telp,
//   //             email: payload.email,
//   //           },
//   //         },
//   //         "User termuat",
//   //         200
//   //       );
//   //     } else {
//   //       throw Error("Username / password tidak sesuai");
//   //     }
//   //   })
//   //   .catch((err) => {
//   //     console.log("Login user err: ", err);
//   //     return error(
//   //       req,
//   //       res,
//   //       {},
//   //       err.message ? err.message : "Ada Kesalahan",
//   //       err.message ? 400 : 500
//   //     );
//   //   });
//   // const { username, password } = req.body;
//   // console.log(`${username} is trying to login ..`);

//   // if (username === "admin" && password === "admin") {
//   //   return res.json({
//   //     token: jsonwebtoken.sign({ user: "admin" },  process.env.JWT_AUTH_TOKEN_KEY),
//   //   });
//   // }

//   // return res
//   //   .status(401)
//   //   .json({ message: "The username and password your provided are invalid" });

// };
