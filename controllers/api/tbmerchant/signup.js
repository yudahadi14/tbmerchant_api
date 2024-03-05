
const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbproduction");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");
const { token } = require("morgan");
//const jwt = require('jsonwebtoken');
//const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");


exports.insertSignup = (req, res) => {
    let { fullname, emailphone, userpass, referalcode, iddevice, telepon } = req.body;
    let { email, notlp } = '';
    let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let regexTlp1 = /^\d{14}$/;
    let regexTlp2 = /^\d{13}$/;
    let regexTlp3 = /^\d{12}$/;
    let regexTlp4 = /^\d{11}$/;

    email = null;
    notlp = null;

    // cek email atau no telepon
    // if (regexEmail.test(emailphone) == true) {
    //     email = emailphone;
    // } else if (regexTlp4.test(emailphone) == true) {
    //     notlp = emailphone;
    // } else if (regexTlp3.test(emailphone) == true) {
    //     notlp = emailphone;
    // } else if (regexTlp2.test(emailphone) == true) {
    //     notlp = emailphone;
    // } else if (regexTlp1.test(emailphone) == true) {
    //     notlp = emailphone;
    // }

    if (regexEmail.test(emailphone) == true) {
        email = emailphone;
    }

    if (regexTlp4.test(telepon) == true) {
        notlp = telepon;
    } else if (regexTlp3.test(telepon) == true) {
        notlp = telepon;
    } else if (regexTlp2.test(telepon) == true) {
        notlp = telepon;
    } else if (regexTlp1.test(telepon) == true) {
        notlp = telepon;
    }

    let query = ``;

    if (email == null && notlp != null) {
        query = `
        select * from user_login where user_notlp = :tlp or user_fullname = :namee limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    tlp: notlp,
                    namee: fullname,
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    return models.user_login.create({
                        user_fullname: fullname || null,
                        //user_email: lis_order_number || null,
                        user_notlp: notlp || null,
                        user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                if (iddevice == null || iddevice == '') {
                                    return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                } else {
                                    return models.user_devicelog.create({
                                        jenisdokumen: 'OTP' || null,
                                        id_onesignal: idonesignal || null,
                                        kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                        fk_userlogin: userdetail.user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {

                                                let kodee = userdetail2.kode_otp;
                                                //console.log(userdetail2.kode_otp);

                                                const axios = require('axios');
                                                let dataCekNoWa = JSON.stringify({
                                                    "api_key": "PGPMKGTZTWJU6ERM",
                                                    "number_key": "V1ulESOeo5Wu7ekq",
                                                    "phone_no": notlp
                                                });

                                                let configCekNoWa = {
                                                    method: 'post',
                                                    maxBodyLength: Infinity,
                                                    url: 'https://api.watzap.id/v1/validate_number',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                                    },
                                                    data: dataCekNoWa
                                                };

                                                axios.request(configCekNoWa)
                                                    .then((response) => {
                                                        console.log(JSON.stringify(response.data));
                                                        const { status } = JSON.parse(JSON.stringify(response.data));
                                                        if(status == 200){

                                                            const axios = require('axios');
                                                            let data = JSON.stringify({
                                                            "api_key": "PGPMKGTZTWJU6ERM",
                                                            "number_key": "V1ulESOeo5Wu7ekq",
                                                            "phone_no": notlp,
                                                            "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                                            });

                                                            let config = {
                                                            method: 'post',
                                                            maxBodyLength: Infinity,
                                                            url: 'https://api.watzap.id/v1/send_message',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                                            },
                                                            data : data
                                                            };

                                                            axios.request(config)
                                                            .then((response) => {
                                                                console.log(JSON.stringify(response.data));
                                                                const { status } = JSON.parse(JSON.stringify(response.data));
                                                                if(status == 200)
                                                                {
                                                                    return success(req, res, [{'isemail' : 2}], "Kode OTP Berhasil Dikirim", true);
                                                                }else{
                                                                    return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                                }
                                                            //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                                            })
                                                            .catch((error) => {
                                                                return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                            });
                                                        }else{
                                                            return error(req, res, {}, "No HP anda Tidak Terhubung Whatsapp", true, error);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });





                                                //if()

                                                //return success(req, res, {}, "Kode OTP Berhasil Dikirim", true);

                                                // let transporter = nodemailer.createTransport({
                                                //     service: 'gmail',
                                                //     auth: {
                                                //         user: 'tolongbeliin0dev@gmail.com',
                                                //         pass: 'sqzucwjsqjnqfbrq'
                                                //     }
                                                // });

                                                // let mailOptions = {
                                                //     from: 'tolongbeliin0dev@gmail.com',
                                                //     to: userdetail.user_email,
                                                //     subject: 'Kode OTP !!! ',
                                                //     text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                // };

                                                // transporter.sendMail(mailOptions, function (error, info) {
                                                //     if (error) {

                                                //         return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                //         //console.log(error);
                                                //     } else {
                                                //         return success(req, res, [{'isemail' : 2}], "Kode OTP Berhasil Dikirim", true);
                                                //         // console.log('Email sent: ' + info.response);
                                                //     }
                                                // });
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                                        });

                                }


                            }
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });


                } else {
                    err = 'err';
                    return error(req, res, {}, "Merchant Sudah Terdaftar", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
            });

    } else if (email != null && notlp == null) {

        query = `
        select * from user_login where user_email = :emaill or user_fullname = :namee limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    emaill: email,
                    namee: fullname,
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let count = payload.length;
                //console.log(count);

                if (count == 0) {
                    return models.user_login.create({
                        user_fullname: fullname || null,
                        user_email: email || null,
                        //user_notlp: notlp || null,
                        user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                //if (iddevice == null || iddevice == '') {
                                  //  return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                // } else {

                                    return models.user_devicelog.create({
                                        jenisdokumen: 'OTP' || null,
                                        iddevice: iddevice || null,
                                        kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                        fk_userlogin: userdetail.user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {

                                                let kodee = userdetail2.kode_otp;
                                                //console.log(userdetail2.kode_otp);

                                                let transporter = nodemailer.createTransport({
                                                    service: 'gmail',
                                                    auth: {
                                                        user: 'tolongbeliin0dev@gmail.com',
                                                        pass: 'sqzucwjsqjnqfbrq'
                                                    }
                                                });

                                                let mailOptions = {
                                                    from: 'tolongbeliin0dev@gmail.com',
                                                    to: userdetail.user_email,
                                                    subject: 'Kode OTP !!! ',
                                                    text: `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                                };

                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {

                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                        //console.log(error);
                                                    } else {
                                                        return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                        // console.log('Email sent: ' + info.response);
                                                    }
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                                        });
                                    // return models.user_devicelog.create({
                                    //     jenisdokumen: 'LOGIN' || null,
                                    //     iddevice: iddevice || null,
                                    //     is_login: true || null,
                                    //     fk_userlogin: userdetail[0].user_id || null,
                                    //     expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                    // })
                                    //     .then((userdetail2) => {



                                    //         if (userdetail2) {
                                    //             return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                    //         }
                                    //     })
                                    //     .catch((err) => {
                                    //         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    //     });
                                }

                            //}
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });
                } else {
                    err = 'err';
                    return success(req, res, {}, "Merchant Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi 3", false, err);
            });
    } else if (email != null && notlp != null) {

        query = `
        select * from user_login where user_email = :emaill or user_notlp = :phone or user_fullname = :namee limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    emaill: email,
                    namee: fullname,
                    phone: notlp
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let count = payload.length;
                //console.log(count);

                if (count == 0) {
                    return models.user_login.create({
                        user_fullname: fullname || null,
                        user_email: email || null,
                        user_notlp: notlp || null,
                        user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                //if (iddevice == null || iddevice == '') {
                                  //  return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                // } else {

                                    return models.user_devicelog.create({
                                        jenisdokumen: 'OTP' || null,
                                        iddevice: iddevice || null,
                                        kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                        fk_userlogin: userdetail.user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {

                                                let kodee = userdetail2.kode_otp;
                                                //console.log(userdetail2.kode_otp);

                                                let transporter = nodemailer.createTransport({
                                                    service: 'gmail',
                                                    auth: {
                                                        user: 'tolongbeliin0dev@gmail.com',
                                                        pass: 'sqzucwjsqjnqfbrq'
                                                    }
                                                });

                                                let mailOptions = {
                                                    from: 'tolongbeliin0dev@gmail.com',
                                                    to: userdetail.user_email,
                                                    subject: 'Kode OTP !!! ',
                                                    text: `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                                };

                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {

                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                        //console.log(error);
                                                    } else {
                                                        const axios = require('axios');
                                                        let data = JSON.stringify({
                                                            "api_key": "PGPMKGTZTWJU6ERM",
                                                            "number_key": "V1ulESOeo5Wu7ekq",
                                                            "phone_no": notlp,
                                                            "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                                        });

                                                        let config = {
                                                            method: 'post',
                                                            maxBodyLength: Infinity,
                                                            url: 'https://api.watzap.id/v1/send_message',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                                            },
                                                            data: data
                                                        };

                                                        axios.request(config)
                                                            .then((response) => {
                                                                // console.log(JSON.stringify(response.data));
                                                                // const { status } = JSON.parse(JSON.stringify(response.data));
                                                                // if (status == 200) {
                                                                //     return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                                // } else {
                                                                //     return error(req, res, {}, "Login Error Silahkan Cobalagi", true, true);
                                                                // }
                                                                return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                                //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                                            })
                                                            .catch((errors) => {
                                                                return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                            });

                                                        //return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                        // console.log('Email sent: ' + info.response);
                                                    }
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                                        });
                                    // return models.user_devicelog.create({
                                    //     jenisdokumen: 'LOGIN' || null,
                                    //     iddevice: iddevice || null,
                                    //     is_login: true || null,
                                    //     fk_userlogin: userdetail[0].user_id || null,
                                    //     expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                    // })
                                    //     .then((userdetail2) => {



                                    //         if (userdetail2) {
                                    //             return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                    //         }
                                    //     })
                                    //     .catch((err) => {
                                    //         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    //     });
                                }

                            //}
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });
                } else {
                    err = 'err';
                    return success(req, res, {}, "Merchant Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi 3", false, err);
            });
    } else {
        err = 'error';
        return error(req, res, {}, "Mohon isi Email / Number Phone !.", false, err);
    }

}

exports.getLogin = (req, res) => {
    let { fullname, userpass, iddevice } = req.body;

    let querysigin = '';

    if (fullname != null && userpass != null) {
        querysigin = `
    select * from user_login where user_fullname = :nama and user_password = :pass limit 1
    `;

    return models.sequelize
    .query(querysigin, {
        replacements: {
            nama: fullname,
            pass: md5(userpass),
        },
        type: QueryTypes.SELECT,
    })
    .then((payload) => {
        let count = payload.length;

        if (count == 0) {
            return error(req, res, {}, "Fullname atau Password Salah Silahkan Cek Kembali", false, err);

        } else {

            if (payload[0].user_email != null) {

                //console.log(Math.floor(100000 + Math.random() * 900000));
                //let kodeotpp = Math.floor(100000 + Math.random() * 900000);

                //console.log(kodeotpp);

                return models.user_devicelog.create({
                    jenisdokumen: 'OTP' || null,
                    iddevice: iddevice || null,
                    kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                    fk_userlogin: payload[0].user_id || null,
                    expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                })
                    .then((userdetail2) => {
                        if (userdetail2) {

                            let kodee = userdetail2.kode_otp;
                            //console.log(userdetail2.kode_otp);

                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'tolongbeliin0dev@gmail.com',
                                    pass: 'sqzucwjsqjnqfbrq'
                                }
                            });

                            let mailOptions = {
                                from: 'tolongbeliin0dev@gmail.com',
                                to: payload[0].user_email,
                                subject: 'Kode OTP !!! ',
                                text: `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                            };

                            transporter.sendMail(mailOptions, function (errr, info) {
                                if (errr) {

                                    return error(req, res, {}, "Login Error Silahkan Cobalagi", true, errr);
                                    //console.log(error);
                                } else {
                                    if (payload[0].user_notlp != null) {

                                        const axios = require('axios');
                                        let data = JSON.stringify({
                                        "api_key": "PGPMKGTZTWJU6ERM",
                                        "number_key": "V1ulESOeo5Wu7ekq",
                                        "phone_no": payload[0].user_notlp,
                                        "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                        });

                                        let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://api.watzap.id/v1/send_message',
                                        headers: {
                                            'Content-Type': 'application/json',
                                                    'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                                },
                                                data : data
                                                };

                                                axios.request(config)
                                                .then((response) => {
                                                    console.log(JSON.stringify(response.data));
                                                    const { status } = JSON.parse(JSON.stringify(response.data));
                                                    if(status == 200)
                                                    {
                                                        return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                    }else{
                                                        return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                    }
                                                //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                                })
                                                .catch((error) => {
                                                    return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                                });

                                            }
                                            // return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                            // console.log('Email sent: ' + info.response);
                                        }
                                    });
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                            });





                    } else if (payload[0].user_notlp != null) {
                        //return success(req, res, payload, "Login Berhasil.", true);
                        return models.user_devicelog.create({
                            jenisdokumen: 'OTP' || null,
                            //id_onesignal: idonesignal || null,
                            kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                            fk_userlogin: payload[0].user_id || null,
                            expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                        })
                            .then((userdetail2) => {
                                if (userdetail2) {

                                    let kodee = userdetail2.kode_otp;
                                    //console.log(userdetail2.kode_otp);

                                    const axios = require('axios');
                                    let dataCekNoWa = JSON.stringify({
                                        "api_key": "PGPMKGTZTWJU6ERM",
                                        "number_key": "V1ulESOeo5Wu7ekq",
                                        "phone_no": notlp
                                    });

                                    let configCekNoWa = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://api.watzap.id/v1/validate_number',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                        },
                                        data: dataCekNoWa
                                    };

                                    axios.request(configCekNoWa)
                                    .then((response) => {
                                        console.log(JSON.stringify(response.data));
                                        const { status } = JSON.parse(JSON.stringify(response.data));
                                        if(status == 200){

                                            const axios = require('axios');
                                            let data = JSON.stringify({
                                            "api_key": "PGPMKGTZTWJU6ERM",
                                            "number_key": "V1ulESOeo5Wu7ekq",
                                            "phone_no": payload[0].user_notlp,
                                            "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
                                            });

                                            let config = {
                                            method: 'post',
                                            maxBodyLength: Infinity,
                                            url: 'https://api.watzap.id/v1/send_message',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Cookie': 'PHPSESSID=uhontamm1r2ig5k57dc4og0t75; X_URL_PATH=aHR0cHM6Ly9jb3JlLndhdHphcC5pZC98fHx8fHN1c3VrYWNhbmc%3D'
                                            },
                                            data : data
                                            };

                                            axios.request(config)
                                            .then((response) => {
                                                console.log(JSON.stringify(response.data));
                                                const { status } = JSON.parse(JSON.stringify(response.data));
                                                if(status == 200)
                                                {
                                                    return success(req, res, [{'isemail' : 2}], "Kode OTP Berhasil Dikirim", true);
                                                }else{
                                                    return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                }
                                            //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                            })
                                            .catch((error) => {
                                                return success(req, res, [{'isemail' : 1}], "Kode OTP Berhasil Dikirim", true);
                                            });
                                        }else{
                                            return error(req, res, {}, "No HP anda Tidak Terhubung Whatsapp", true, error);
                                        }
                                    })
                                    .catch((error) => {
                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                    });





                                //if()

                                //return success(req, res, {}, "Kode OTP Berhasil Dikirim", true);

                                // let transporter = nodemailer.createTransport({
                                //     service: 'gmail',
                                //     auth: {
                                //         user: 'tolongbeliin0dev@gmail.com',
                                //         pass: 'sqzucwjsqjnqfbrq'
                                //     }
                                // });

                                // let mailOptions = {
                                //     from: 'tolongbeliin0dev@gmail.com',
                                //     to: userdetail.user_email,
                                //     subject: 'Kode OTP !!! ',
                                //     text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                // };

                                // transporter.sendMail(mailOptions, function (error, info) {
                                    //     if (error) {

                                    //         return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                    //         //console.log(error);
                                    //     } else {
                                    //         return success(req, res, [{'isemail' : 2}], "Kode OTP Berhasil Dikirim", true);
                                    //         // console.log('Email sent: ' + info.response);
                                    //     }
                                    // });
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                            });
                    } else {
                        return success(req, res, payload, "Login Berhasil.", true);
                    }

                }
            })
            .catch((err) => {
                return error(req, res, {}, "Fullname atau Password Salah Silahkan Cek Kembali", false, err);
            });

    }






}


exports.cekloginKode = (req, res) => {

    let { fullname, iddevice, kodeotp, idonesignal, tokenfirebase } = req.body;

    console.log(tokenfirebase);

    if (fullname != null && iddevice != null) {

        let query = `select * from user_login ul
        left join user_devicelog ud on ud.fk_userlogin = ul.user_id
        where ul.user_fullname = :namefull and ud.jenisdokumen = 'OTP'
        and now() <= ud.expired_date and kode_otp = :otpcode
        order by ud.log_id desc
        LIMIT 1;`;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname,
                    deviceid: iddevice,
                    otpcode: parseInt(kodeotp)
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let jml = 0 ;
                jml = payload.length;

                if(jml > 0)
                {

                if(iddevice != '' || iddevice != null)
                    {

                        let querycekdevice =  `select * from user_devicelog where iddevice = :deviceid and jenisdokumen = 'LOGIN' limit 1`;
                        
                        return models.sequelize
                            .query(querycekdevice, {
                                replacements: {
                                    deviceid: iddevice,
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {

                                let count2 = payload2.length;
                                console.log(payload[0].user_id);

                                if(count2 == 0)
                                {

                                    return models.user_devicelog.create({
                                        jenisdokumen: 'LOGIN' || null,
                                        kode_otp: parseInt(payload.kode_otp),
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        id_onesignal: idonesignal || null,
                                        firebasetoken: tokenfirebase || null
                                    })
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {

                                            console.log(payload[0].user_id);
                                                                    dataheader =
                                                                        {
                                                                            fk_userlogin: payload[0].user_id,
                                                                            iddevice: iddevice
                                                                        }
                                                                    dataheaderquery = `
                                                                    DELETE from user_devicelog where fk_userlogin = :fk_userlogin
                                                                    and iddevice != :iddevice and jenisdokumen = 'LOGIN'
                                                                    `;

                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.DELETE,
                                                                    }
                                                                    )
                                            .then((userdetail3) => {
                                                return success(req, res, payload, "Login Berhasil.", true);
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }else{

                                    return models.user_devicelog.update({
                                        is_login: true || null,
                                        kode_otp: payload[0].kode_otp,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        update_date: moment(new Date(), "YYYY-MM-DD"),
                                        id_onesignal: idonesignal || null,
                                        firebasetoken: tokenfirebase || null
                                    },{where: {iddevice: iddevice}})
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {
                                            console.log(payload[0].user_id);
                                            dataheader =
                                                                        {
                                                                            fk_userlogin: payload[0].user_id,
                                                                            iddevice: iddevice
                                                                        }
                                                                    dataheaderquery = `
                                                                    DELETE from user_devicelog where fk_userlogin = :fk_userlogin
                                                                    and iddevice != :iddevice and jenisdokumen = 'LOGIN'
                                                                    `;

                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.DELETE,
                                                                    }
                                                                    )
                                            .then((userdetail3) => {
                                                return success(req, res, payload, "Login Berhasil.", true);
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });



                                }

                            })
                            .catch((err) => {
                            return error(req, res, {}, "Error Login Silahkan Cobalagi", false, err);
                            });

                    }else{
                        return success(req, res, payload, "Login Berhasil.", true);
                    }

                }else{
                    err = '02';
                    return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
            });
    }



}

exports.cekLoginIDDevice = (req, res) => {

    let { iddevice, tokenfirebase } = req.body;

    console.log('firebase = '+tokenfirebase);

    if(iddevice != null)
    {

        let query = `select
        ul.user_foto,
        ul.user_id,
        ul.user_fullname as fullname,
        case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
        when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
        end as emailornotlp,
        ul.user_referalcode as kodereferal,
        ud.iddevice as deviceid,
        ul.user_email,
        ul.user_notlp,
        ul.nama_bank,
        ul.no_rekening,
        (
            select 
            CONCAT(
            '[', 
            GROUP_CONCAT(CONCAT('"',mbl.namaBank,'"')),
            ']'
            ) as jj 
             from mref_bank_linkqu mbl 
            where mbl.isActive is true and mbl.type_kode = 'va'
            ) as refbank
        from user_login ul
                left join user_devicelog ud on ud.fk_userlogin = ul.user_id
                where ud.jenisdokumen = 'LOGIN'
                and now() <= ud.expired_date AND ud.iddevice = :deviceid
                order by ud.log_id desc
                LIMIT 1;`;

        return models.sequelize
            .query(query, {
                replacements: {
                    deviceid: iddevice
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let jm = payload.length;

                //console.log(jm);

                if(jm > 0)
                {
                    return models.user_devicelog.update({
                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                        update_date: moment(new Date(), "YYYY-MM-DD"),
                        firebasetoken: tokenfirebase || null
                    },{where: {iddevice: iddevice}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {

                            console.log(payload[0].user_id);
                            dataheader =
                                                                        {
                                                                            fk_userlogin: payload[0].user_id,
                                                                            iddevice: iddevice
                                                                        }
                                                                    dataheaderquery = `
                                                                    DELETE from user_devicelog where fk_userlogin = :fk_userlogin
                                                                    and iddevice != :iddevice and jenisdokumen = 'LOGIN'
                                                                    `;

                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.DELETE,
                                                                    }
                                                                    )
                                            .then((userdetail3) => {
                                                return success(req, res, payload, "Login Berhasil.", true);
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Login Expired, Silahkan Login Kembali", false, err);
                    });
                }
                else{
                    return error(req, res, {}, "Anda Belum Login, Silahkan Login", false, '');
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Login Expired, Silahkan Login Kembali", false, err);
            });

    }else{
        let err = '202';
        return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
    }

}

exports.lupaPassword = (req, res) => {

    let { fullname , passLama, passBaru } = req.body;

    if(fullname != null && passLama != null && passBaru != null)
    {
        let query = `select * from user_login where user_fullname = :namefull and user_password = :passwordLama limit 1`;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname,
                    passwordLama: md5(passLama)
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let cont = payload.length;

                if(cont > 0)
                {
                    return models.user_login.update({
                        user_password: md5(passBaru),
                        user_update_date: moment(new Date(), "YYYY-MM-DD")

                    },{where: {user_id: payload[0].user_id}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Password Berhasil Di Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });
                }else{
                    let err= '404';
                    return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
            });
    }

}

exports.lupaPasswordKode = (req, res) => {

    let { fullname , kodeotp, passBaru, iddevice, tokenfirebase } = req.body;

    if(kodeotp == null && passBaru == null)
    {
        let query = `select * from user_login where user_fullname = :namefull limit 1`;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let cont = payload.length;
                let email = '';

                if(cont > 0)
                {

                    email = payload[0].user_email;

                    if(email != null)
                    {

                            return models.user_devicelog.create({
                                jenisdokumen: 'OTPPASSWORD' || null,
                                iddevice: iddevice || null,
                                kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                fk_userlogin: payload[0].user_id || null,
                                expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                firebasetoken: tokenfirebase || null
                            })
                            .then((userdetail2) => {
                                if (userdetail2) {

                                    let kodee = userdetail2.kode_otp;
                                    //console.log(userdetail2.kode_otp);

                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'tolongbeliin0dev@gmail.com',
                                            pass: 'sqzucwjsqjnqfbrq'
                                        }
                                    });

                                    let mailOptions = {
                                        from: 'tolongbeliin0dev@gmail.com',
                                        to: payload[0].user_email,
                                        subject: 'Kode OTP !!! ',
                                        text: 'Anda Melakukan Lupa Password! Your OTP is '+kodee.toString()+''
                                    };

                                    transporter.sendMail(mailOptions, function (errr, info) {
                                        if (errr) {

                                            return error(req, res, {}, "Error Silahkan Cobalagi", true, errr);
                                            //console.log(error);
                                        } else {
                                            return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                            // console.log('Email sent: ' + info.response);
                                        }
                                    });
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
                            });

                    }
                    // return models.user_login.update({
                    //     user_password: md5(passBaru),
                    //     user_update_date: moment(new Date(), "YYYY-MM-DD")

                    // },{where: {user_id: payload[0].user_id}})
                    // .then((userdetail2) => {
                    //     if(userdetail2)
                    //     {
                    //         return success(req, res, payload, "Password Berhasil Di Update", true);
                    //     }
                    // })
                    // .catch((err) => {
                    //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    // });
                }else{
                    let err= '404';
                    return error(req, res, {}, "Nama Store Tidak Ditemukan, Silahkan Cobalagi", false, err);
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Nama Store Tidak Ditemukan , Silahkan Cobalagi", false, err);
            });
    }else if(kodeotp != null && passBaru == null)
    {
        let query = `select * from user_login ul
        left join user_devicelog ud on ud.fk_userlogin = ul.user_id
        where ul.user_fullname = :namefull and ud.jenisdokumen = 'OTPPASSWORD'
        and now() <= ud.expired_date and kode_otp = :otpcode and iddevice = :deviceid
        order by ud.log_id desc
        LIMIT 1;`;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname,
                    deviceid: iddevice,
                    otpcode: parseInt(kodeotp)
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let jml = 0 ;
                jml = payload.length;

                if(jml > 0)
                {
                    return models.user_devicelog.update({
                        is_login: true,
                        firebasetoken: tokenfirebase || null

                    },{where: {log_id: payload[0].log_id}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Kode OTP Berhasil Diverifikasi", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });
                    // return success(req, res, {}, "Kode OTP Berhasil Diverifikasi", true);
                }else{
                    let err='404';
                    return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
            });
    }else if(kodeotp != null && passBaru != null)
    {

        let query = `select * from user_login ul
        left join user_devicelog ud on ud.fk_userlogin = ul.user_id
        where ul.user_fullname = :namefull and ud.jenisdokumen = 'OTPPASSWORD'
        and is_login is true and kode_otp = :otpcode and iddevice = :deviceid
        order by ud.log_id desc
        LIMIT 1`;

        return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname,
                deviceid: iddevice,
                otpcode: parseInt(kodeotp)
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                return models.user_login.update({
                    user_password: md5(passBaru),
                    user_update_date: moment(new Date(), "YYYY-MM-DD")

                },{where: {user_id: payload[0].user_id}})
                .then((userdetail2) => {
                    if(userdetail2)
                    {
                        return success(req, res, payload, "Password Berhasil Di Update", true);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                });
            }else{
                let err = '404';
                return error(req, res, {}, "User Tidak Ditemukan , Silahkan Cobalagi", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "User Tidak Ditemukan , Silahkan Cobalagi", false, err);
        });

    }

}

exports.updateprofile = (req, res) => {

    let { fullname , email, notelp, bank, norek } = req.body;


        let query = `select *,(select id from mref_bank_linkqu where namaBank = :banknama and isActive is true limit 1) as refidlinkqu from user_login where user_fullname = :namefull limit 1`;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname,
                    banknama: bank
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let cont = payload.length;

                if(cont > 0)
                {
                    let filenametoko = 'upload_icon.png';
                                if(req.files.length > 0)
                                {
                                            filenametoko = req.files[0].filename;
                                            return models.user_login.update({
                                                user_email: email,
                                                user_notlp: notelp,
                                                nama_bank: bank,
                                                no_rekening: norek,
                                                user_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/'+filenametoko+'' || null,
                                                user_update_date: moment(new Date(), "YYYY-MM-DD"),
                                                ref_id_linkqu : payload[0].refidlinkqu

                                            },{where: {user_id: payload[0].user_id}})
                                            .then((userdetail2) => {
                                                if(userdetail2)
                                                {
                                                    return success(req, res, payload, "Data Berhasil Di Update", true);
                                                }
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });
                                }else{

                                    return models.user_login.update({
                                        user_email: email,
                                        user_notlp: notelp,
                                        nama_bank: bank,
                                        no_rekening: norek,
                                        user_update_date: moment(new Date(), "YYYY-MM-DD"),
                                        ref_id_linkqu : payload[0].refidlinkqu

                                    },{where: {user_id: payload[0].user_id}})
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {
                                            return success(req, res, payload, "Data Berhasil Di Update", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }




                    //     user_password: md5(passBaru),
                    //     user_update_date: moment(new Date(), "YYYY-MM-DD")

                    // },{where: {user_id: payload[0].user_id}})
                    // .then((userdetail2) => {
                    //     if(userdetail2)
                    //     {
                    //         return success(req, res, payload, "Password Berhasil Di Update", true);
                    //     }
                    // })
                    // .catch((err) => {
                    //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    // });
                }else{
                    let err= '404';
                    return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
            });

}

exports.historyorder = (req, res) => {

    let { fullname } = req.body;

    let query = `select
    th.id_transaction_header as id_transaction_header,
    ul.user_fullname as namacustomer,
    ul.user_notlp as notlpcustomer,
    ph.alamat_toko ,
    ph.coordinate as coordinate_toko,
    ul3.user_notlp as notlp_toko,
    ph.nama_toko as nama_toko,
    th.id_transaction_status as statusid,
    th.ket_transaction_status as statusket,
    th.input_date as tgltransaksimulai,
    th.date_driver_selesai as tgltransaksiselesai,
    case when ph.kategori_id = 1 then (
    select produk_nama from product_makanan pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    )
    when ph.kategori_id = 2 then (
    select produk_nama from product_buahsayur pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 3 then (
    select produk_nama from product_elektronik pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 4 then (
    select produk_nama from product_otomotif pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 5 then (
    select produk_nama from product_pharmacy pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 6 then (
    select produk_nama from product_fashion pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 7 then (
    select produk_nama from product_matrial pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 8 then (
    select produk_nama from product_olahraga pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 9 then (
        select produk_nama from product_ibubayi pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 10 then (
            select produk_nama from product_atk pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 11 then (
                select produk_nama from product_mainananak pm where pm.produk_id =
                (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    end as namaproduk,
    case when ph.kategori_id = 1 then (
        select produk_foto from product_makanan pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
        )
        when ph.kategori_id = 2 then (
        select produk_foto from product_buahsayur pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 3 then (
        select produk_foto from product_elektronik pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 4 then (
        select produk_foto from product_otomotif pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 5 then (
        select produk_foto from product_pharmacy pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 6 then (
        select produk_foto from product_fashion pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 7 then (
        select produk_foto from product_matrial pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 8 then (
            select produk_foto from product_olahraga pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 9 then (
                select produk_foto from product_ibubayi pm where pm.produk_id =
                (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 10 then (
                    select produk_foto from product_atk pm where pm.produk_id =
                    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 11 then (
                        select produk_foto from product_mainananak pm where pm.produk_id =
                        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))

        end as fotoproduk,
    (select count(td.id_transaction_detail) from transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
    as totalpesanan,
    (select amount from transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
    (select td.hargajual_produk from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    as hargajual_produk,
    case when ph.kategori_id = 1 then 'Makanan & Minuman'
    when ph.kategori_id = 2 then 'Buah & Sayur'
    when ph.kategori_id = 3 then 'Elektronik & Cellular'
    when ph.kategori_id = 4 then 'Otomotif'
    when ph.kategori_id = 5 then 'Pharmacy'
    when ph.kategori_id = 6 then 'Fashion & Hobby'
    when ph.kategori_id = 7 then 'Material'
    when ph.kategori_id = 8 then 'Olahraga'
    when ph.kategori_id = 9 then 'Ibu & Bayi'
    when ph.kategori_id = 10 then 'ATK'
    when ph.kategori_id = 11 then 'Mainan & Anak'
    end as namakategori,
    ph.kategori_id,
    case when ph.kategori_id = 1 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/fast-food.png'
    when ph.kategori_id = 2 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/healthy-food.png'
    when ph.kategori_id = 3 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/gadgets.png'
    when ph.kategori_id = 4 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/automotive.png'
    when ph.kategori_id = 5 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/pharmacy.png'
    when ph.kategori_id = 6 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/laundry.png'
    when ph.kategori_id = 7 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/brickwall.png'
    when ph.kategori_id = 8 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/sports.png'
    when ph.kategori_id = 9 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/baby.png'
    when ph.kategori_id = 10 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/stationery.png'
    when ph.kategori_id = 11 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/storage-box.png'
    end as photokategori,
    th.ket_transaction_status as statuspesanann,
    ul2.user_fullname as namadriver,
    th.kode_transaksi as kodetransaksi,
    ul2.user_notlp as notelpdriver,
    th.coordinate_customer,
    th.detail_alamatcustomer,
    th.alamatlengkap_customer
    from transaction_header th
    -- left join transaction_detail td on th.id_transaction_header = td.fk_transaction_header
    left join product_header ph on ph.prod_id = th.id_merchant
    left join user_login ul3 on ul3.user_id = ph.fk_user_id
    left join user_login_customer ul on ul.user_id = th.id_customer
    left join user_login_driver ul2 on ul2.user_id = th.id_driver
    where ul3.user_fullname = :namefull  and th.id_transaction_status >= 5

    `;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                return success(req, res, payload, "History Transaksi Merchant", true);
            }else{

                return success(req, res, {}, "History Transaksi Merchant", true);


            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.inorder = (req, res) => {

    let { fullname } = req.body;

    let query = `select
    th.id_transaction_header as id_transaction_header,
    ul.user_fullname as namacustomer,
    ul.user_notlp as notlpcustomer,
    ph.alamat_toko ,
    ph.coordinate as coordinate_toko,
    ul3.user_notlp as notlp_toko,
    ph.nama_toko as nama_toko,
    th.id_transaction_status as statusid,
    th.ket_transaction_status as statusket,
    th.input_date as tgltransaksimulai,
    th.date_driver_selesai as tgltransaksiselesai,
    case when ph.kategori_id = 1 then (
    select produk_nama from product_makanan pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    )
    when ph.kategori_id = 2 then (
    select produk_nama from product_buahsayur pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 3 then (
    select produk_nama from product_elektronik pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 4 then (
    select produk_nama from product_otomotif pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 5 then (
    select produk_nama from product_pharmacy pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 6 then (
    select produk_nama from product_fashion pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 7 then (
    select produk_nama from product_matrial pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 8 then (
    select produk_nama from product_olahraga pm where pm.produk_id =
    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    when ph.kategori_id = 9 then (
        select produk_nama from product_ibubayi pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 10 then (
            select produk_nama from product_atk pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 11 then (
                select produk_nama from product_mainananak pm where pm.produk_id =
                (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    end as namaproduk,
    case when ph.kategori_id = 1 then (
        select produk_foto from product_makanan pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
        )
        when ph.kategori_id = 2 then (
        select produk_foto from product_buahsayur pm where pm.produk_id =
        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
        when ph.kategori_id = 3 then (
            select produk_foto from product_elektronik pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 4 then (
            select produk_foto from product_otomotif pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 5 then (
            select produk_foto from product_pharmacy pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 6 then (
            select produk_foto from product_fashion pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 7 then (
            select produk_foto from product_matrial pm where pm.produk_id =
            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 8 then (
                select produk_foto from product_olahraga pm where pm.produk_id =
                (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 9 then (
                    select produk_foto from product_ibubayi pm where pm.produk_id =
                    (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 10 then (
                        select produk_foto from product_atk pm where pm.produk_id =
                        (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                        when ph.kategori_id = 11 then (
                            select produk_foto from product_mainananak pm where pm.produk_id =
                            (select td.id_product from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    
            end as fotoproduk,
        (select count(td.id_transaction_detail) from transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
        as totalpesanan,
        (select amount from transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
        (select td.hargajual_produk from transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
        as hargajual_produk,
        case when ph.kategori_id = 1 then 'Makanan & Minuman'
        when ph.kategori_id = 2 then 'Buah & Sayur'
        when ph.kategori_id = 3 then 'Elektronik & Cellular'
        when ph.kategori_id = 4 then 'Otomotif'
        when ph.kategori_id = 5 then 'Pharmacy'
        when ph.kategori_id = 6 then 'Fashion & Hobby'
        when ph.kategori_id = 7 then 'Material'
        when ph.kategori_id = 8 then 'Olahraga'
        when ph.kategori_id = 9 then 'Ibu & Bayi'
        when ph.kategori_id = 10 then 'ATK'
        when ph.kategori_id = 11 then 'Mainan & Anak'
        end as namakategori,
        ph.kategori_id,
        case when ph.kategori_id = 1 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/fast-food.png'
        when ph.kategori_id = 2 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/healthy-food.png'
        when ph.kategori_id = 3 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/gadgets.png'
        when ph.kategori_id = 4 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/automotive.png'
        when ph.kategori_id = 5 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/pharmacy.png'
        when ph.kategori_id = 6 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/laundry.png'
        when ph.kategori_id = 7 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/brickwall.png'
        when ph.kategori_id = 8 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/sports.png'
        when ph.kategori_id = 9 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/baby.png'
        when ph.kategori_id = 10 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/stationery.png'
        when ph.kategori_id = 11 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/storage-box.png'
        end as photokategori,
        th.ket_transaction_status as statuspesanann,
        ul2.user_fullname as namadriver,
        th.kode_transaksi as kodetransaksi,
        ul2.user_notlp as notelpdriver,
        th.coordinate_customer,
        th.detail_alamatcustomer,
        th.alamatlengkap_customer
        from transaction_header th
        -- left join transaction_detail td on th.id_transaction_header = td.fk_transaction_header
        left join product_header ph on ph.prod_id = th.id_merchant
        left join user_login ul3 on ul3.user_id = ph.fk_user_id
        left join user_login_customer ul on ul.user_id = th.id_customer
        left join user_login_driver ul2 on ul2.user_id = th.id_driver
    where ul3.user_fullname = :namefull and th.id_transaction_status in (0,1,2,3,4)

    `;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                return success(req, res, payload, "History Transaksi Merchant", true);

            }else{

                return success(req, res, {}, "History Transaksi Merchant", true);


            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.logout = (req, res) => {
    let { fullname , iddevice} = req.body;


    let query = `select ul.*, ud.log_id from user_login ul
    left join user_devicelog ud on ud.fk_userlogin = ul.user_id
    where ul.user_fullname = :namefull and iddevice = :iddevice limit 1`;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname,
                iddevice: iddevice
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {

                return models.user_devicelog.destroy({where: {log_id: payload[0].log_id}})
                .then((userdetail2) => {
                    if(userdetail2)
                    {
                        return success(req, res, payload, "Data Berhasil Di Update", true);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                });


                //     user_password: md5(passBaru),
                //     user_update_date: moment(new Date(), "YYYY-MM-DD")
                
                // },{where: {user_id: payload[0].user_id}})
                // .then((userdetail2) => {
                //     if(userdetail2)
                //     {
                //         return success(req, res, payload, "Password Berhasil Di Update", true);
                //     }
                // })
                // .catch((err) => {
                //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                // });
            }else{
                let err= '404';
                return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Password Lama Salah , Silahkan Cobalagi", false, err);
        });
}


exports.caridriver = (req, res) => {

    let { fullname , type, iddriver, idtransaksi} = req.body;

    const delayExecution = (ms) => {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                let cekquerybayar = `select type_kode from transaction_header th 
                left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                left join mref_bank_linkqu mb on mb.id = tp.ref_id_bayar
                where th.id_transaction_header = :idtransaksi`;

                return models.sequelize
                    .query(cekquerybayar, {
                        replacements: {
                            idtransaksi: parseInt(idtransaksi)
                        },
                        type: QueryTypes.SELECT,
                    })
                    .then((payload2) => {

                        let cont2 = payload2.length;

                        if(cont2 > 0)
                        {
                            let typekode = payload2[0].type_kode;
                            let query = ``;

                            if(typekode == "cash")
                            {
                                query = `select th.* from transaction_header th
                                left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                where th.id_transaction_header = :idtransaksi `;
                            }else{

                                query = `select th.* from transaction_header th
                                left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS' `;

                            }

                            

                            return models.sequelize
                                .query(query, {
                                    replacements: {
                                        idtransaksi: parseInt(idtransaksi)
                                    },
                                    type: QueryTypes.SELECT,
                                })
                                .then((payload) => {
                                    let cont = payload.length;

                                    if(cont > 0)
                                    {

                                        if(type == "1")
                                        {

                                            //var cekdriver = 0;
                                            var jarak = 10;

                                            // while (cekdriver == 0) {
                                                // do nothing
                                                let query5 = ``;

                                                if(typekode == "cash")
                                                {
                                                    query5 = `select data.*,
                                                        case when data.kategori_id = 1 then (
                                                            select produk_nama from product_makanan pm where pm.produk_id =
                                                            data.id_product
                                                            )
                                                            when data.kategori_id = 2 then (
                                                            select produk_nama from product_buahsayur pm where pm.produk_id =
                                                            data.id_product
                                                            )
                                                            when data.kategori_id = 3 then (
                                                            select produk_nama from product_elektronik pm where pm.produk_id =
                                                            data.id_product)
                                                            when data.kategori_id = 4 then (
                                                                select produk_nama from product_otomotif pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 5 then (
                                                                select produk_nama from product_pharmacy pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 6 then (
                                                                select produk_nama from product_fashion pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 7 then (
                                                                select produk_nama from product_matrial pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 8 then (
                                                                select produk_nama from product_olahraga pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 9 then (
                                                                select produk_nama from product_ibubayi pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 10 then (
                                                                select produk_nama from product_atk pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 11 then (
                                                                select produk_nama from product_mainananak pm where pm.produk_id =
                                                                data.id_product)
                                                                end as namaproduk,
                                                                case when data.kategori_id = 1 then (
                                                                    select produk_foto from product_makanan pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 2 then (
                                                                    select produk_foto from product_buahsayur pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 3 then (
                                                                    select produk_foto from product_elektronik pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 4 then (
                                                                    select produk_foto from product_otomotif pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 5 then (
                                                                    select produk_foto from product_pharmacy pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 6 then (
                                                                    select produk_foto from product_fashion pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 7 then (
                                                                    select produk_foto from product_matrial pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 8 then (
                                                                    select produk_foto from product_olahraga pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 9 then (
                                                                    select produk_foto from product_ibubayi pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 10 then (
                                                                    select produk_foto from product_atk pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 11 then (
                                                                    select produk_foto from product_mainananak pm where pm.produk_id =
                                                                    data.id_product)
                                                                    end as fotoproduk
                                                            from (
                                                            select th.*,
                                                                td.id_product,
                                                                ph.kategori_id,
                                                                td.jumlah,
                                                                td.totalharga_produk,
                                                                td.hargajual_produk,
                                                                ph.kategori_nama,
                                                                ph.nama_toko,
                                                                cp.*
                                                            from transaction_detail td
                                                            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                                            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                                            left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                                            left join product_header ph on ph.prod_id = th.id_merchant
                                                            where th.id_transaction_header = :idtransaksi
                                                            and th.input_datedriver is not null
                                                            ) data


                                                                                        `;
                                                }else{

                                                    query5 = `select data.*,
                                                        case when data.kategori_id = 1 then (
                                                            select produk_nama from product_makanan pm where pm.produk_id =
                                                            data.id_product
                                                            )
                                                            when data.kategori_id = 2 then (
                                                            select produk_nama from product_buahsayur pm where pm.produk_id =
                                                            data.id_product
                                                            )
                                                            when data.kategori_id = 3 then (
                                                            select produk_nama from product_elektronik pm where pm.produk_id =
                                                            data.id_product)
                                                            when data.kategori_id = 4 then (
                                                                select produk_nama from product_otomotif pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 5 then (
                                                                select produk_nama from product_pharmacy pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 6 then (
                                                                select produk_nama from product_fashion pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 7 then (
                                                                select produk_nama from product_matrial pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 8 then (
                                                                select produk_nama from product_olahraga pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 9 then (
                                                                select produk_nama from product_ibubayi pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 10 then (
                                                                select produk_nama from product_atk pm where pm.produk_id =
                                                                data.id_product)
                                                                when data.kategori_id = 11 then (
                                                                select produk_nama from product_mainananak pm where pm.produk_id =
                                                                data.id_product)
                                                                end as namaproduk,
                                                                case when data.kategori_id = 1 then (
                                                                    select produk_foto from product_makanan pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 2 then (
                                                                    select produk_foto from product_buahsayur pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 3 then (
                                                                    select produk_foto from product_elektronik pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 4 then (
                                                                    select produk_foto from product_otomotif pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 5 then (
                                                                    select produk_foto from product_pharmacy pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 6 then (
                                                                    select produk_foto from product_fashion pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 7 then (
                                                                    select produk_foto from product_matrial pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 8 then (
                                                                    select produk_foto from product_olahraga pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 9 then (
                                                                    select produk_foto from product_ibubayi pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 10 then (
                                                                    select produk_foto from product_atk pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 11 then (
                                                                    select produk_foto from product_mainananak pm where pm.produk_id =
                                                                    data.id_product)
                                                                    end as fotoproduk
                                                            from (
                                                            select th.*,
                                                                td.id_product,
                                                                ph.kategori_id,
                                                                td.jumlah,
                                                                td.totalharga_produk,
                                                                td.hargajual_produk,
                                                                ph.kategori_nama,
                                                                ph.nama_toko,
                                                                cp.*
                                                            from transaction_detail td
                                                            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                                            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                                            left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                                            left join product_header ph on ph.prod_id = th.id_merchant
                                                            where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                            and th.input_datedriver is not null
                                                            ) data


                                                                                        `;

                                                }

                                                

                                                    return models.sequelize
                                                        .query(query5, {
                                                            replacements: {
                                                                idtransaksi: parseInt(idtransaksi)
                                                            },
                                                            type: QueryTypes.SELECT,
                                                        })
                                                        .then((payload5) => {
                                                            let cont5 = payload5.length;
                                                            let query2 = ``;

                                                            if(cont5 == 0)
                                                            {
                                                                if(typekode == "cash")
                                                                {

                                                                    query2 = `select data.*,udl.*, udl.fk_userlogin as driverambill,
                                                                case when data.kategori_id = 1 then (
                                                                    select produk_nama from product_makanan pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 2 then (
                                                                    select produk_nama from product_buahsayur pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 3 then (
                                                                    select produk_nama from product_elektronik pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 4 then (
                                                                    select produk_nama from product_otomotif pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 5 then (
                                                                    select produk_nama from product_pharmacy pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 6 then (
                                                                    select produk_nama from product_fashion pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 7 then (
                                                                    select produk_nama from product_matrial pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 8 then (
                                                                    select produk_nama from product_olahraga pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 9 then (
                                                                    select produk_nama from product_ibubayi pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 10 then (
                                                                    select produk_nama from product_atk pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 11 then (
                                                                    select produk_nama from product_mainananak pm where pm.produk_id =
                                                                    data.id_product)
                                                                    end as namaproduk,
                                                                    case when data.kategori_id = 1 then (
                                                                        select produk_foto from product_makanan pm where pm.produk_id =
                                                                        data.id_product
                                                                        )
                                                                        when data.kategori_id = 2 then (
                                                                        select produk_foto from product_buahsayur pm where pm.produk_id =
                                                                        data.id_product)
                                                                        when data.kategori_id = 3 then (
                                                                        select produk_foto from product_elektronik pm where pm.produk_id =
                                                                        data.id_product)
                                                                        when data.kategori_id = 4 then (
                                                                        select produk_foto from product_otomotif pm where pm.produk_id =
                                                                        data.id_product)
                                                                                            when data.kategori_id = 5 then (
                                                                                            select produk_foto from product_pharmacy pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 6 then (
                                                                                            select produk_foto from product_fashion pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 7 then (
                                                                                            select produk_foto from product_matrial pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 8 then (
                                                                                            select produk_foto from product_olahraga pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 9 then (
                                                                                            select produk_foto from product_ibubayi pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 10 then (
                                                                                            select produk_foto from product_atk pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 11 then (
                                                                                            select produk_foto from product_mainananak pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            end as fotoproduk
                                                                                    from (
                                                                                    select th.*,
                                                                                    (
                                                                                    select
                                                                                    ud.log_id
                                                                                    from user_devicelog_driver ud
                                                                                    left join user_login_driver ul on ul.user_id = ud.fk_userlogin
                                                                                    where ud.status_aktif = 1 and ud.jenisdokumen = 'LOGIN'
                                                                                    and ROUND(6373 * acos (cos ( radians(ST_X(ph.coordinate)) ) * cos( radians( ST_X(coordinate_alamat) ) ) *
                                                                                        cos( radians( ST_Y(coordinate_alamat) ) - radians(ST_Y(ph.coordinate)) ) + sin ( radians(ST_X(ph.coordinate)) ) *
                                                                                        sin( radians( ST_X(coordinate_alamat) ) ))) <= 10
                                                                                        and ud.fk_userlogin != case when th.id_driver is null then 0 else th.id_driver end
                                                                                        and ul.jenis_driver = 1 and DATE_FORMAT(ud.update_date, '%d-%m-%Y')
                                                                                        = DATE_FORMAT(now(), '%d-%m-%Y')
                                                                                        limit 1 ) log_id,
                                                                                        td.id_product,
                                                                                        ph.kategori_id,
                                                                                        td.jumlah,
                                                                                        td.totalharga_produk,
                                                                                        td.hargajual_produk,
                                                                                        ph.kategori_nama,
                                                                                        ph.nama_toko
                                                                                    from transaction_detail td
                                                                                    left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                                                                                            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                                                                                            left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                                                                                            left join product_header ph on ph.prod_id = th.id_merchant
                                                                                                            where th.id_transaction_header = :idtransaksi
                                                                                                            and th.input_datedriver is null
                                                                                                            ) data
                                                                                                            left join user_devicelog_driver udl on udl.log_id = data.log_id

                                                                                                                `;

                                                                }else{

                                                                    query2 = `select data.*,udl.*, udl.fk_userlogin as driverambill,
                                                                case when data.kategori_id = 1 then (
                                                                    select produk_nama from product_makanan pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 2 then (
                                                                    select produk_nama from product_buahsayur pm where pm.produk_id =
                                                                    data.id_product
                                                                    )
                                                                    when data.kategori_id = 3 then (
                                                                    select produk_nama from product_elektronik pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 4 then (
                                                                    select produk_nama from product_otomotif pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 5 then (
                                                                    select produk_nama from product_pharmacy pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 6 then (
                                                                    select produk_nama from product_fashion pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 7 then (
                                                                    select produk_nama from product_matrial pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 8 then (
                                                                    select produk_nama from product_olahraga pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 9 then (
                                                                    select produk_nama from product_ibubayi pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 10 then (
                                                                    select produk_nama from product_atk pm where pm.produk_id =
                                                                    data.id_product)
                                                                    when data.kategori_id = 11 then (
                                                                    select produk_nama from product_mainananak pm where pm.produk_id =
                                                                    data.id_product)
                                                                    end as namaproduk,
                                                                    case when data.kategori_id = 1 then (
                                                                        select produk_foto from product_makanan pm where pm.produk_id =
                                                                        data.id_product
                                                                        )
                                                                        when data.kategori_id = 2 then (
                                                                        select produk_foto from product_buahsayur pm where pm.produk_id =
                                                                        data.id_product)
                                                                        when data.kategori_id = 3 then (
                                                                        select produk_foto from product_elektronik pm where pm.produk_id =
                                                                        data.id_product)
                                                                        when data.kategori_id = 4 then (
                                                                        select produk_foto from product_otomotif pm where pm.produk_id =
                                                                        data.id_product)
                                                                                            when data.kategori_id = 5 then (
                                                                                            select produk_foto from product_pharmacy pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 6 then (
                                                                                            select produk_foto from product_fashion pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 7 then (
                                                                                            select produk_foto from product_matrial pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 8 then (
                                                                                            select produk_foto from product_olahraga pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 9 then (
                                                                                            select produk_foto from product_ibubayi pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 10 then (
                                                                                            select produk_foto from product_atk pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            when data.kategori_id = 11 then (
                                                                                            select produk_foto from product_mainananak pm where pm.produk_id =
                                                                                            data.id_product)
                                                                                            end as fotoproduk
                                                                                    from (
                                                                                    select th.*,
                                                                                    (
                                                                                    select
                                                                                    ud.log_id
                                                                                    from user_devicelog_driver ud
                                                                                    left join user_login_driver ul on ul.user_id = ud.fk_userlogin
                                                                                    where ud.status_aktif = 1 and ud.jenisdokumen = 'LOGIN'
                                                                                    and ROUND(6373 * acos (cos ( radians(ST_X(ph.coordinate)) ) * cos( radians( ST_X(coordinate_alamat) ) ) *
                                                                                        cos( radians( ST_Y(coordinate_alamat) ) - radians(ST_Y(ph.coordinate)) ) + sin ( radians(ST_X(ph.coordinate)) ) *
                                                                                        sin( radians( ST_X(coordinate_alamat) ) ))) <= 10
                                                                                        and ud.fk_userlogin != case when th.id_driver is null then 0 else th.id_driver end
                                                                                        and ul.jenis_driver = 1 and DATE_FORMAT(ud.update_date, '%d-%m-%Y')
                                                                                        = DATE_FORMAT(now(), '%d-%m-%Y')
                                                                                        limit 1 ) log_id,
                                                                                        td.id_product,
                                                                                        ph.kategori_id,
                                                                                        td.jumlah,
                                                                                        td.totalharga_produk,
                                                                                        td.hargajual_produk,
                                                                                        ph.kategori_nama,
                                                                                        ph.nama_toko
                                                                                    from transaction_detail td
                                                                                    left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                                                                                            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                                                                                            left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                                                                                            left join product_header ph on ph.prod_id = th.id_merchant
                                                                                                            where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                                                                            and th.input_datedriver is null
                                                                                                            ) data
                                                                                                            left join user_devicelog_driver udl on udl.log_id = data.log_id

                                                                                                                `;

                                                                }
                                                                 

                                                return models.sequelize
                                                    .query(query2, {
                                                        replacements: {
                                                            idtransaksi: parseInt(idtransaksi)
                                                        },
                                                        type: QueryTypes.SELECT,
                                                    })
                                                    .then((payload2) => {
                                                        let cont = payload2.length;

                                                        if(cont > 0)
                                                        {
                                                            //console.log(payload2[0].driverambill);
                                                            if(payload2[0].driverambill == null)
                                                            {

                                                                resolve('0');

                                                            }else{

                                                                console.log(payload2[0].driverambill);

                                                                return models.transaction_header.update({
                                                                    id_transaction_status: 1,
                                                                    ket_transaction_status: 'Sedang Mencari Driver',
                                                                    kode_transaksi: Math.floor(100000 + Math.random() * 900000),
                                                                    date_merchant_konfirmasi: moment(new Date(), "YYYY-MM-DD"),
                                                                    id_driver: payload2[0].driverambill,
                                                                },{where: {id_transaction_header: idtransaksi}})
                                                                .then((userdetail2) => {

                                                                    //if(payload2[0].firebasetoken != null)
                                                                    console.log(payload2.length);
                                                                    const datar = [];
                                                                    for(t=0; t <= (payload2.length - 1); t++)
                                                                            {
                                                                                datar.push({
                                                                                    "nama_produk": payload2[t].namaproduk,
                                                                                    "harga_produk": payload2[t].totalharga_produk,
                                                                                    "photo_link": payload2[t].photoproduk,
                                                                                    "categori": payload2[t].kategori_nama,
                                                                                    "jumlah": payload2[t].jumlah,
                                                                                    "idtransaksi": payload2[t].id_transaction_header
                                                                                }
                                                                                );
                                                                            }

                                                                            console.log(datar);
                                                                    const axios = require('axios');
                                                                    let data = JSON.stringify({
                                                                    "to": ""+payload2[0].firebasetoken+"",
                                                                    "notification": {
                                                                        "body": "Orderan Baru Masuk",
                                                                        "title": "Orderan Baru Masuk",
                                                                        "subtitle": "Orderan Baru Masuk"
                                                                    },
                                                                    "data": {
                                                                        "nama_toko": payload2[0].nama_toko,
                                                                        "data_produk": datar
                                                                    }
                                                                    });

                                                                    let config = {
                                                                    method: 'post',
                                                                    maxBodyLength: Infinity,
                                                                    url: 'https://fcm.googleapis.com/fcm/send',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'Authorization': 'key=AAAAgSEq70U:APA91bH0Tcle3e1LgvOL8tED8lZEfjTcL3nth24TmaY1pV8gK0eyf-v48_gpvCzTM9uHSGzod7QIOEoPVWhvIWZ6G4af7ttqbKhRimnTuIhE4ZtjiCf7g6H-_C1jBzb4VQWfkbsHGXil'
                                                                    },
                                                                    data : data
                                                                    };

                                                                    axios.request(config)
                                                                    .then((response) => {
                                                                        console.log(JSON.stringify(response.data));
                                                                        resolve('0');

                                                                    })
                                                                    .catch((error) => {
                                                                        resolve('0');
                                                                    });
                                                                })
                                                                .catch((err) => {
                                                                    resolve('0');
                                                                    // return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                });

                                                            }

                                                            //setTimeout(() => {

                                                            //}, 300000);



                                                        }else{

                                                            resolve('1');

                                                        }
                                                    })
                                                    .catch((err) => {

                                                        resolve('0');

                                                    });

                                                                                }else{

                                                                                    resolve('1');

                                                                                }

                                                                            })
                                                                            .catch((err) => {

                                                                                resolve('0');

                                                                            });





                                            // }




                                        }else if(type == "2")
                                        {

                                            return models.transaction_header.update({
                                                id_transaction_status: 2,
                                                ket_transaction_status: 'Driver Sedang Menuju Merchant',
                                                kode_transaksi: Math.floor(100000 + Math.random() * 900000),
                                                date_merchant_konfirmasi: moment(new Date(), "YYYY-MM-DD"),
                                                input_datedriver: moment(new Date(), "YYYY-MM-DD"),
                                                id_driver: iddriver,
                                            },{where: {id_transaction_header: idtransaksi}})
                                            .then((userdetail2) => {
                                                if(userdetail2)
                                                {
                                                    resolve('1');
                                                }
                                            })
                                            .catch((err) => {
                                                resolve('0');
                                                //return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                        }
                                    }else{

                                        resolve('1');

                                    }
                                })
                                .catch((err) => {
                                    resolve('0');
                                });

                        }

                    })
                    .catch((err) => {
                        resolve('0');
                    });

                

            }, ms)
        })
    }

    const showIDs = async () => {

        let counter = 1
        let status = 0;

        while (counter <= 5) {
            if(counter == 1)
            {
                await delayExecution(1000)
                .then( (result) =>
                    {
                        console.log(result);
                        if(result == '1')
                        {
                            counter = 6;
                            status = 1;
                        }else{
                            counter++
                            status = 1;
                        }

                    }
                )
                .catch(
                    (error) => {
                        counter = 6;
                        status = 0;
                    }
                )

            }else{

                await delayExecution(10000)
                    .then( (result) =>
                        {
                            console.log(result);
                            if(result == '1')
                            {
                                counter = 6;
                                status = 1;
                            }else{
                                counter++
                                status = 1;
                            }

                        }
                    )
                    .catch(
                        (error) => {
                            counter = 6;
                            status = 0;
                        }
                    )

            }
            //console.log(`post id ${counter}`)

        }

        if(status == 1)
        {
            let query3 = `select data.*,
            case when data.kategori_id = 1 then (
                select produk_nama from product_makanan pm where pm.produk_id =
                data.id_product
                )
                when data.kategori_id = 2 then (
                select produk_nama from product_buahsayur pm where pm.produk_id =
                data.id_product
                )
                when data.kategori_id = 3 then (
                select produk_nama from product_elektronik pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 4 then (
                select produk_nama from product_otomotif pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 5 then (
                select produk_nama from product_pharmacy pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 6 then (
                select produk_nama from product_fashion pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 7 then (
                select produk_nama from product_matrial pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 8 then (
                select produk_nama from product_olahraga pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 9 then (
                select produk_nama from product_ibubayi pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 10 then (
                select produk_nama from product_atk pm where pm.produk_id =
                data.id_product)
                when data.kategori_id = 11 then (
                select produk_nama from product_mainananak pm where pm.produk_id =
                data.id_product)
                end as namaproduk,
                case when data.kategori_id = 1 then (
                    select produk_foto from product_makanan pm where pm.produk_id =
                    data.id_product
                    )
                    when data.kategori_id = 2 then (
                    select produk_foto from product_buahsayur pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 3 then (
                    select produk_foto from product_elektronik pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 4 then (
                    select produk_foto from product_otomotif pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 5 then (
                    select produk_foto from product_pharmacy pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 6 then (
                    select produk_foto from product_fashion pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 7 then (
                    select produk_foto from product_matrial pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 8 then (
                    select produk_foto from product_olahraga pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 9 then (
                    select produk_foto from product_ibubayi pm where pm.produk_id =
                    data.id_product)
                    when data.kategori_id = 10 then (
                        select produk_foto from product_atk pm where pm.produk_id =
                        data.id_product)
                        when data.kategori_id = 11 then (
                        select produk_foto from product_mainananak pm where pm.produk_id =
                        data.id_product)
                        end as fotoproduk
                from (
                select th.*,
                    td.id_product,
                    ph.kategori_id,
                    td.jumlah,
                    td.totalharga_produk,
                    td.hargajual_produk,
                    ph.kategori_nama,
                    ph.nama_toko,
                    cp.*
                from transaction_detail td
                left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                        left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                        left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                        left join product_header ph on ph.prod_id = th.id_merchant
                                        where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                        and th.id_driver is not null
                                        ) data
    
    
                                                                    `;
    
                                        return models.sequelize
                                            .query(query3, {
                                                replacements: {
                                                    idtransaksi: parseInt(idtransaksi)
                                                },
                                                type: QueryTypes.SELECT,
                                            })
                                            .then((payload2) => {
                                                let cont = payload2.length;
    
                                                if(cont > 0)
                                                {
                                                    if(payload2[0].driverambill == null)
                                                    {
    
                                                        return error(req, res, {}, "Driver Tidak Ditemukan, Cari Kembali", false, err);
    
    
                                                    }else{
    
                                                        return success(req, res, {}, "History Transaksi Merchant", true);
    
                                                    }
    
                                                }else{
    
                                                    return error(req, res, {}, "Driver Tidak Ditemukan, Cari Kembali", false, err);
    
                                                }
    
                                            })
                                            .catch((err) => {
    
                                                return error(req, res, {}, "Driver Tidak Ditemukan, Cari Kembali", false, err);
    
                                            });
    
    
    
            }else{
                return error(req, res, {}, "Driver Tidak Ditemukan, Cari Kembali", false, err);
            }
        }

        showIDs();
    
}

exports.historywithdraw = (req,res) => {

    let { fullname , tokenfirebase} = req.body;


    let query = `select ull.*,tw.*,
    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
            (
            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
            (
            select 
            sum(totalharga_produk) as jumlah1
            from transaction_detail td 
            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
            where th.id_merchant in 
            (
            select phh.prod_id from product_header phh 
            left join user_login ul on ul.user_id = phh.fk_user_id
            left join user_devicelog ud on ud.fk_userlogin = phh.fk_user_id
            where ud.is_login is true 
            and ud.firebasetoken = udd.firebasetoken
            ) and th.id_transaction_status = 5
            ) as data1 join (
            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
            where tw.fk_user_merchant = 
            (
            select ul.user_id from user_login ul 
            left join user_devicelog ud on ud.fk_userlogin = ul.user_id
            where ud.is_login is true 
            and ud.firebasetoken = udd.firebasetoken
            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
            ) as data2
            ) as data3) as saldoterkini
            from user_login ull 
    left join user_devicelog udd on udd.fk_userlogin = ull.user_id
    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
    where udd.is_login is true 
    and udd.firebasetoken = :token
    `;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname,
                token: tokenfirebase
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                for(e=0; e <= (payload.length - 1); e++)
                            {
                                let prref = '';
                                let lineidd = 0;

                                prref = payload[e]['partner_ref'];
                                lineidd = payload[e]['lineid'];

                                if(payload[e]['status'] == 1)
                                {
                                    // console.log(prref);
                                    const axios = require('axios');

                                    // let partnerreff = '';

                                    // partnerreff = 

                                    let config = {
                                    method: 'get',
                                    maxBodyLength: Infinity,
                                    url: 'https://gateway.linkqu.id/linkqu-partner/transaction/payment/checkstatus?username=LI9948NTV&partnerreff='+prref+'',
                                    headers: { 
                                        'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0', 
                                        'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN'
                                    }
                                    };

                                    axios.request(config)
                                    .then((response) => {
                                        console.log(response.data.rc);
                                        let statuss = 1;
                                        let ketstatuss = '';
                                        if(response.data.rc == "00")
                                        {
                                            statuss = 2;
                                            ketstatuss = ''+payload[e]['tipedokumen'].toUpperCase()+' BERHASIL';

                                        }else{
                                            statuss = 3;
                                            ketstatuss = 'PEMBAYARAN ANDA GAGAL';
                                        }

                                        models.transaction_withdraw.update({
                                            status: statuss,
                                            status_ket: ketstatuss,
                                            tanggal_update: moment(new Date(), "YYYY-MM-DD")
    
                                        },{where: {lineid: lineidd}})
                                        .then((userdetail2) => {
                                            
                                        })
                                        .catch((err) => {
                                            // return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                        });
                                        // return success(req, res, response.data, "Sukses", true);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                                }

                                
                            }
                return success(req, res, payload, "Data Ditemukan", true);
            }else{
                let err= '404';
                return error(req, res, {}, "Data Tidak Ditemukan", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Data Tidak Ditemukan", false, err);
        });
}

exports.proseswithdraw = (req,res) => {

    let { fullname , tokenfirebase, jumlahpenarikan} = req.body;

    let query = `select 
    ull.* ,
    (
    select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
      (
      select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
      case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
      (
      select 
      sum(totalharga_produk) as jumlah1
      from transaction_detail td 
      left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
      where th.id_merchant in 
      (
      select phh.prod_id from product_header phh 
      left join user_login ul on ul.user_id = phh.fk_user_id
      left join user_devicelog ud on ud.fk_userlogin = phh.fk_user_id
      where ud.is_login is true 
      and ud.firebasetoken = udd.firebasetoken
      ) and th.id_transaction_status = 5
      ) as data1 join (
      select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
      where tw.fk_user_merchant = 
      (
      select ul.user_id from user_login ul 
      left join user_devicelog ud on ud.fk_userlogin = ul.user_id
      where ud.is_login is true 
      and ud.firebasetoken = udd.firebasetoken
      ) and tw.tipedokumen = 'penarikan' and tw.status in (2)
      ) as data2
      ) as data3
    ) as jumlahsaldo,
    bmk.kodeBank as kodebank,
    bmk.id as refidlinkqu 
    from user_login ull 
  left join user_devicelog udd on udd.fk_userlogin = ull.user_id
  left join mref_bank_linkqu bmk on bmk.id = ull.ref_id_linkqu
  where udd.is_login is true 
  and udd.firebasetoken = :token
  
    `;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname,
                token: tokenfirebase
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                if(parseFloat(payload[0].jumlahsaldo) > (parseFloat(jumlahpenarikan) + 2500))
                {
                    // const idmerchant = payload[0].user_id;
                    // const kodebank = payload[0].nama_bank;
                    // const accountno = payload[0].no_rekening;

                    // return models.transaction_withdraw.create({

                    //     tanggal : moment(new Date(), "YYYY-MM-DD"),
                    //     fk_user_merchant: idmerchant || null, 
                    //     tipedokumen: 'penarikan', 
                    //     jumlahuang: parseFloat(jumlahpenarikan) || null, 
                    //     status : 1, 
                    //     status_ket: 'Permintaan Penarikan', 
                    //     fullname: fullname, 
                    //     bankcode: kodebank || null, 
                    //     accountnumber: accountno || null, 
                    //     partner_ref: 'penarikan-'+jumlahpenarikan+'-'+fullname+'-'+(Math.floor(100000 + Math.random() * 900000)).toString()+''
                    //     })
                    //     .then((userdetail) => {
                    //         if (userdetail) {
                    //             return success(req, res, payload, "Sukses Melakukan Permintaan Penarikan, Kami akan segera transfer ke Rekening Anda", true);
			        //         }
                    //         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                    //     })
                    //     .catch((err) => {
                    //         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    //     });

                    // return success(req, res, cont, "Sukses Melakukan Penarikan, Kami akan segera transfer ke Rekening Anda", true);
                    const idmerchant = payload[0].user_id;
                    const kodebank = payload[0].nama_bank;
                    const accountno = payload[0].no_rekening;
                    const idreflinkqu = payload[0].refidlinkqu;
                    const bankkode = payload[0].kodebank;
                    const randno = Math.floor(100000 + Math.random() * 900000);

                    const axios = require('axios');

                    let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'https://gateway.linkqu.id/linkqu-partner/akun/resume?username=LI9948NTV',
                    headers: { 
                        'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0', 
                        'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN'
                    }
                    };

                    axios.request(config)
                    .then((response) => {
                    // console.log(JSON.stringify(response.data));
                        let balance = 0;

                        balance = response.data.data.balance;

                        if(balance > parseFloat(jumlahpenarikan))
                        {
                            const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
                            const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";
                            const path = "/transaction/withdraw/inquiry";
                            const method = "POST";
                            var partner_reff = 'penarikan-'+jumlahpenarikan+'-'+fullname+'-'+randno.toString()+'';
                            var string1 = jumlahpenarikan+accountno+bankkode+partner_reff.replace(/\s/g,"")+clien_id;
                                    var secondvalue2 = string1.replace(/[^0-9a-zA-Z]/g, "");
                                    var secondvalue = secondvalue2.toLowerCase();

                            var signToString = path+method+secondvalue;
                                    
                                    console.log(secondvalue2);
                                    console.log(string1);
                                    var signature = crypto.createHmac('sha256', serverKey)

                                    // updating data
                                    .update(signToString)

                                    // Encoding to be used
                                    .digest('hex');

                                    console.log("INPUT: " , signToString +" \n");
                                    console.log("SIGNATURE: " , signature);
                                    const axios = require('axios');
                                    let data = JSON.stringify({
                                    "username": "LI9948NTV",
                                    "pin": "JQoDvZNvd57C1l5",
                                    "bankcode": bankkode,
                                    "accountnumber": accountno.toString(),
                                    "amount": jumlahpenarikan,
                                    "partner_reff": partner_reff,
                                    "sendername": "PT. Tolong Beliin",
                                    "category": "04",
                                    "customeridentity": accountno.toString(),
                                    "signature": signature
                                    });

                                    let config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: 'https://gateway.linkqu.id/linkqu-partner/transaction/withdraw/inquiry',
                                    headers: { 
                                        'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0', 
                                        'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN', 
                                        'Content-Type': 'application/json'
                                    },
                                    data : data
                                    };

                                    axios.request(config)
                                    .then((response) => {
                                        console.log(JSON.stringify(response.data));
                                        let inquiryreff = response.data.inquiry_reff;
                                        if(inquiryreff != "")
                                        {

                                                var string4 = jumlahpenarikan+accountno+bankkode+partner_reff.replace(/\s/g,"")+inquiryreff+clien_id;
                                                var secondvalue5 = string4.replace(/[^0-9a-zA-Z]/g, "");
                                                var secondvalue6 = secondvalue5.toLowerCase();

                                                var signToString2 = '/transaction/withdraw/payment'+method+secondvalue6;
                                                
                                                console.log(secondvalue6);
                                                console.log(string4);
                                                var signature3 = crypto.createHmac('sha256', serverKey)

                                                // updating data
                                                .update(signToString2)

                                                // Encoding to be used
                                                .digest('hex');

                                                console.log("INPUT: " , signToString2 +" \n");
                                                console.log("SIGNATURE: " , signature3);

                                                const axios = require('axios');
                                                let data = JSON.stringify({
                                                // "username": "LI307GXIN",
                                                // "pin": "2K2NPCBBNNTovgB",
                                                // "bankcode": "014",
                                                // "accountnumber": "12454691",
                                                // "amount": 20000,
                                                // "partner_reff": "20211223124530",
                                                "username": "LI9948NTV",
                                                "pin": "JQoDvZNvd57C1l5",
                                                "bankcode": bankkode,
                                                "accountnumber": accountno.toString(),
                                                "amount": jumlahpenarikan,
                                                "partner_reff": partner_reff,
                                                "inquiry_reff": inquiryreff,
                                                "remark": "Pembayaran Driver PT Tolong. Beliin",
                                                "signature": signature3
                                                });

                                                let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://gateway.linkqu.id/linkqu-partner/transaction/withdraw/payment',
                                                headers: { 
                                                    'Content-Type': 'application/json', 
                                                    'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0', 
                                                    'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN'
                                                },
                                                data : data
                                                };

                                                axios.request(config)
                                                .then((response) => {
                                                    console.log(JSON.stringify(response.data));
                                                    if(response.data.response_code == "00")
                                                    {

                                                        return models.transaction_withdraw.create({

                                                            tanggal : moment(new Date(), "YYYY-MM-DD"),
                                                            fk_user_merchant: idmerchant || null, 
                                                            tipedokumen: 'penarikan', 
                                                            jumlahuang: parseFloat(jumlahpenarikan) || null, 
                                                            status : 2, 
                                                            status_ket: 'Sukses Melakukan Permintaan Penarikan, Silahkan Cek Rekening Anda Secara Berkala', 
                                                            fullname: fullname, 
                                                            bankcode: kodebank || null, 
                                                            accountnumber: idreflinkqu || null, 
                                                            partner_ref: partner_reff
                                                            })
                                                            .then((userdetail) => {
                                                                if (userdetail) {
                                                                    return success(req, res, payload, "Sukses Melakukan Permintaan Penarikan, Kami akan segera transfer ke Rekening Anda", true);
                                                                }
                                                                return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, '');
                                                            })
                                                            .catch((err) => {
                                                                return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, err);
                                                            });
                                    

                                                    }else{
                                                        return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, false);
                                                    }
                                                    // return success(req, res, response.data, "Sukses", true);
                                                })
                                                .catch((errorr) => {
                                                console.log(errorr);
                                                return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, false);
                                                });

                                        }else{
                                            return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, false);
                                        }
                                        

                                        // return success(req, res, inquiryreff, "Sukses", true);
                                    })
                                    .catch((errorr) => {
                                    console.log(errorr);
                                    return error(req, res, {}, "Maaf Ada Kesalahan Server, Silahkan Cobalagi Nanti", false, false);
                                    });


                        }else{
                            let err= '404';
                            return error(req, res, {}, "Maaf Ada Kesalahan Server", false, err);
                        }
                        
                        // return success(req, res, response.data.data.balance, "Sukses", true);
                    })
                    .catch((error) => {
                        let err= '404';
                        return error(req, res, {}, "Maaf Ada Kesalahan Server", false, err);
                    });
                }else{
                    let err= '404';
                    return error(req, res, {}, "Jumlah Saldo Belum Mencukupi", false, err);
                }

                
            }else{
                let err= '404';
                return error(req, res, {}, "Data Tidak Ditemukan", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Data Tidak Ditemukan", false, err);
        });
}
