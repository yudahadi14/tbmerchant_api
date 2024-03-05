const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbcms");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");
//const jwt = require('jsonwebtoken');
//const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");

exports.userlogin = (req, res) => {

    const { perintah, user_id, user_nama, user_password, username } = req.body;

    if(perintah == "add")
    {

        let query = `select * from user_login where username = :usernamee`;

        return models.sequelize
            .query(query, {
                replacements: {
                    usernamee: username
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    return models.user_login.create({
                        user_nama: user_nama || null,
                        //user_email: lis_order_number || null,
                        username: username || null,
                        user_password: md5(user_password) || null
                    })
                        .then((userdetail) => {

                            if (userdetail) {

                                return success(req, res, userdetail, "Anda Berhasil Terdaftar.", true);

                            }

                            return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);

                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });

                }else{
                    return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
            });

    }else if(perintah == "edit")
    {

        let query = `select * from user_login where user_id = :userid`;

        return models.sequelize
            .query(query, {
                replacements: {
                    userid: user_id
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    return models.user_login.update({
                        user_nama: user_nama || null,
                        username: username,
                        //user_email: lis_order_number || null,
                        user_password: md5(user_password) || null
                    },{where: {user_id: user_id}})
                        .then((userdetail) => {

                            if (userdetail) {

                                return success(req, res, userdetail, "Anda Berhasil Update.", true);

                            }

                            return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);

                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });

                }else{
                    return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
            });

    }else if(perintah == "delete")
    {
        let query = `select * from user_login where username = :usernamee`;

        return models.sequelize
            .query(query, {
                replacements: {
                    usernamee: username
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    return models.user_login.destroy({where: {user_id: user_id}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, {}, "Data Berhasil Di Delete", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                }else{
                    return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "User Sudah Terdaftar, Silahkan Login", false, err);
            });

    }else if(perintah == "login"){


        let query = `select * from user_login 
        left join role_user on fk_user_id = user_id
        where username = :usernamee and user_password = :password`;

        return models.sequelize
            .query(query, {
                replacements: {
                    usernamee: username,
                    password: md5(user_password),
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                return success(req, res, payload, "Data Berhasil Di Delete", true);

            })
            .catch((err) => {
                return error(req, res, {}, "Username atau password salah", false, err);
            });


    }else{
        return error(req, res, {}, "Data Tidak Ada", false, err);
    }

}