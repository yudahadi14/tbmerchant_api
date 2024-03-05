const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbdriver");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");

const modelsmerchant = require("../../../models");
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
                                    return success(req, res, userdetail, "Driver Berhasil Terdaftar.", true);
                                } else {
                                    // moment.updateLocale('en', null);
                                    return models.user_devicelog.create({
                                        jenisdokumen: 'LOGIN' || null,
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: userdetail[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                return success(req, res, userdetail, "Driver Berhasil Terdaftar.", true);
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
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
                    return error(req, res, {}, "Driver Sudah Terdaftar", false, err);
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
                                  //  return success(req, res, userdetail, "Driver Berhasil Terdaftar.", true);
                                // } else {
                                    // moment.updateLocale('en', null);

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
                                                    text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                };
                        
                                                transporter.sendMail(mailOptions, function (errr, info) {
                                                    if (errr) {
                        
                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, errr);
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
                                    //             return success(req, res, userdetail, "Driver Berhasil Terdaftar.", true);
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
                    return success(req, res, {}, "Driver Sudah Terdaftar, Silahkan Login", false, err);
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
                    return error(req, res, {}, "Fullname atau Password Salah Silahkan Cek Kembali", false, true);

                } else {

                    if (payload[0].user_email != null) {

                        //console.log(Math.floor(100000 + Math.random() * 900000));
                        //let kodeotpp = Math.floor(100000 + Math.random() * 900000);

                        //console.log(kodeotpp);
                        // moment.updateLocale('en', null);

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

    let { fullname, iddevice, kodeotp, idonesignal } = req.body;

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
                                    // moment.updateLocale('en', null);
                                    return models.user_devicelog.create({
                                        jenisdokumen: 'LOGIN' || null,
                                        kode_otp: parseInt(payload.kode_otp),
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        id_onesignal: idonesignal || null,
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
                                    // moment.updateLocale('en', null);

                                    return models.user_devicelog.update({
                                        is_login: true || null,
                                        kode_otp: payload[0].kode_otp,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        update_date: Date.now(),
                                        id_onesignal: idonesignal || null,
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
                    return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, true);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
            });
    }



}

exports.cekLoginIDDevice = (req, res) => {

    let { iddevice,idonesignal,tokenfirebase,lat,long,statusaktif } = req.body;

    if(iddevice != null)
    {

        let query = `select
        ul.user_fullname as fullname,
        case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
        when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
        end as emailornotlp,
        ud.iddevice as deviceid,
        ul.*,
        ud.*,
        (select th.id_transaction_header from tb_merchant.transaction_header th where th.id_driver = ul.user_id
            and th.id_transaction_status in (0,1,2,3,4)
        ) as transaksi
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
                    // moment.updateLocale('en', null);
                    dataheader =
                    {
                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                        update_date: Date.now(),
                        firebasetoken: tokenfirebase || null,
                        id_onesignal: idonesignal || null,
                        status_aktif: (payload[0].transaksi != null) ? 1 : (statusaktif == 'true') ? 1 : 0,
                        iddevice: iddevice,
                        latitude: lat || null,
                        longitude: long || null

                    }
                    dataheaderquery = `
                    update user_devicelog set expired_date = DATE_ADD(now(), INTERVAL 1 MONTH), update_date = now(),
                    firebasetoken = :firebasetoken, id_onesignal = :id_onesignal, status_aktif = :status_aktif,
                    coordinate_alamat = Point(:latitude, :longitude)
                    where iddevice = :iddevice
                    `;


                    return models.sequelize
                        .query(dataheaderquery, {
                            replacements: dataheader,
                            type: QueryTypes.UPDATE,
                        })
                        .then(async (userdetail2) => {
                            if (userdetail2) {

                                // let query = `select
                                // ul.user_fullname as fullname,
                                // case when ul.user_email is not null and ul.user_notlp is null then ul.user_email
                                // when ul.user_email is null and ul.user_notlp is not null then ul.user_notlp
                                // end as emailornotlp,
                                // ud.iddevice as deviceid,
                                // ul.*,
                                // ud.*
                                // from user_login ul 
                                //         left join user_devicelog ud on ud.fk_userlogin = ul.user_id 
                                //         where ud.jenisdokumen = 'LOGIN'
                                //         and now() <= ud.expired_date AND ud.iddevice = :deviceid
                                //         order by ud.log_id desc
                                //         LIMIT 1;`;

                                return models.sequelize
                                    .query(query, {
                                        replacements: {
                                            deviceid: iddevice
                                        },
                                        type: QueryTypes.SELECT,
                                    })
                                    .then((payload2) => {

                                        return success(req, res, payload2, "Berhasil", true);

                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                

                            } else {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            }
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });
                    // return models.user_devicelog.update({
                    //     expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                    //     update_date: Date.now(),
                    //     firebasetoken: tokenfirebase,
                    //     id_onesignal: idonesignal,
                    //     status_aktif: statusaktif
                    // },{where: {iddevice: iddevice}})
                    // .then((userdetail2) => {
                    //     if(userdetail2)
                    //     {

                    //         return success(req, res, payload, "Login Berhasil.", true);
                    //     }
                    // })
                    // .catch((err) => {
                    //     return error(req, res, {}, "Login Expired, Silahkan Login Kembali", false, err);
                    // });
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
                        user_update_date: Date.now()

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
                        // moment.updateLocale('en', null);
                            return models.user_devicelog.create({
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
                    user_update_date: Date.now()

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

exports.addEditDriver = (req, res) => {
    // try {

        let { fullname, merchantid, user_fullname,user_email,user_notlp,
        nama_kendaraan,nomor_kendaraan, jenis_driver, tgl_aktif_sim, user_id, userpass, alamat } = req.body;

        console.log(merchantid);

        if(!merchantid)
        {

                        let filesim = 'upload_icon.png';
                                let filestnk = 'upload_icon.png';
                                if(req.files.length > 0)
                                {

                                    // for(var d=0; d < req.files.length; d++)
                                    // {
                                    //     let fieldname = req.files[d].fieldname;

                                    //     if(fieldname == "foto_sim")
                                    //     {
                                    //         filesim = req.files[d].filename;
                                    //     }

                                    //     if(fieldname == "foto_stnk")
                                    //     {
                                    //         filestnk = req.files[d].filename;
                                    //     }
                                    // }
                                    //console.log(req.files.length);
                                    if(req.files.length == 1)
                                    {
                                        filesim = req.files[0].filename;
                                    }

                                    if(req.files.length == 2)
                                    {
                                        filestnk = req.files[1].filename;
                                    }

                                    
                                    

                                }

                                console.log(user_id);

                        if(!user_id)
                        {

                            let query = `
                            select * from user_login where user_fullname = :namefull or user_email = :emaill or user_notlp = :notelp limit 1 
                            `;

                            return models.sequelize
                                .query(query, {
                                    replacements: {
                                        namefull: user_fullname,
                                        emaill: user_email,
                                        notelp: user_notlp
                                    },
                                    type: QueryTypes.SELECT,
                                })
                                .then((payload) => {
                                    let cont = payload.length;
                                    if(cont < 1)
                                    {



                                        return models.user_login.create({
                                            user_fullname: user_fullname || null,
                                            user_email: user_email || null,
                                            user_notlp: user_notlp || null,
                                            //user_password: md5(fullname) || null,
                                            nama_kendaraan: nama_kendaraan || null,
                                            nomor_kendaraan: nomor_kendaraan,
                                            jenis_driver: jenis_driver || null,
                                            user_password: md5(userpass) || null,
                                            foto_link_sim: 'https://dev.tolongbeliin.com/public/upload/tb_driver/sim/'+filesim+'' || null,
                                            foto_link_stnk: 'https://dev.tolongbeliin.com/public/upload/tb_driver/stnk/'+filestnk+'' || null,
                                            tgl_aktif_sim: tgl_aktif_sim || null,
                                            //merchant_id: merchantid || null,
                                            alamat: alamat || null
                                        })
                                            .then((userdetail2) => {
                                                if (userdetail2) {

                                                    if(!merchantid)
                                                    {
                                                        // moment.updateLocale('en', null);

                                                        return models.user_devicelog.create({
                                                            jenisdokumen: 'OTP' || null,
                                                            //iddevice: iddevice || null,
                                                            kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                                            fk_userlogin: userdetail2.user_id || null,
                                                            expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                                        })
                                                            .then((userdetail3) => {
                                                                if (userdetail3) {
                                
                                                                    let kodee = userdetail3.kode_otp;
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
                                                                        to: userdetail2.user_email,
                                                                        subject: 'Kode OTP !!! ',
                                                                        text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                                    };
                                            
                                                                    transporter.sendMail(mailOptions, function (errr, info) {
                                                                        if (errr) {
                                            
                                                                            return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, errr);
                                                                            //console.log(error);
                                                                        } else {
                                                                            return success(req, res, userdetail2, "Kode OTP Berhasil Dikirim", true);
                                                                            // console.log('Email sent: ' + info.response);
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                            .catch((err) => {
                                                                return error(req, res, {}, "Login Error Silahkan Cobalagi", false, err);
                                                            });

                                                }else{
                                                    return success(req, res, userdetail2, "Sukses Tambah Driver", true);
                                                }
                                                    
                                                    // return success(req, res, payload, "Berhasil Tambah Driver", true);
                                                }
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                    }else{
                                        return error(req, res, {}, "User Sudah Terdaftar", false, false);
                                    }

                                })
                                .catch((err) => {
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                });


                                


                        }else
                        {

                            return models.user_login.update({
                                user_fullname: user_fullname || null,
                                user_email: user_email || null,
                                user_notlp: user_notlp || null,
                                user_password: md5(userpass) || null,
                                nama_kendaraan: nama_kendaraan || null,
                                nomor_kendaraan: nomor_kendaraan,
                                jenis_driver: jenis_driver || null,
                                user_update_date: Date.now(),
                                foto_link_sim: (filesim = 'upload_icon.png') ? filesim : 'https://dev.tolongbeliin.com/public/upload/tb_driver/sim/'+filesim+'',
                                foto_link_stnk: (filestnk = 'upload_icon.png') ? filestnk : 'https://dev.tolongbeliin.com/public/upload/tb_driver/stnk/'+filestnk+'',                    
                                tgl_aktif_sim: tgl_aktif_sim || null,
                                merchant_id: merchantid || null,
                                alamat: alamat || null
                            },{where: {user_id: user_id}})
                            .then((userdetail2) => {
                                    if (userdetail2) {
                                        return success(req, res, userdetail2, "Berhasil Edit Driver", true);
                                    }
                            })
                            .catch((err) => {
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                        }

                        
                    // }else{

                    //     return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                    // }
                // })
                // .catch((err) => {
                //     return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                // });

        }else{

            let query = `
            select * from tb_merchant.product_header ph 
            where 
            ph.prod_id = :idmerchant and 
            ph.fk_user_id = 
            (select user_id from tb_merchant.user_login ul where ul.user_fullname = :namefull)  
            `;
            return models.sequelize
                .query(query, {
                    replacements: {
                        namefull: fullname,
                        idmerchant: merchantid
                    },
                    type: QueryTypes.SELECT,
                })
                .then((payload) => {
                    // let cont = payload.length;
                    // if(cont > 0)
                    // {
                        let filesim = 'upload_icon.png';
                                let filestnk = 'upload_icon.png';
                                if(req.files.length > 0)
                                {

                                    // for(var d=0; d < req.files.length; d++)
                                    // {
                                    //     let fieldname = req.files[d].fieldname;

                                    //     if(fieldname == "foto_sim")
                                    //     {
                                    //         filesim = req.files[d].filename;
                                    //     }

                                    //     if(fieldname == "foto_stnk")
                                    //     {
                                    //         filestnk = req.files[d].filename;
                                    //     }
                                    // }
                                    //console.log(req.files.length);
                                    if(req.files.length == 1)
                                    {
                                        filesim = req.files[0].filename;
                                    }

                                    if(req.files.length == 2)
                                    {
                                        filestnk = req.files[1].filename;
                                    }

                                    
                                    

                                }

                                console.log(user_id);

                        if(!user_id)
                        {

                                

                                return models.user_login.create({
                                    user_fullname: user_fullname || null,
                                    user_email: user_email || null,
                                    user_notlp: user_notlp || null,
                                    user_password: md5(fullname) || null,
                                    nama_kendaraan: nama_kendaraan || null,
                                    nomor_kendaraan: nomor_kendaraan,
                                    jenis_driver: jenis_driver || null,
                                    //user_password: md5(userpass) || null,
                                    foto_link_sim: 'https://dev.tolongbeliin.com/public/upload/tb_driver/sim/'+filesim+'' || null,
                                    foto_link_stnk: 'https://dev.tolongbeliin.com/public/upload/tb_driver/stnk/'+filestnk+'' || null,
                                    tgl_aktif_sim: tgl_aktif_sim || null,
                                    merchant_id: merchantid || null,
                                    alamat: alamat || null
                                })
                                    .then((userdetail2) => {
                                        if (userdetail2) {

                                            if(!merchantid)
                                            {
                                                // moment.updateLocale('en', null);

                                                return models.user_devicelog.create({
                                                    jenisdokumen: 'OTP' || null,
                                                    iddevice: iddevice || null,
                                                    kode_otp: Math.floor(100000 + Math.random() * 900000) || null,
                                                    fk_userlogin: userdetail2.user_id || null,
                                                    expired_date: moment(new Date(), "YYYY-MM-DD").add(3, 'minutes') || null,
                                                })
                                                    .then((userdetail3) => {
                                                        if (userdetail3) {
                        
                                                            let kodee = userdetail3.kode_otp;
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
                                                                to: userdetail2.user_email,
                                                                subject: 'Kode OTP !!! ',
                                                                text: 'That was easy! Your OTP Signup is '+kodee.toString()+''
                                                            };
                                    
                                                            transporter.sendMail(mailOptions, function (errr, info) {
                                                                if (errr) {
                                    
                                                                    return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, errr);
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

                                        }else{
                                            return success(req, res, payload, "Sukses Tambah Driver", true);
                                        }
                                            
                                            // return success(req, res, payload, "Berhasil Tambah Driver", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });


                                


                        }else
                        {

                            return models.user_login.update({
                                user_fullname: user_fullname || null,
                                user_email: user_email || null,
                                user_notlp: user_notlp || null,
                                user_password: md5(fullname) || null,
                                nama_kendaraan: nama_kendaraan || null,
                                nomor_kendaraan: nomor_kendaraan,
                                jenis_driver: jenis_driver || null,
                                user_update_date: Date.now(),
                                foto_link_sim: (filesim = 'upload_icon.png') ? filesim : 'https://dev.tolongbeliin.com/public/upload/tb_driver/sim/'+filesim+'',
                                foto_link_stnk: (filestnk = 'upload_icon.png') ? filestnk : 'https://dev.tolongbeliin.com/public/upload/tb_driver/stnk/'+filestnk+'',                    
                                tgl_aktif_sim: tgl_aktif_sim || null,
                                merchant_id: merchantid || null,
                                alamat: alamat || null
                            },{where: {user_id: user_id}})
                            .then((userdetail2) => {
                                    if (userdetail2) {
                                        return success(req, res, payload, "Berhasil Edit Driver", true);
                                    }
                            })
                            .catch((err) => {
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                        }

                        
                    // }else{

                    //     return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                    // }
                })
                .catch((err) => {
                    return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                });

        }
            

            // end add makanan

            
        //console.log(req.body.kategori_id_produk);
        //console.log(req.files[1]);

        // const fototoko = uploads("upload/tb_merchant/"+fullname+"/").any("foto_toko");
        // const fotoproduk = uploads("upload/tb_merchant/"+fullname+"/").any("foto_produk");

        // fototoko(req, res, (err) => {
        //     //return res.json({ message: "Delete Produk Makanan Sukses" });
        //     if(err)
        //     {
        //         return res.json({ message: err.message });
        //     }
        //     console.log(req.files);
        //     fotoproduk(req, res, (err) => {
        //         //return res.json({ message: "Delete Produk Makanan Sukses" });
        //         if(err)
        //         {
        //             return res.json({ message: err.message });
        //         }
        //         console.log(req.files);
        //         //next()
        //         //     return success(req, res, {}, "Tambah Produk Makanan Sukses", true); 
        //         // }
        //         return res.json({ message: "Tambah Produk Makanan Sukses" });
        //     })
        //     //console.log(req.files);
        //     //next()
        //     //     return success(req, res, {}, "Tambah Produk Makanan Sukses", true); 
        //     // }
        //     //return res.json({ message: "Tambah Produk Makanan Sukses" });
        // })
        //return res.json({ message: "Tambah Produk Makanan Sukses" });
        
        //console.log(res.req.file);

        // if(foto_toko != undefined)
        // {
        //     //uploadMakanan('tb_merchant/buahsayur');
        //     return success(req, res, {}, "List Produk Makanan", true); 
        // }

        //return success(req, res, {}, "Tambah Produk Makanan Sukses", true);        

        

        
        
    // } catch (error) {
    //     return error(req, res, error, "Error , Silahkan Cobalagi", false, 'error');
    // }
}

exports.listaddresstoko = (req, res) => {

    let { fullname } = req.body;

    let query = `select * from tb_merchant.product_header ph 
    where fk_user_id = (select ul.user_id from tb_merchant.user_login ul where ul.user_fullname = :namefull)
    order by kategori_id asc 
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
                return success(req, res, payload, "List All Toko", true);
               
            }else{
                
                return success(req, res, {}, "List Toko", true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.listdrivertoko = (req, res) => {

    let { fullname } = req.body;

    let query = `select ul.*,ph.nama_toko,ph.kategori_nama , ul2.user_email  
    from user_login ul 
    left join tb_merchant.product_header ph on ul.merchant_id = ph.prod_id 
    left join tb_merchant.user_login ul2 on ul2.user_id = ph.fk_user_id 
    where ul2.user_fullname = :namefull`;

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
                return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return success(req, res, {}, "List Toko Driver", true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.historyorder = (req, res) => {

    let { fullname } = req.body;

    let query = `select 
    td.id_transaction_detail ,
    td.jumlah ,
    td.hargajual_produk ,
    td.totalharga_produk ,
    case when ph.kategori_id = 1 then (
    select produk_nama from tb_merchant.product_makanan pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 2 then (
    select produk_nama from tb_merchant.product_buahsayur pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 3 then (
    select produk_nama from tb_merchant.product_elektronik pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 4 then (
    select produk_nama from tb_merchant.product_otomotif pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 5 then (
    select produk_nama from tb_merchant.product_pharmacy pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 6 then (
    select produk_nama from tb_merchant.product_fashion pm where pm.produk_id = td.id_product) 
    end as namaproduk,
    ul.user_fullname as namacustomer,
    ul.user_notlp as notlpcustomer,
    ph.alamat_toko ,
    ph.coordinate as coordinate_toko,
    ul3.user_notlp as notlp_toko,
    ph.nama_toko as nama_toko,
    th.id_transaction_status as statusid,
    th.ket_transaction_status as statusket,
    th.input_date as tgltransaksimulai,
    th.date_driver_selesai as tgltransaksiselesai
    from tb_merchant.transaction_detail td 
    left join tb_merchant.transaction_header th on th.id_transaction_header = td.fk_transaction_header 
    left join tb_merchant.product_header ph on ph.prod_id = th.id_merchant 
    left join tb_merchant.user_login ul3 on ul3.user_id = ph.fk_user_id 
    left join tb_customer.user_login ul on ul.user_id = th.id_customer 
    left join tb_driver.user_login ul2 on ul2.user_id = th.id_driver 
    where ul2.user_fullname = :namefull and th.id_transaction_status = 5`;

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
                return success(req, res, payload, "History Transaksi Driver", true);
               
            }else{
                
                return success(req, res, {}, "History Transaksi Driver", true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.inorder = (req, res) => {

    let { fullname } = req.body;

    let query = `select 
    th.id_transaction_header as id_transaksi ,
    td.id_transaction_detail ,
    td.jumlah ,
    td.hargajual_produk ,
    td.totalharga_produk ,
    case when ph.kategori_id = 1 then (
    select produk_nama from tb_merchant.product_makanan pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 2 then (
    select produk_nama from tb_merchant.product_buahsayur pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 3 then (
    select produk_nama from tb_merchant.product_elektronik pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 4 then (
    select produk_nama from tb_merchant.product_otomotif pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 5 then (
    select produk_nama from tb_merchant.product_pharmacy pm where pm.produk_id = td.id_product) 
    when ph.kategori_id = 6 then (
    select produk_nama from tb_merchant.product_fashion pm where pm.produk_id = td.id_product) 
    end as namaproduk,
    ul.user_fullname as namacustomer,
    ul.user_notlp as notlpcustomer,
    ph.alamat_toko ,
    ph.coordinate as coordinate_toko,
    ul3.user_notlp as notlp_toko,
    ph.nama_toko as nama_toko,
    th.id_transaction_status as statusid,
    th.ket_transaction_status as statusket,
    th.*
    from tb_merchant.transaction_detail td 
    left join tb_merchant.transaction_header th on th.id_transaction_header = td.fk_transaction_header 
    left join tb_merchant.product_header ph on ph.prod_id = th.id_merchant 
    left join tb_merchant.user_login ul3 on ul3.user_id = ph.fk_user_id 
    left join tb_customer.user_login ul on ul.user_id = th.id_customer 
    left join tb_driver.user_login ul2 on ul2.user_id = th.id_driver 
    where ul2.user_fullname = :namefull and th.id_transaction_status in (0,1,2,3,4)`;

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
                return success(req, res, payload, "List Data Driver", true);
               
            }else{
                
                return success(req, res, {}, "List Data Driver", true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.driverkonfirmasi = (req, res) => {

    let { id_transaksi, coordinate, lat, long } = req.body;

    let query = `select * from tb_merchant.transaction_header where id_transaction_header = :idtransaksi
    and id_transaction_status = 1`;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaksi: id_transaksi,
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
                // if(req.files[0].filename)
                query = `
                UPDATE tb_merchant.transaction_header SET id_transaction_status=2,
                ket_transaction_status='Driver Sedang Menuju Merchant',input_datedriver=now(),
                coordinate_driver_ambil=Point(:lat,:long)
                WHERE id_transaction_header = :idtransaksi
                `;

                    return modelsmerchant.sequelize
                    .query(query, {
                        replacements: {
                            lat: lat,
                            long: long,
                            idtransaksi: id_transaksi,
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return modelsmerchant.transaction_header.update({
                    //     id_transaction_status: 2 || null,
                    //     ket_transaction_status: 'Driver Sedang Menuju Merchant' || null,
                    //     input_datedriver: Date.now(),
                    //     coordinate_driver_anter: 'POINT(40.71727401,-74.00898606)'
                    // },{where: {id_transaction_header: id_transaksi}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, {}, "Sukses Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                // }else{
                    
                //     return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
                // }
                

                //return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.drivermengambil = (req, res) => {

    let { id_transaksi, kode_transaksi } = req.body;

    let query = `select * from tb_merchant.transaction_header where id_transaction_header = :idtransaksi
    and kode_transaksi = :kodetransaksi and id_transaction_status = 2`;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaksi: id_transaksi,
                kodetransaksi: kode_transaksi
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
                if(req.files[0].filename)
                {

                    
                    return modelsmerchant.transaction_header.update({
                        id_transaction_status: 3 || null,
                        ket_transaction_status: 'Driver Sudah Mengambil Pesanan' || null,
                        date_driver_ambil: Date.now(),
                        foto_barang: 'https://dev.tolongbeliin.com/public/upload/tb_driver/sim/'+req.files[0].filename+'' || null,
                    },{where: {id_transaction_header: id_transaksi}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Sukses Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                }else{
                    
                    return error(req, res, {}, "Harap Foto Pesanan", false, err);
                }
                

                //return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return error(req, res, {}, "Kode Transaksi Salah , Silahkan Cobalagi", false, false);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.drivermengantar = (req, res) => {

    let { id_transaksi, coordinate, lat, long } = req.body;

    let query = `select * from tb_merchant.transaction_header where id_transaction_header = :idtransaksi
    and id_transaction_status = 3`;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaksi: id_transaksi,
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
                // if(req.files[0].filename)
                // {
                query = `
                UPDATE tb_merchant.transaction_header SET id_transaction_status=4,
                ket_transaction_status='Driver Sedang Mengantar Pesanan',date_driver_anter=now(),
                coordinate_driver_anter=Point(:lat,:long)
                WHERE id_transaction_header = :idtransaksi
                `;

                return modelsmerchant.sequelize
                    .query(query, {
                        replacements: {
                            lat: lat,
                            long: long,
                            idtransaksi: id_transaksi,
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return modelsmerchant.transaction_header.update({
                    //     id_transaction_status: 4 || null,
                    //     ket_transaction_status: 'Driver Sedang Mengantar Pesanan' || null,
                    //     date_driver_anter: Date.now(),
                    //     coordinate_driver_anter: coordinate
                    // },{where: {id_transaction_header: id_transaksi}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Sukses Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                // }else{
                    
                //     return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
                // }
                

                //return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.driverselesai = (req, res) => {

    let { id_transaksi, coordinate, lat, long } = req.body;

    let query = `select * from tb_merchant.transaction_header where id_transaction_header = :idtransaksi
    and id_transaction_status = 4`;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaksi: id_transaksi,
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
                // if(req.files[0].filename)
                // {
                query = `
                UPDATE tb_merchant.transaction_header SET id_transaction_status=5,
                ket_transaction_status='Driver Selesai Mengantar Pesanan',date_driver_selesai=now(),
                coordinate_driver_selesai=Point(:lat,:long)
                WHERE id_transaction_header = :idtransaksi
                `;

                return modelsmerchant.sequelize
                    .query(query, {
                        replacements: {
                            lat: lat,
                            long: long,
                            idtransaksi: id_transaksi,
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return modelsmerchant.transaction_header.update({
                    //     id_transaction_status: 5 || null,
                    //     ket_transaction_status: 'Driver Selesai Mengantar Pesanan' || null,
                    //     date_driver_selesai: Date.now(),
                    //     coordinate_driver_selesai: coordinate
                    // },{where: {id_transaction_header: id_transaksi}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Sukses Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                // }else{
                    
                //     return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
                // }
                

                //return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.ubahstatusinorder = (req, res) => {

    let { id_transaksi, status } = req.body;

    let query = `select * from tb_merchant.transaction_header where id_transaction_header = :idtransaksi`;

    return models.sequelize
        .query(query, {
            replacements: {
                idtransaksi: id_transaksi,
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
                // if(req.files[0].filename)
                query = `
                UPDATE tb_merchant.transaction_header SET id_transaction_status=:statuss
                WHERE id_transaction_header = :idtransaksi
                `;

                    return modelsmerchant.sequelize
                    .query(query, {
                        replacements: {
                            // lat: lat,
                            // long: long,
                            idtransaksi: id_transaksi,
                            statuss:status
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return modelsmerchant.transaction_header.update({
                    //     id_transaction_status: 2 || null,
                    //     ket_transaction_status: 'Driver Sedang Menuju Merchant' || null,
                    //     input_datedriver: Date.now(),
                    //     coordinate_driver_anter: 'POINT(40.71727401,-74.00898606)'
                    // },{where: {id_transaction_header: id_transaksi}})
                    .then((userdetail2) => {
                        if(userdetail2)
                        {
                            return success(req, res, payload, "Sukses Update", true);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });

                // }else{
                    
                //     return error(req, res, {}, "Error Silahkan Cobalagi", false, err);
                // }
                

                //return success(req, res, payload, "List All Toko Driver", true);
               
            }else{
                
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, true);
                        
                
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}



