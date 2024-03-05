const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../models");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");
//const jwt = require('jsonwebtoken');
//const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");


exports.insertSignup = (req, res) => {
    let { fullname, emailphone, userpass, referalcode, iddevice } = req.body;
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
                                        jenisdokumen: 'LOGIN' || null,
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: userdetail[0].user_id || null,
                                        expired_date: moment().add(1, 'months') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                return success(req, res, userdetail, "Merchant Berhasil Terdaftar.", true);
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                        });

                                }


                            }
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false);
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
                                        expired_date: moment().add(3, 'minutes') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
            
                                                let kodee = userdetail2.kode_otp;
                                                //console.log(userdetail2.kode_otp);
            
                                                let transporter = nodemailer.createTransport({
                                                    service: 'gmail',
                                                    auth: {
                                                        user: 'tolongbeliin0dev@gmail.com',
                                                        pass: 'ndpkjmjvcppivicz'
                                                    }
                                                });
                        
                                                let mailOptions = {
                                                    from: 'tolongbeliin0dev@gmail.com',
                                                    to: userdetail.user_email,
                                                    subject: 'Sending Email Tester ',
                                                    text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                };
                        
                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {
                        
                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true);
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
                                    //     expired_date: moment().add(1, 'months') || null,
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
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false);
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
                            expired_date: moment().add(3, 'minutes') || null,
                        })
                            .then((userdetail2) => {
                                if (userdetail2) {

                                    let kodee = userdetail2.kode_otp;
                                    //console.log(userdetail2.kode_otp);

                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'tolongbeliin0dev@gmail.com',
                                            pass: 'ndpkjmjvcppivicz'
                                        }
                                    });
            
                                    let mailOptions = {
                                        from: 'tolongbeliin0dev@gmail.com',
                                        to: payload[0].user_email,
                                        subject: 'Sending Email Tester ',
                                        text: 'That was easy! Your OTP is '+kodee.toString()+''
                                    };
            
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
            
                                            return error(req, res, {}, "Login Error Silahkan Cobalagi", true);
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

                        



                    } else if (payload[0].user_notlp != null) {
                        return success(req, res, payload, "Login Berhasil.", true);
                    } else {
                        return success(req, res, payload, "Login Berhasil.", true);
                    }

                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error Login Silahkan Cobalagi 2", false, err);
            });

    }






}


exports.cekloginKode = (req, res) => {

    let { fullname, iddevice, kodeotp } = req.body;

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
                                        expired_date: moment().add(1, 'months') || null,
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

                                    return models.user_devicelog.update({
                                        is_login: true || null,
                                        kode_otp: payload[0].kode_otp,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment().add(1, 'months') || null,
                                        update_date: moment(),

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

    let { iddevice } = req.body;

    if(iddevice != null)
    {

        let query = `select
        ul.user_fullname as fullname,
        case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
        when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
        end as emailornotlp,
        ul.user_referalcode as kodereferal,
        ud.iddevice as deviceid
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

                if(jm > 0)
                {
                    return models.user_devicelog.update({
                        expired_date: moment().add(1, 'months') || null,
                        update_date: moment(),
                    },{where: {iddevice: iddevice}})
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
                        user_update_date: moment()

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
                                expired_date: moment().add(3, 'minutes') || null,
                            })
                            .then((userdetail2) => {
                                if (userdetail2) {

                                    let kodee = userdetail2.kode_otp;
                                    //console.log(userdetail2.kode_otp);

                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'tolongbeliin0dev@gmail.com',
                                            pass: 'ndpkjmjvcppivicz'
                                        }
                                    });
            
                                    let mailOptions = {
                                        from: 'tolongbeliin0dev@gmail.com',
                                        to: payload[0].user_email,
                                        subject: 'Sending Email Tester ',
                                        text: 'Anda Melakukan Lupa Password! Your OTP is '+kodee.toString()+''
                                    };
            
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
            
                                            return error(req, res, {}, "Error Silahkan Cobalagi", true);
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
                    //     user_update_date: moment()

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
                    user_update_date: moment()

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

