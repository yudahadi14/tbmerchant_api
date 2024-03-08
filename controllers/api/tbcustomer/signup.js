const { error, success } = require("../../../helpers/utility/response");
// const models = require("../../../modelstbcustomer");
// const modelsmerchant = require("../../../models");

const models = require("../../../modelstbproduction");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");

const crypto = require('crypto');
const { type } = require("os");

//const jwt = require('jsonwebtoken');
//const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");



exports.insertSignup = (req, res) => {
    let { fullname,emailphone, referalcode, idonesignal,telepon } = req.body;
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
    } else if (regexTlp2.test(telepon) == true) {
        notlp = telepon;
    } else if (regexTlp1.test(telepon) == true) {
        notlp = telepon;
    }

    let query = ``;

    if (email == null && notlp != null) {
        query = `
        select * from user_login_customer where user_notlp = :tlp limit 1
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

                    return models.user_login_customer.create({
                        user_fullname: fullname || null,
                        //user_email: lis_order_number || null,
                        user_notlp: notlp || null,
                        //user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                if (idonesignal == null || idonesignal == '') {
                                    return success(req, res, userdetail, "Anda Berhasil Terdaftar.", true);
                                } else {

                                    return models.user_devicelog_customer.create({
                                        jenisdokumen: 'OTP' || null,
                                        id_onesignal: idonesignal || null,
                                        kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                        fk_userlogin: userdetail.user_id || null,

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
                                                            "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for
                                                             login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
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
                                                            //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim$
                                                            })
                                                            .catch((error) => {
                                                                return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                            });
                                                        }else{
                                                            return error(req, res, {}, "No HP anda Tidak Terhubung Whatsapp", true, error);
                                                        }

                                                            return error(req, res, {}, "No HP anda Tidak Terhubung Whatsapp", true, error);
                                                        
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
        select *, 1 as isemail from user_login_customer where user_email = :emaill limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    emaill: email,
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let count = payload.length;
                //console.log(count);

                if (count == 0) {
                    return models.user_login_customer.create({
                        user_fullname: fullname || null,
                        user_email: email || null,
                        //user_notlp: notlp || null,
                        //user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                //if (iddevice == null || iddevice == '') {
                                  //  return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                // } else {

                                    return models.user_devicelog_customer.create({
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
                                                    text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                };

                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {

                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                        //console.log(error);
                                                    } else {
                                                        return success(req, res, [{'isemail' : 1}], "Kode OTP Berhasil Dikirim", true);
                                                        // console.log('Email sent: ' + info.response);
                                                    }
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
});
                                    // return models.user_devicelog_customer.create({
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
                    return success(req, res, {}, "Anda Sudah Terdaftar, Silahkan Login", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi 3", false, err);
            });
    } else if (email != null && notlp != null) {
        query = `
        select *, 1 as isemail from user_login_customer where user_email = :emaill limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    emaill: email,
                },
type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let count = payload.length;
                //console.log(count);

                if (count == 0) {
                    return models.user_login_customer.create({
                        user_fullname: fullname || null,
                        user_email: email || null,
                        user_notlp: notlp || null,
                        //user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                //if (iddevice == null || iddevice == '') {
                                  //  return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                // } else {

                                    return models.user_devicelog_customer.create({
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
text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                };

                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {

                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                        //console.log(error);
                                                    } else {
                                                        return success(req, res, [{'isemail' : 1}], "Kode OTP Berhasil Dikirim", true);
                                                        // console.log('Email sent: ' + info.response);
                                                    }
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                                        });
                                    // return models.user_devicelog_customer.create({
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
return success(req, res, {}, "Anda Sudah Terdaftar, Silahkan Login", false, err);
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

exports.createrating = (req, res) => {

    let { idtransaksi, iddriver,idmerchant, type_dokumen,nilai, komentar } = req.body;

    if(type_dokumen == "DRIVER")
    {
        idmerchant = null;
    }else if(type_dokumen == "MERCHANT")
    {
        iddriver = null;
    }

    return models.ratings.create({
        fk_id_merchant: idmerchant || null,
        fk_id_driver: iddriver || null,
        // fk_id_customer: notlp || null,
        nilai: nilai || null,
        type_dokumen: type_dokumen || null,
        id_transaksi: idtransaksi || null,
        komentar: komentar || null
    })
        .then((userdetail) => {
            if (userdetail) {

                return success(req, res, userdetail, "Terima Kasih Atas Penilaian Anda.", true);
            }
            return error(req, res, {}, "Kesalahan Server", false, '');
        })
        .catch((err) => {
            return error(req, res, {}, "Kesalahan Server", false, err);
        });
}

exports.getLogin = (req, res) => {
    let { emailphone, idonesignal } = req.body;

    let { email, notlp } = '';
    let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let regexTlp1 = /^\d{14}$/;
    let regexTlp2 = /^\d{13}$/;
    let regexTlp3 = /^\d{12}$/;
    let regexTlp4 = /^\d{11}$/;

    email = null;
    notlp = null;

    // cek email atau no telepon
    if (regexEmail.test(emailphone) == true) {
        email = emailphone;
    } else if (regexTlp4.test(emailphone) == true) {
        notlp = emailphone;
    } else if (regexTlp3.test(emailphone) == true) {
        notlp = emailphone;
    } else if (regexTlp2.test(emailphone) == true) {
        notlp = emailphone;
    } else if (regexTlp1.test(emailphone) == true) {
        notlp = emailphone;
    }

    if (email == null && notlp != null) {

        query = `
        select *,2 as isemail from user_login_customer where user_notlp = :tlp limit 1
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    tlp: notlp,
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    err = 'err';
                    return error(req, res, {}, "Anda belum terdaftar , Daftar Sekarang", false, err);




                } else {


                        return models.user_devicelog_customer.create({
                            jenisdokumen: 'OTP' || null,
                            id_onesignal: idonesignal || null,
                            kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                            fk_userlogin: payload[0].user_id || null,
                            expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                        })
                        .then((userdetail2) => {
                            if (userdetail2) {

                                let kodee = userdetail2.kode_otp;
                                //console.log(userdetail2.kode_otp);
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
                                        console.log(JSON.stringify(response.data));
                                        const { status } = JSON.parse(JSON.stringify(response.data));
                                        if (status == 200) {
                                            return success(req, res, payload, "Kode OTP Berhasil Dikirim", true);
                                        } else {
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", true, error);
                                        }
                                        //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                    })
                                    .catch((error) => {
                                        return error(req, res, {}, "Login Error Silahkan Cobalagi", true, error);
                                    });


                            }
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                        });


                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
            });

    }else if (email != null && notlp == null) {

        query = `
        select *,1 as isemail from user_login_customer where user_email = :emaill limit 1
        `;

        return models.sequelize
            .query(query, {
replacements: {
                    emaill: email,
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                let count = payload.length;
                console.log(count);

                if (count == 0) {

                    err = 'err';
                    return error(req, res, {}, "Anda belum terdaftar , Daftar Sekarang", false, err);




                } else {


                    return models.user_devicelog_customer.create({
                        jenisdokumen: 'OTP' || null,
id_onesignal: idonesignal || null,
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
text: 'That was easy! Your OTP is '+kodee.toString()+''
                                };

                                transporter.sendMail(mailOptions, function (errr, info) {
                                    if (errr) {

                                        return error(req, res, {}, "Login Error Silahkan Cobalagi", true, errr);
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


                }

            })
.catch((err) => {
                return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
            });

    } else {
        err = 'error';
        return error(req, res, {}, "Mohon isi Email / Number Phone !.", false, err);
    }

}


exports.cekloginKode = (req, res) => {

    let { emailphone, iddevice, kodeotp, idonesignal, firebasetoken } = req.body;

    if (emailphone != null && idonesignal != null) {

        let { email, notlp } = '';
        let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let regexTlp1 = /^\d{14}$/;
        let regexTlp2 = /^\d{13}$/;
        let regexTlp3 = /^\d{12}$/;
let regexTlp4 = /^\d{11}$/;

        email = null;
        notlp = null;

        // cek email atau no telepon
        if (regexEmail.test(emailphone) == true) {
            email = emailphone;
        } else if (regexTlp4.test(emailphone) == true) {
            notlp = emailphone;
        } else if (regexTlp3.test(emailphone) == true) {
            notlp = emailphone;
        } else if (regexTlp2.test(emailphone) == true) {
            notlp = emailphone;
        } else if (regexTlp1.test(emailphone) == true) {
            notlp = emailphone;
        }

        let query = ``;

        if (email == null && notlp != null) {

            query = `select * from user_login_customer ul
left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
            where ul.user_notlp = :nohp and ud.jenisdokumen = 'OTP'
            and now() <= ud.expired_date and kode_otp = :otpcode
            order by ud.log_id desc
            LIMIT 1;`;

        }else if (email != null && notlp == null) {

            query = `select * from user_login_customer ul
            left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
            where ul.user_email = :emaill and ud.jenisdokumen = 'OTP'
            and now() <= ud.expired_date and kode_otp = :otpcode
            order by ud.log_id desc
            LIMIT 1;`;

        }else{

        }


        return models.sequelize
            .query(query, {
                replacements: {
emaill: email,
                    nohp: notlp,
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

                    console.log(idonesignal);

                if(idonesignal != '' || idonesignal != null)
                    {

                        let querycekdevice =  `select * from user_devicelog where id_onesignal = :idonesignal and jenisdokumen = 'LOGIN' limit 1`;

                        return models.sequelize
                            .query(querycekdevice, {
                                replacements: {
                                    idonesignal: idonesignal,
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {

                                let count2 = payload2.length;
                                console.log(payload[0].user_id);

                                if(count2 == 0)
                                {

                                    return models.user_devicelog_customer.create({
                                        jenisdokumen: 'LOGIN' || null,
                                        kode_otp: parseInt(payload.kode_otp),
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        id_onesignal: idonesignal || null,
                                        firebasetoken: firebasetoken || null,
                                    })
.then((userdetail2) => {
                                        if(userdetail2)
                                        {
                                            return success(req, res, payload, "Login Berhasil.", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }else{

                                    return models.user_devicelog_customer.update({
                                        is_login: true || null,
                                        kode_otp: payload[0].kode_otp,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        update_date: moment(new Date(), "YYYY-MM-DD"),
                                        id_onesignal: idonesignal || null,
                                        firebasetoken: firebasetoken || null
                                    },{where: {iddevice: iddevice}})
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {
return success(req, res, payload, "Login Berhasil.", true);
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

    let { idonesignal,firebasetoken } = req.body;

    if(idonesignal != null)
    {

        let query = `select
        ul.user_id as user_id,
        ul.user_fullname as fullname,
        case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
        end as emailornotlp,
        ul.user_referalcode as kodereferal,
        ud.iddevice as deviceid,
        ud.id_onesignal as idonesignal
        from user_login_customer ul
                left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
                where ud.jenisdokumen = 'LOGIN'
                and now() <= ud.expired_date AND ud.id_onesignal = :idonesignal
                order by ud.log_id desc
                LIMIT 1;`;

        return models.sequelize
            .query(query, {
                replacements: {
                    idonesignal: idonesignal
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let jm = payload.length;

                //console.log(jm);

                if(jm > 0)
                {
                    return models.user_devicelog_customer.update({
                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                        update_date: moment(new Date(), "YYYY-MM-DD"),
                        firebasetoken: firebasetoken
                    },{where: {id_onesignal: idonesignal}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Login Berhasil.", true);
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
        let query = `select * from user_login_customer where user_fullname = :namefull and user_password = :passwordLama limit 1`;

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
                    return models.user_login_customer.update({
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

    let { fullname , kodeotp, passBaru, iddevice } = req.body;

    if(kodeotp == null && passBaru == null)
    {
        let query = `select * from user_login_customer where user_fullname = :namefull limit 1`;

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

                            return models.user_devicelog_customer.create({
                                jenisdokumen: 'OTPPASSWORD' || null,
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
                    // return models.user_login_customer.update({
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
    }else if(kodeotp != null && passBaru == null)
    {
        let query = `select * from user_login_customer ul
        left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
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
                    return models.user_devicelog_customer.update({
                        is_login: true

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

        let query = `select * from user_login_customer ul
        left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
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
                return models.user_login_customer.update({
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

exports.cekadabasket = (req, res) => {

    const { idonesignal,idmerchant } = req.body;

    query = `
    select
    th.*,
    (select sum(totalharga_produk) from production_tolongbeliin.transaction_detail td
    where td.fk_transaction_header = th.id_transaction_header) as totalhargapesanan,
    (select count(*) from production_tolongbeliin.transaction_detail td
    where td.fk_transaction_header = th.id_transaction_header) as jmlpesanan
    from production_tolongbeliin.transaction_header th
    left join production_tolongbeliin.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    where th.id_customer = (
    select
            ul.user_id
            from user_login_customer ul
                    left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
                    where ud.jenisdokumen = 'LOGIN'
                    and now() <= ud.expired_date AND ud.id_onesignal = :onesignalid
                    order by ud.log_id desc
                    LIMIT 1
    )
    and th.id_transaction_status is null and th.id_merchant = :idmerchant
    and tp.id_payment is null
    limit 1;
`;



    return models.sequelize
    .query(query, {
        replacements: {
            onesignalid: idonesignal,
            idmerchant: idmerchant
            // filterSatu: filterSatu,
            // filterDua: filterDua,
            // filterTiga: filterTiga
        },
        type: QueryTypes.SELECT,
    })
    .then(data => {
        // const response = getPagingData(data, page, limit);
        // res.send(response);
        return success(req, res, data, "List All Toko", true);
    })
    .catch(err => {
        // res.status(500).send({
        //     message:
//     err.message || "Some error occurred while retrieving tutorials."
        // });
        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
    });
}

exports.inorder = (req, res) => {

    let { fullname,idonesignal } = req.body;

    // let query = `
    // select
    // th.id_transaction_header as id_transaction_header,
    // ul.user_fullname as namacustomer,
    // ul.user_notlp as notlpcustomer,
    // ph.alamat_toko ,
    // ph.coordinate as coordinate_toko,
    // ul3.user_notlp as notlp_toko,
    // ph.nama_toko as nama_toko,
    // th.id_transaction_status as statusid,
    // th.ket_transaction_status as statusket,
    // th.input_date as tgltransaksimulai,
    // DATE_FORMAT(th.date_driver_selesai, '%d-%m-%Y %H:%i:%s') as tgltransaksiselesai,
    // case when ph.kategori_id = 1 then (
    // select produk_nama from production_tolongbeliin.product_makanan pm where pm.produk_id =
    // (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    // )
    // when ph.kategori_id = 2 then (
    // select produk_nama from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
    //     (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    // when ph.kategori_id = 3 then (
    // select produk_nama from production_tolongbeliin.product_elektronik pm where pm.produk_id =
    // (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    // when ph.kategori_id = 4 then (
    // select produk_nama from production_tolongbeliin.product_otomotif pm where pm.produk_id =
    // (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    // when ph.kategori_id = 5 then (
    // select produk_nama from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
    // (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    // when ph.kategori_id = 6 then (
    //     select produk_nama from production_tolongbeliin.product_fashion pm where pm.produk_id =
    //     (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //     when ph.kategori_id = 7 then (
    //     select produk_nama from production_tolongbeliin.product_matrial pm where pm.produk_id =
    //     (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //     end as namaproduk,
    //     case when ph.kategori_id = 1 then (
    //         select produk_foto from production_tolongbeliin.product_makanan pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    //         )
    //         when ph.kategori_id = 2 then (
    //         select produk_foto from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         when ph.kategori_id = 3 then (
    //         select produk_foto from production_tolongbeliin.product_elektronik pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         when ph.kategori_id = 4 then (
    //         select produk_foto from production_tolongbeliin.product_otomotif pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         when ph.kategori_id = 5 then (
    //         select produk_foto from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         when ph.kategori_id = 6 then (
    //         select produk_foto from production_tolongbeliin.product_fashion pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         when ph.kategori_id = 7 then (
    //         select produk_foto from production_tolongbeliin.product_matrial pm where pm.produk_id =
    //         (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
    //         end as fotoproduk,
    // (select count(td.id_transaction_detail) from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
    // as totalpesanan,
    // (select amount from production_tolongbeliin.transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
    // (select td.hargajual_produk from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    // as hargajual_produk,
    // case when ph.kategori_id = 1 then 'Makanan & Minuman'
    // when ph.kategori_id = 2 then 'Buah & Sayur'
    // when ph.kategori_id = 3 then 'Elektronik & Cellular'
    // when ph.kategori_id = 4 then 'Otomotif'
    // when ph.kategori_id = 5 then 'Pharmacy'
    // when ph.kategori_id = 6 then 'Fashion & Hobby'
    // when ph.kategori_id = 7 then 'Material'
    // end as namakategori,
    // ph.kategori_id,
    // case when ph.kategori_id = 1 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/fast-food.png'
    // when ph.kategori_id = 2 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/healthy-food.png'
    // when ph.kategori_id = 3 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/gadgets.png'
    // when ph.kategori_id = 4 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/automotive.png'
    // when ph.kategori_id = 5 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/pharmacy.png'
    // when ph.kategori_id = 6 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/laundry.png'
    // when ph.kategori_id = 7 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/brickwall.png'
    // end as photokategori,
    // case when th.ket_transaction_status is null then 'Silahkan Lakukan Pembayaran' else th.ket_transaction_status end as statuspesanann,
    // case when ul2.user_fullname is null then 'Silahkan Transfer' else ul2.user_fullname end as namadriver,
    // th.kode_transaksi as kodetransaksi,
    // (select tp.virtual_account as aa from production_tolongbeliin.transaction_payment tp
    //     where tp.id_transaction_header = th.id_transaction_header) nova,
    // case when ul2.user_notlp is null then CONCAT(' ',(select CONCAT('  ',(select CONCAT(
    //     (select mbl.namaBank from production_tolongbeliin.mref_bank_linkqu mbl where mbl.kodeBank = tp.bank_code
    //     LIMIT 1 ), ' ' , tp.virtual_account) as aa from production_tolongbeliin.transaction_payment tp
    //     where tp.id_transaction_header = th.id_transaction_header)))) else ul2.user_notlp end as notelpdriver
    // from production_tolongbeliin.transaction_header th
    // left join production_tolongbeliin.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    // -- left join production_tolongbeliin.transaction_detail td on th.id_transaction_header = td.fk_transaction_header
    // left join production_tolongbeliin.product_header ph on ph.prod_id = th.id_merchant
    // left join production_tolongbeliin.user_login ul3 on ul3.user_id = ph.fk_user_id
    // left join user_login_customer ul on ul.user_id = th.id_customer
    // left join user_login_driver ul2 on ul2.user_id = th.id_driver
    // where
    // ul.user_id =
    // (
    //     select
    //             ul.user_id
    //             from user_login_customer ul
    //                     left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
    //                     where ud.jenisdokumen = 'LOGIN'
    //                     and now() <= ud.expired_date AND ud.id_onesignal = :onesignalid
    //                     order by ud.log_id desc
    //                     LIMIT 1
    // )
    // and tp.id_payment is not null
    // `;

    let query = `
        select * from (
        select
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
            DATE_FORMAT(th.date_driver_selesai, '%d-%m-%Y %H:%i:%s') as tgltransaksiselesai,
            case when ph.kategori_id = 1 then (
            select produk_nama from production_tolongbeliin.product_makanan pm where pm.produk_id =
            (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
            )
            when ph.kategori_id = 2 then (
            select produk_nama from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 3 then (
            select produk_nama from production_tolongbeliin.product_elektronik pm where pm.produk_id =
            (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 4 then (
            select produk_nama from production_tolongbeliin.product_otomotif pm where pm.produk_id =
            (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 5 then (
            select produk_nama from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
            (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
            when ph.kategori_id = 6 then (
                select produk_nama from production_tolongbeliin.product_fashion pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 7 then (
                select produk_nama from production_tolongbeliin.product_matrial pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 8 then (
                select produk_nama from production_tolongbeliin.product_olahraga pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 9 then (
                select produk_nama from production_tolongbeliin.product_ibubayi pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 10 then (
                select produk_nama from production_tolongbeliin.product_atk pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 11 then (
                select produk_nama from production_tolongbeliin.product_mainananak pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                when ph.kategori_id = 12 then (
                select produk_nama from production_tolongbeliin.product_officialstore pm where pm.produk_id =
                (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                end as namaproduk,
                case when ph.kategori_id = 1 then (
                    select produk_foto from production_tolongbeliin.product_makanan pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
                    )
                    when ph.kategori_id = 2 then (
                    select produk_foto from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 3 then (
                    select produk_foto from production_tolongbeliin.product_elektronik pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 4 then (
                    select produk_foto from production_tolongbeliin.product_otomotif pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 5 then (
                    select produk_foto from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 6 then (
                    select produk_foto from production_tolongbeliin.product_fashion pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 7 then (
                    select produk_foto from production_tolongbeliin.product_matrial pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 8 then (
                    select produk_foto from production_tolongbeliin.product_olahraga pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 9 then (
                    select produk_foto from production_tolongbeliin.product_ibubayi pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 10 then (
                    select produk_foto from production_tolongbeliin.product_atk pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 11 then (
                    select produk_foto from production_tolongbeliin.product_mainananak pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))
                    when ph.kategori_id = 12 then (
                    select produk_foto from production_tolongbeliin.product_officialstore pm where pm.produk_id =
                    (select td.id_product from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1))  
                    end as fotoproduk,
            (select count(td.id_transaction_detail) from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
            as totalpesanan,
            (select amount from production_tolongbeliin.transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
            (select td.hargajual_produk from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
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
            when ph.kategori_id = 10 then 'Perlengkapan ATK'
            when ph.kategori_id = 11 then 'Mainan & Anak'
            when ph.kategori_id = 12 then 'Official Store'
            end as namakategori,
            ph.kategori_id,
            case when ph.kategori_id = 1 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/fast-food.png'
            when ph.kategori_id = 2 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/healthy-food.png'
            when ph.kategori_id = 3 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/gadgets.png'
            when ph.kategori_id = 4 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/automotive.png'
            when ph.kategori_id = 5 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/pharmacy.png'
            when ph.kategori_id = 6 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/laundry.png'
            when ph.kategori_id = 7 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/brickwall.png'
            when ph.kategori_id = 8 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/sports.png'
            when ph.kategori_id = 9 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/baby.png'
            when ph.kategori_id = 10 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/stationery.png'
            when ph.kategori_id = 11 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/storage-box.png'
            when ph.kategori_id = 12 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/tolong beliin logo-3.png'
            end as photokategori,
            case when th.ket_transaction_status is null then 'Silahkan Lakukan Pembayaran' else th.ket_transaction_status end as statuspesanann,
            case when ul2.user_fullname is null then 'Silahkan Transfer' else ul2.user_fullname end as namadriver,
            th.kode_transaksi as kodetransaksi,
            (select tp.virtual_account as aa from production_tolongbeliin.transaction_payment tp
                where tp.id_transaction_header = th.id_transaction_header) nova,
            case when ul2.user_notlp is null then CONCAT(' ',(select CONCAT('  ',(select CONCAT(
                (select mbl.namaBank from production_tolongbeliin.mref_bank_linkqu mbl where mbl.kodeBank = tp.bank_code
                LIMIT 1 ), ' ' , tp.virtual_account) as aa from production_tolongbeliin.transaction_payment tp
                where tp.id_transaction_header = th.id_transaction_header)))) else ul2.user_notlp end as notelpdriver,
                ul2.user_id as iddriver,
                ul3.user_id as idmerchant,
                (select nilai from ratings where id_transaksi = th.id_transaction_header and type_dokumen = 'DRIVER' limit 1) as ratingdriver,
                (select nilai from ratings where id_transaksi = th.id_transaction_header and type_dokumen = 'MERCHANT' limit 1) as ratingmerchant
            from production_tolongbeliin.transaction_header th
            left join production_tolongbeliin.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
            -- left join production_tolongbeliin.transaction_detail td on th.id_transaction_header = td.fk_transaction_header
            left join production_tolongbeliin.product_header ph on ph.prod_id = th.id_merchant
            left join production_tolongbeliin.user_login ul3 on ul3.user_id = ph.fk_user_id
            left join user_login_customer ul on ul.user_id = th.id_customer
            left join user_login_driver ul2 on ul2.user_id = th.id_driver
            where
            ul.user_id =
            (
                select
                        ul.user_id
                        from user_login_customer ul
                                left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
                                where ud.jenisdokumen = 'LOGIN'
                                and now() <= ud.expired_date 
                                AND ud.id_onesignal = :onesignalid
                                order by ud.log_id desc
                                LIMIT 1
            )
            and tp.id_payment is not null
        union
        select 
        tp.lineid as id_transaction_header,
        SUBSTRING_INDEX(ref_id,'-',1) AS namacustomer,
        tp.customer_no as notlpcustomer,
        '' as alamat_toko,
        '' as coordinate_toko,
        '' as notlp_toko,
        '' as nama_toko,
        '' as statusid,
        status_pembayaran as statusket,
        batas_trf as tgltransaksimulai,
        '' as tgltransaksiselesai,
        rd.product_name as namaproduk,
        case when rd.image_url = '' then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/tolong beliin logo-3.png' 
        else rd.image_url end as fotoproduk,
        1 as totalpesanan,
        jmltrf as total_harga_detail,
        jmltrf as hargajual_produk,
        'Pulsa & Tagihan' as namakategori,
        13 as kategori_id,
        case when rd.image_url = '' then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/tolong beliin logo-3.png' 
        else rd.image_url end as photokategori,
        case when status_pembayaran is null then status_digiflazz else status_pembayaran end as statuspesanann,
        case when status_pembayaran is null then 'Silahkan Transfer' else '' end as namadriver,
        '' as kodetransaksi,
        virtual_account as nova,
        case when status_pembayaran is null then virtual_account else '' end as notelpdriver,
        null as iddriver,
        null as idmerchant,
        null as ratingdriver,
        null as ratingmerchant
    
        from transaction_pulsatagihan tp
        left join ref_digiflazz rd on rd.id_ref = tp.ref_id_digiflazz 
        where 
        tp.userid_customer =
            (
                select
                        ul.user_id
                        from user_login_customer ul
                                left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
                                where ud.jenisdokumen = 'LOGIN'
                                and now() <= ud.expired_date 
                                AND ud.id_onesignal = :onesignalid
                                order by ud.log_id desc
                                LIMIT 1
            )
            and tp.idbayar is not null
        ) datadata
        order by datadata.tgltransaksimulai desc
    `;

    return models.sequelize
        .query(query, {
            replacements: {
                namefull: fullname,
                onesignalid: idonesignal
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

exports.inorderbyid = (req, res) => {

    let { idtransaction } = req.body;

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
    DATE_FORMAT(th.date_driver_selesai, '%d-%m-%Y %H:%i:%s') as tgltransaksiselesai,
    case when ph.kategori_id = 1 then (
    select produk_nama from production_tolongbeliin.product_makanan pm where pm.produk_id =
        td.id_product    )
    when ph.kategori_id = 2 then (
    select produk_nama from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
        td.id_product
        )
    when ph.kategori_id = 3 then (
    select produk_nama from production_tolongbeliin.product_elektronik pm where pm.produk_id =
    td.id_product)
    when ph.kategori_id = 4 then (
    select produk_nama from production_tolongbeliin.product_otomotif pm where pm.produk_id =
    td.id_product)
    when ph.kategori_id = 5 then (
    select produk_nama from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
td.id_product)
    when ph.kategori_id = 6 then (
    select produk_nama from production_tolongbeliin.product_fashion pm where pm.produk_id =
    td.id_product)
    when ph.kategori_id = 7 then (
    select produk_nama from production_tolongbeliin.product_matrial pm where pm.produk_id =
    td.id_product)
    end as namaproduk,
    case when ph.kategori_id = 1 then (
        select produk_foto from production_tolongbeliin.product_makanan pm where pm.produk_id =
        td.id_product
        )
        when ph.kategori_id = 2 then (
        select produk_foto from production_tolongbeliin.product_buahsayur pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 3 then (
        select produk_foto from production_tolongbeliin.product_elektronik pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 4 then (
        select produk_foto from production_tolongbeliin.product_otomotif pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 5 then (
        select produk_foto from production_tolongbeliin.product_pharmacy pm where pm.produk_id =
td.id_product)
        when ph.kategori_id = 6 then (
        select produk_foto from production_tolongbeliin.product_fashion pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 7 then (
        select produk_foto from production_tolongbeliin.product_matrial pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 8 then (
        select produk_foto from production_tolongbeliin.product_olahraga pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 9 then (
        select produk_foto from production_tolongbeliin.product_ibubayi pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 10 then (
        select produk_foto from production_tolongbeliin.product_atk pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 11 then (
        select produk_foto from production_tolongbeliin.product_mainananak pm where pm.produk_id =
        td.id_product)
        when ph.kategori_id = 12 then (
        select produk_foto from production_tolongbeliin.product_officialstore pm where pm.produk_id =
        td.id_product)        
        end as fotoproduk,
    (select count(td.id_transaction_detail) from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    as totalpesanan,
    (select amount from production_tolongbeliin.transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
    (select td.hargajual_produk from production_tolongbeliin.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1 )
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
    when ph.kategori_id = 10 then 'Perlengkapan ATK'
    when ph.kategori_id = 11 then 'Mainan & Anak'
    when ph.kategori_id = 12 then 'Official Store'
    end as namakategori,
    ph.kategori_id,
    case when ph.kategori_id = 1 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/fast-food.png'
when ph.kategori_id = 2 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/healthy-food.png'
    when ph.kategori_id = 3 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/gadgets.png'
    when ph.kategori_id = 4 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/automotive.png'
    when ph.kategori_id = 5 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/pharmacy.png'
    when ph.kategori_id = 6 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/laundry.png'
    when ph.kategori_id = 7 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/brickwall.png'
    when ph.kategori_id = 8 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/sports.png'
    when ph.kategori_id = 9 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/baby.png'
    when ph.kategori_id = 10 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/stationery.png'
    when ph.kategori_id = 11 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/storage-box.png'
    when ph.kategori_id = 12 then 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/icon/tolong beliin logo-3.png'
    end as photokategori,
    case when th.ket_transaction_status is null then 'Silahkan Lakukan Pembayaran' else th.ket_transaction_status end as statuspesanann,
    case when ul2.user_fullname is null then 'Silahkan Transfer' else ul2.user_fullname end as namadriver,
    th.kode_transaksi as kodetransaksi,
    case when ul2.user_notlp is null then CONCAT(' ',(select CONCAT(
        (select mbl.namaBank from production_tolongbeliin.mref_bank_linkqu mbl where mbl.kodeBank = tp.bank_code
        LIMIT 1 ), ' ' , tp.virtual_account) as aa from production_tolongbeliin.transaction_payment tp
        where tp.id_transaction_header = th.id_transaction_header)) else ul2.user_notlp end as notelpdriver,
    th.*,
    tp.*,
    ml.*,
    td.*,
    ROUND(6371 * acos(
                cos( radians(ST_X(ph.coordinate)) )
              * cos( radians( ST_X(th.coordinate_customer) ) )
              * cos( radians( ST_Y(th.coordinate_customer) ) - radians(ST_Y(ph.coordinate)) )
              + sin( radians(ST_X(ph.coordinate)) )
* sin( radians( ST_X(th.coordinate_customer) ) )
                ) ) AS distance,
                ul2.user_notlp as telepondriver
    from production_tolongbeliin.transaction_detail td
    left join production_tolongbeliin.transaction_header th on th.id_transaction_header = td.fk_transaction_header
    left join production_tolongbeliin.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    left join production_tolongbeliin.product_header ph on ph.prod_id = th.id_merchant
    left join production_tolongbeliin.user_login ul3 on ul3.user_id = ph.fk_user_id
    left join user_login_customer ul on ul.user_id = th.id_customer
    left join user_login_driver ul2 on ul2.user_id = th.id_driver
    left join production_tolongbeliin.mref_bank_linkqu ml on ml.id = tp.ref_id_bayar
    where
    th.id_transaction_header = :idtransaction

    `;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaction: idtransaction
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

exports.deleteBasket = (req, res) => {
try {
        let { idtransaksi } = req.body;

        if(idtransaksi)
        {
            // dataheaderquery = `delete from production_tolongbeliin.transaction_detail where id_transaction_detail = :idtransaksii`;
            // dataheader =
            // {
            //     idtransaksii: idtransaksi
            // }

            // return models.sequelize
            //                                 .query(dataheaderquery, {
            //                                     replacements: dataheader,
            //                                     type: QueryTypes.DELETE,
            //                         })
            return models.transaction_detail.destroy({where: {id_transaction_detail: idtransaksi}})
            .then((userdetail2) => {
                if(userdetail2)
                {
                    return success(req, res, {}, "Produk Berhasil Di Delete", true);
                }
            })
.catch((err) => {
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            });
        }



    } catch (error) {
        return error(req, res, error, "Error , Silahkan Cobalagi", false, err);
    }
}

exports.produkpulsa = (req, res) => {

    let { category,notelepon,brand } = req.body;
    let query = ``;
    if(category == "E-Money")
    {
        //notelepon = null;
         query = `select * from ref_digiflazz where category = :category order by price asc`;
    }else if(category == "Pascabayar")
    {
        query = `select * from ref_digiflazz where category = :category and brand = :brandd order by price asc`;
    }else if(category == "PLN")
    {
        //notelepon = null;
         query = `select * from ref_digiflazz where category = :category and price_jual is not null order by price asc`;
    }else{
         query = `select * from ref_digiflazz where category = :category and kode_telepon like :notelepon order by price asc`;
    }
    // query = `select * from ref_digiflazz where category = :category and kode_telepon like :notelepon`;

        return models.sequelize
            .query(query, {
                replacements: {
                    category: category,
                    notelepon: '%'+notelepon+'%',
                    brandd: brand
            },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                return success(req, res, payload, "List Pulsa", true);
            })
            .catch((err) => {
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            });
        

}

exports.topupdigiflazz = (req, res) => {

    let {
        customer_no,
        buyer_sku_code,
        ref_id_digiflazz,
        iddevice,
        fullname,
        harga,
        idbayar,
        sn
    } = req.body;

    let query = `select
    ul.user_id as user_id,
    ul.user_fullname as fullname,
    case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
    when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
    end as emailornotlp,
    ul.user_referalcode as kodereferal,
    ud.iddevice as deviceid,
    ud.id_onesignal as idonesignal,
    DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl,
    mbl.*
    from user_login_customer ul
            left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
            left join mref_bank_linkqu mbl on mbl.id = :idbayarr
            where ud.jenisdokumen = 'LOGIN'
            and ud.id_onesignal = :iddevice
            order by ud.log_id desc
            LIMIT 1;`;

        return models.sequelize
            .query(query, {
                replacements: {
                    iddevice: iddevice,
                    idbayarr: parseInt(idbayar)
            },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                // return success(req, res, payload, "List Pulsa", true);
                let cont = payload.length;

                if(cont > 0)
                {
                    let customerid = payload[0].user_id;

                    let urll = '';
                    let bankcode = payload[0].kodeBank;

                    if(payload[0].type_kode == "va")
                    {
                        urll = 'https://gateway.linkqu.id/linkqu-partner/transaction/create/va';
                        bankcode = payload[0].kodeBank;
                    }else if(payload[0].type_kode == "uniquecode")
                    {
                        urll = 'https://gateway.linkqu.id/linkqu-partner/transaction/create/uniquecode';
                        bankcode = payload[0].namaBank;
                    }

                    let refid = Math.floor(100 + Math.random() * 900);
                    const regex = '/[^0-9a-zA-Z]/g';
                    const path = "/transaction/create/va";
                    const method = "POST";
                    //const clientID = "testing";
                    const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
                    const amount = harga;
                    //const  = moment(new Date(), "YYYYMMDD").add(1, 'days');
                    var d = new Date();
                    d.setDate(d.getDate() + 1);
                    // const expired = [ (d.getMonth()+1).padLeft(),
                    //     d.getDate().padLeft(),
                    //     d.getFullYear()].join('')+
                    //     '' +
                    // [ d.getHours().padLeft(),
                    //     d.getMinutes().padLeft(),
                    //     d.getSeconds().padLeft()].join('');
                    // console.log(""+payload[0].namaBank+""+data2[0].user_fullname+""+data2[0].user_id+""+data2[0].id_transaction_header+"");
                    const expired = payload[0].tgl;
                    
                    const partner_reff = ''+fullname+''+ref_id_digiflazz+''+refid+''; //""+payload[0].user_fullname+""+payload[0].user_id+""+refid+"";
                    const customer_id = ""+payload[0].user_id+"0000";
                    const customer_name = fullname;
                    const customer_email = payload[0].user_email || '';
                    const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";





                    console.log(expired);

                    var string1 = '';


                    if(payload[0].type_kode == "va")
                        {
                            string1 = amount+expired+bankcode+partner_reff.replace(/\s/g,"")+customer_id+customer_name+customer_email+clien_id;

                        }else if(payload[0].type_kode == "uniquecode")
                        {
                            string1 = amount+bankcode+partner_reff.replace(/\s/g,"")+clien_id;

                        }
                    
                    
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
                        let datakirim = ``;
                        if(payload[0].type_kode == "va")
                        {
                            datakirim = JSON.stringify({
                                "amount": harga,
                                "partner_reff": partner_reff.replace(/\s/g,""),
                                "customer_id": ""+payload[0].user_id+"0000",
                                "customer_name": fullname,
                                "expired": expired,
                                "username": "LI9948NTV",    
                                "pin": "JQoDvZNvd57C1l5",
                                "customer_phone": (payload[0].user_notlp == null) ? '0' : payload[0].user_notlp,
                                "customer_email": payload[0].user_email,
                                "bank_code": bankcode,
                                "signature": signature
                                });
                        }else if(payload[0].type_kode == "uniquecode")
                        {
                            datakirim = JSON.stringify({
                                "amount": harga,
                                "partner_reff": partner_reff.replace(/\s/g,""),
                                "username": "LI9948NTV",
                                "pin": "JQoDvZNvd57C1l5",
                                "bank_code": bankcode,
                                "signature": signature
                                });
                        }
                        

                        let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: urll,
                        headers: {
                            'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0',
                            'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN',
                            'Content-Type': 'application/json'
                        },
                        data : datakirim
                        };

                        axios.request(config)
                        .then((response) => {
                            if(response.data.status == "SUCCESS")
                            {
                                return models.transaction_pulsatagihan.create({
                                    ref_id: ''+fullname+'-'+ref_id_digiflazz+'-'+refid+'' || null,
                                    customer_no: customer_no || null,
                                    buyer_sku_code: buyer_sku_code || null,
                                    userid_customer: customerid || null,
                                    ref_id_digiflazz: ref_id_digiflazz || null,
                                    status_digiflazz: 'Menunggu Pembayaran',
                                    kodeuniktrf: refid,
                                    jmltrf: harga || null,
                                    batas_trf: moment(new Date(), "YYYY-MM-DD").add(1, 'days'),
                                    idbayar: idbayar,
                                    amount: amount || null,
                                    customer_nama: customer_name|| null,
                                                            customer_id: customer_id || null,
                                                            partner_reff: partner_reff || null,
                                                            expired: expired || null,
                                                            customer_phone: (payload[0].user_notlp == null) ? '0' : payload[0].user_notlp || null,
                                                            customer_email: customer_email || null,
                                                            bank_code: bankcode || null,
                                                            username: "LI307GXIN" || null,
                                                            pin: "2K2NPCBBNNTovgB" || null,
                                                            virtual_account: ""+response.data.virtual_account+"" || null,
                                                            signature: ""+response.data.signature+"" || null,
                                    sn: sn || null,
                                })
                                    .then((userdetail) => {

                                        if(userdetail)
                                        {

                                            let query2 = `select *,
                                            
                                            jmltrf + kodeuniktrf as jumlahbayar,
                                            DATE_FORMAT(batas_trf , "%e %M %Y %H:%i:%s") as batasakhir 
                                            from transaction_pulsatagihan
                                            left join mref_bank_linkqu on idbayar = id
                                            where ref_id = :refid`;

                                            return models.sequelize
                                                .query(query2, {
                                                    replacements: {
                                                        refid: ''+fullname+'-'+ref_id_digiflazz+'-'+refid+''
                                                },
                                                    type: QueryTypes.SELECT,
                                                })
                                                .then((payload2) => {
                                                    return success(req, res, payload2, "List Pulsa", true);
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
                                console.log(response);
                                return error(req, res, {}, ""+response.data.response_desc+"", false, true);
                            }
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });



                    






                }else{
                    return error(req, res, {}, "Ada Kesalahan Server", false, err);
                }
                


            })
            .catch((err) => {
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            });




}

exports.produkpulsapasca = (req, res) => {
    let { category,notelepon,brand } = req.body;

    let kode = 'rifotagxnLQDc243b4d1-9233-56c1-87cf-949ab8e481ac'+notelepon+'';
    
    let query = `select MD5(:kode) as md5`;
    // if(category == "E-Money")
    // {
    //     //notelepon = null;
    //      query = `select * from ref_digiflazz where category = :category order by price asc`;
    // }else if(category == "Pascabayar")
    // {
    //     query = `select * from ref_digiflazz where category = :category and brand = :brandd order by price asc`;
    // }else{
    //      query = `select * from ref_digiflazz where category = :category and kode_telepon like :notelepon order by price asc`;
    // }
    // query = `select * from ref_digiflazz where category = :category and kode_telepon like :notelepon`;

        return models.sequelize
            .query(query, {
                replacements: {
                    kode: ''+kode+''
            },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                console.log(payload[0].md5);
                const axios = require('axios');
                // let datakirim = JSON.stringify({
                //     "amount": jumlah,
                //     "partner_reff": partner_reff.replace(/\s/g, ""),
                //     "customer_id": "" + data2[0].user_id + "0000",
                //     "customer_name": data2[0].user_fullname,
                //     "expired": expired,
                //     "username": "LI9948NTV",
                //     "pin": "JQoDvZNvd57C1l5",
                //     "customer_phone": (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp,
                //     "customer_email": data2[0].user_email,
                //     "bank_code": data[0].kodeBank,
                //     "signature": signature
                // });

                // let config = {
                //     method: 'post',
                //     maxBodyLength: Infinity,
                //     url: 'https://api.digiflazz.com/v1/transaction',
                //     headers: {
                //         'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0',
                //         'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN',
                //         'Content-Type': 'application/json'
                //     },
                //     data: datakirim
                // };

                // axios.request(config)
                //     .then((response) => {

                //     })
                //     .catch((error) => {
                //         return error(req, res, {}, "Nomor Tagihan Tidak Ditemukan", false, err);
                //     });

                    // const axios = require('axios');
                    // let data = '{\n    "commands": "inq-pasca",\n    "username": "rifotagxnLQD",\n    "buyer_sku_code": "pln",\n    "customer_no": "'+notelepon+'",\n    "ref_id": "'+notelepon+'",\n    "sign": "'+payload[0].md5+'"\n}';
                    let data = JSON.stringify({
                        "commands": "inq-pasca",
                        "username": "rifotagxnLQD",
                        "buyer_sku_code": "pln",
                        "customer_no": notelepon,
                        "ref_id": notelepon,
                        "sign": payload[0].md5
                      });
                    console.log(data);
                    let config = {
                      method: 'post',
                      maxBodyLength: Infinity,
                      url: 'https://api.digiflazz.com/v1/transaction',
                      headers: { 
                        'Content-Type': 'application/json'
                      },
                      data : data
                    };
                    
                    axios.request(config)
                    .then((response) => {
                        //console.log(JSON.stringify(response.data));
                        return success(req, res, {}, "List Pulsa", true);
                    })
                    .catch((errorr) => {
                        return error(req, res, {}, "Nomor Tagihan Tidak Ditemukan", false, errorr);
                    });
                
            })
            .catch((err) => {
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            });
}

exports.ceknomortoken = (req, res) => {
    let { category,notelepon,brand } = req.body;

    let kode = 'rifotagxnLQDc243b4d1-9233-56c1-87cf-949ab8e481acNAMAPLN'+notelepon+'';
    
    let query = `select MD5(:kode) as md5`;
    
        return models.sequelize
            .query(query, {
                replacements: {
                    kode: ''+kode+''
            },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {

                console.log(payload[0].md5);
                const axios = require('axios');

                let data = JSON.stringify(
                    // {
                    // "commands": "inq-pasca",
                    // "username": "rifotagxnLQD",
                    // "buyer_sku_code": "pln",
                    // "customer_no": notelepon,
                    // "ref_id": notelepon,
                    // "sign": payload[0].md5
                    // }
                    {
                        "username": "rifotagxnLQD",
                        "buyer_sku_code": "NAMAPLN",
                        "customer_no": notelepon,
                        "ref_id": "NAMAPLN"+notelepon+"",
                        "sign": payload[0].md5
                        
                    }
                  );
                // console.log(data);
                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  url: 'https://api.digiflazz.com/v1/transaction',
                  headers: { 
                    'Content-Type': 'application/json'
                  },
                  data : data
                };
                
                axios.request(config)
                .then((response) => {

                    console.log(JSON.stringify(response.data));
                    // if(response.data.status == "Pending")
                    // {
                        let data = JSON.stringify({
                            "commands": "inq-pra",
                            "username": "rifotagxnLQD",
                            "buyer_sku_code": "NAMAPLN",
                            "customer_no": notelepon,
                            "ref_id": "NAMAPLN"+notelepon+"",
                            "sign": payload[0].md5
                          });
                        // console.log(data);
                        let config = {
                          method: 'post',
                          maxBodyLength: Infinity,
                          url: 'https://api.digiflazz.com/v1/transaction',
                          headers: { 
                            'Content-Type': 'application/json'
                          },
                          data : data
                        };
                        
                        axios.request(config)
                        .then((response2) => {
                            console.log(JSON.stringify(response2.data));
                            return success(req, res, response2.data, "List Pulsa", true);
                        })
                        .catch((errorr) => {
                            return error(req, res, {}, "Nomor ID Meter Tidak Ditemukan", false, errorr);
                        });
                    // }else{
                    //     return error(req, res, {}, "Nomor ID Meter Tidak Ditemukan", false, true);
                    // }
                })
                .catch((errorr) => {
                    console.log(errorr);
                    console.log(JSON.stringify(errorr));
                    return error(req, res, {}, "Nomor ID Meter Tidak Ditemukan", false, JSON.stringify(errorr));
                });
                
                
                
            })
            .catch((err) => {
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            });
}

exports.getbanner = (req, res) => {

    const { username,password,type } = req.body;

    if(username == "beliintolong" && password == "ghaida789")
    {

        query = `
        select url as image from ref_banner rb where type_id = :typeid
        `;



        return models.sequelize
        .query(query, {
            replacements: {
                typeid: parseInt(type)
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then(data => {
            // const response = getPagingData(data, page, limit);
            // res.send(response);
            return success(req, res, data, "List All Banner Depan", true);
        })
        .catch(err => {
            // res.status(500).send({
            //     message:
    //     err.message || "Some error occurred while retrieving tutorials."
            // });
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

    }else{
        return error(req, res, {}, "Anda Tidak Berhak Mengakses Ini", false, false);
    }

    
}

exports.getdataprofile = (req, res) => {
    
    const { fullname,idonesignal } = req.body;

    query = `
    select * from user_login_customer ulc
    left join user_devicelog_customer udc on udc.fk_userlogin = ulc.user_id
    where id_onesignal = :idonesignall
    `;



    return models.sequelize
    .query(query, {
        replacements: {
            idonesignall: idonesignal
            // filterSatu: filterSatu,
            // filterDua: filterDua,
            // filterTiga: filterTiga
        },
        type: QueryTypes.SELECT,
    })
    .then(data => {
        // const response = getPagingData(data, page, limit);
        // res.send(response);
        return success(req, res, data, "List User Customer", true);
    })
    .catch(err => {
        // res.status(500).send({
        //     message:
//     err.message || "Some error occurred while retrieving tutorials."
        // });
        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
    });
}

exports.logout = (req, res) => {
    let { user_id , idonesignal} = req.body;


    let query = `select ul.*, ud.log_id from user_login_customer ul
    left join user_devicelog_customer ud on ud.fk_userlogin = ul.user_id
    where ul.user_id = :userid and ud.id_onesignal = :idonesignal limit 1`;

    return models.sequelize
        .query(query, {
            replacements: {
                userid: parseInt(user_id),
                idonesignal: idonesignal
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {

                return models.user_devicelog_customer.destroy({where: {log_id: payload[0].log_id}})
                .then((userdetail2) => {
                    if(userdetail2)
                    {
                        return success(req, res, payload, "Data Berhasil Di Update", true);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Maaf Ada Kesalahan Server !!", false, err);
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
                return error(req, res, {}, "Maaf Ada Kesalahan Server !!", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Maaf Ada Kesalahan Server !!", false, err);
        });
}

exports.getdatakomentar = (req, res) => {
    
    const { idmerchant,produkidheader } = req.body;

    query = `
    select 
    -- ph.*, rt.*, ulc.* ,
    ulc.user_fullname as name,
    'assets/avatar-gamer.png' as pic,
    rt.komentar as message,
    rt.created_date as date,
    rt.nilai as ratings
    from ratings rt 
    left join transaction_header th on rt.id_transaksi = th.id_transaction_header 
    left join product_header ph on ph.prod_id = th.id_merchant 
    left join user_login_customer ulc on ulc.user_id = th.id_customer 
    where ph.fk_user_id = 54 and ph.prod_id = 31 and rt.type_dokumen = 'MERCHANT'
    `;



    return models.sequelize
    .query(query, {
        replacements: {
            idmerchant: idmerchant,
            produkidheader: produkidheader
            // filterSatu: filterSatu,
            // filterDua: filterDua,
            // filterTiga: filterTiga
        },
        type: QueryTypes.SELECT,
    })
    .then(data => {
        // const response = getPagingData(data, page, limit);
        // res.send(response);
        return success(req, res, data, "List Comment Customer", true);
    })
    .catch(err => {
        // res.status(500).send({
        //     message:
//     err.message || "Some error occurred while retrieving tutorials."
        // });
        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
    });
}

exports.chats = (req, res) => {
    
    const { idmerchant,produkidheader } = req.body;

    // query = `
    // select 
    // -- ph.*, rt.*, ulc.* ,
    // ulc.user_fullname as name,
    // 'assets/avatar-gamer.png' as pic,
    // rt.komentar as message,
    // rt.created_date as date,
    // rt.nilai as ratings
    // from ratings rt 
    // left join transaction_header th on rt.id_transaksi = th.id_transaction_header 
    // left join product_header ph on ph.prod_id = th.id_merchant 
    // left join user_login_customer ulc on ulc.user_id = th.id_customer 
    // where ph.fk_user_id = 54 and ph.prod_id = 31 and rt.type_dokumen = 'MERCHANT'
    // `;

    query = `
    select 
    ulc.user_fullname as name,
    ulc.user_id as useridcustomer,
    'assets/avatar-gamer.png' as pic,
    rt.komentar as message,
    rt.created_date as date,
    uld.user_fullname as namedriver,
    uld.user_id as useriddriver,
    th.id_transaction_status as statusid
    from chats rt 
    left join transaction_header th on rt.id_transaksi = th.id_transaction_header  
    left join user_login_customer ulc on ulc.user_id = rt.fk_id_customer
    left join user_login_driver uld on uld.user_id = rt.fk_id_driver 
    where th.id_transaction_header = :produkidheader order by rt.created_date asc
    `;



    return models.sequelize
    .query(query, {
        replacements: {
            idmerchant: idmerchant,
            produkidheader: produkidheader
            // filterSatu: filterSatu,
            // filterDua: filterDua,
            // filterTiga: filterTiga
        },
        type: QueryTypes.SELECT,
    })
    .then(data => {
        return success(req, res, data, "List Comment Customer", true);
    })
    .catch(err => {
        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
    });
}

exports.insertchats = (req, res) => {
    
    const { iscustomer,produkidheader,custchat,komentar } = req.body;

    

    if(iscustomer == 1)
    {
        console.log(iscustomer);
        query2 = `
                select  
                th.id_customer as user_id
                from transaction_header th
                where th.id_transaction_header = :produkidheader
                `;



                return models.sequelize
                    .query(query2, {
                        replacements: {
                            produkidheader: produkidheader
                            // filterSatu: filterSatu,
                            // filterDua: filterDua,
                            // filterTiga: filterTiga
                        },
                        type: QueryTypes.SELECT,
                    })
                    .then(data2 => {

                        if(data2.length > 0)
                        {

                            return models.chats.create({
                                fk_id_customer: data2[0].user_id || null,
                                //user_email: lis_order_number || null,
                                id_transaksi: produkidheader || null,
                                //user_password: md5(userpass) || null,
                                komentar: komentar || null,
                            })
                                .then((userdetail) => {
                    
                                    query = `
                                    select 
                                    udd.firebasetoken
                                    from chats rt 
                                    left join transaction_header th on rt.id_transaksi = th.id_transaction_header 
                                    left join user_login_driver uld on uld.user_id = rt.fk_id_driver 
                                    left join user_devicelog_driver udd on udd.fk_userlogin = uld.user_id
                                    where th.id_transaction_header = :produkidheader and udd.is_login = 1 and udd.jenisdokumen = 'LOGIN' order by rt.created_date asc
                                    `;
                    
                    
                    
                                    return models.sequelize
                                        .query(query, {
                                            replacements: {
                                                produkidheader: produkidheader
                                                // filterSatu: filterSatu,
                                                // filterDua: filterDua,
                                                // filterTiga: filterTiga
                                            },
                                            type: QueryTypes.SELECT,
                                        })
                                        .then(data => {
                    
                                            const axios = require('axios');
                                            let datakirim = JSON.stringify({
                                                "to": "" + data[0].firebasetoken + "",
                                                "notification": {
                                                    "body": ""+komentar+"",
                                                    "title": "Ada Chat Baru"
                                                },
                                                "data": {}
                                            });
                    
                                            let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://fcm.googleapis.com/fcm/send',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'key=AAAAgSEq70U:APA91bH0Tcle3e1LgvOL8tED8lZEfjTcL3nth24TmaY1pV8gK0eyf-v48_gpvCzTM9uHSGzod7QIOEoPVWhvIWZ6G4af7ttqbKhRimnTuIhE4ZtjiCf7g6H-_C1jBzb4VQWfkbsHGXil'
                                                },
                                                data: datakirim
                                            };
                    
                                            axios.request(config)
                                                .then((response) => {
                                                    console.log(response);
                                                    return success(req, res, data, "List Comment Customer", true);
                    
                                                })
                                                .catch((error) => {
                                                    return success(req, res, data, "List Comment Customer", true);
                                                });
                                            
                                        })
                                        .catch(err => {
                                            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                                        });
                    
                                    
                                    
                                })
                                .catch((err) => {
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                });

                        }else{
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                        }

                        

                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });


        

    }else{

        query2 = `
                select 
                th.id_driver as user_id
                from transaction_header th
                where th.id_transaction_header = :produkidheader
                `;



                return models.sequelize
                    .query(query2, {
                        replacements: {
                            produkidheader: produkidheader
                            // filterSatu: filterSatu,
                            // filterDua: filterDua,
                            // filterTiga: filterTiga
                        },
                        type: QueryTypes.SELECT,
                    })
                    .then(data2 => {

                        if(data2.length > 0)
                        {

                            return models.chats.create({
                                fk_id_driver: data2[0].user_id || null,
                                //user_email: lis_order_number || null,
                                id_transaksi: produkidheader || null,
                                //user_password: md5(userpass) || null,
                                komentar: komentar || null,
                            })
                                .then((userdetail) => {
                                    query = `
                                    select 
                                    udd.firebasetoken
                                    from chats rt 
                                    left join transaction_header th on rt.id_transaksi = th.id_transaction_header 
                                    left join user_login_customer ulc on ulc.user_id = rt.fk_id_customer
                                    left join user_devicelog_customer udd on udd.fk_userlogin = ulc.user_id
                                    where th.id_transaction_header = :produkidheader and udd.is_login = 1 and udd.jenisdokumen = 'LOGIN' and firebasetoken is not null  order by rt.created_date asc limit 1
                                    `;
                    
                    
                    
                                    return models.sequelize
                                        .query(query, {
                                            replacements: {
                                                produkidheader: produkidheader
                                                // filterSatu: filterSatu,
                                                // filterDua: filterDua,
                                                // filterTiga: filterTiga
                                            },
                                            type: QueryTypes.SELECT,
                                        })
                                        .then(data => {
                    
                                            const axios = require('axios');
                                            let datakirim = JSON.stringify({
                                                "to": "" + data[0].firebasetoken + "",
                                                "notification": {
                                                    "body": ""+komentar+"",
                                                    "title": "Ada Chat Baru"
                                                },
                                                "data": {}
                                            });
                    
                                            let config = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://fcm.googleapis.com/fcm/send',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'key=AAAA-vf3vjY:APA91bEDypZi1imDltIuJSa5vnfUq1EHDA8rLnWN3-TWs0laad4y8GQEzjtlcIIQ_ZgCI-6yPKIilSJ2LwpYZEoDFYw4nfPvTrAQNQMqKo6Si6k3cwlgOQqTULDpmXVlH5izHZP2dPH1'
                                                },
                                                data: datakirim
                                            };
                    
                                            axios.request(config)
                                                .then((response) => {
                                                    console.log(response);
                                                    return success(req, res, data, "List Comment Customer", true);
                    
                                                })
                                                .catch((error) => {
                                                    return success(req, res, data, "List Comment Customer", true);
                                                });
                                            
                                        })
                                        .catch(err => {
                                            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                                        });
                                })
                                .catch((err) => {
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                });

                        }else{
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                        }

                        

                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

        
    }
}


