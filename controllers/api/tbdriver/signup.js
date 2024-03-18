const { error, success } = require("../../../helpers/utility/response");
// const models = require("../../../modelstbdriver");

const models = require("../../../modelstbproduction");

const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");

const crypto = require('crypto');

// const models = require("../../../models");
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
        select * from user_login_driver where user_notlp = :tlp or user_fullname = :namee limit 1
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

                    return models.user_login_driver.create({
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
                                    return models.user_devicelog_driver.create({
                                        jenisdokumen: 'LOGIN' || null,
                                        iddevice: iddevice || null,
                                        is_login: true || null,
                                        fk_userlogin: userdetail[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                dataheader =
                                                                        {
                                                                            fk_userlogin: userdetail[0].user_id,
                                                                            iddevice: iddevice
                                                                        }
                                                                    dataheaderquery = `
                                                                    DELETE from user_devicelog_driver where fk_userlogin = :fk_userlogin
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
        select * from user_login_driver where user_email = :emaill or user_fullname = :namee limit 1
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
                    return models.user_login_driver.create({
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

                                    return models.user_devicelog_driver.create({
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
                                                    text: `   Kode OTP Anda untuk masuk adalah: `+ kodee.toString() +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for Your OTP Code for login is: `+ kodee.toString() +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
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
                                    // return models.user_devicelog_driver.create({
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
    select * from user_login_driver where user_fullname = :nama and user_password = :pass limit 1
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

                        return models.user_devicelog_driver.create({
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
                                        text: `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for
                                        login is: `+ kodee +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`,
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
                                                "message": `   Kode OTP Anda untuk masuk adalah: `+ kodee +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n   Your OTP Code for login is: `+ kodee.toString() +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
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
                                                        return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                    }
                                                //return success(req, res, JSON.stringify(response.data), "Kode OTP Berhasil Dikirim", true);
                                                })
                                                .catch((error) => {
                                                    return error(req, res, {}, "Signup Error Silahkan Cobalagi", true, error);
                                                });

                                            }
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

        let query = `select * from user_login_driver ul
        left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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
                    
                    let querycekdevice =  `select * from user_devicelog_driver where iddevice = :deviceid and jenisdokumen = 'LOGIN' limit 1`;

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
                                return models.user_devicelog_driver.create({
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
                                        dataheader =
                                                                    {
                                                                        fk_userlogin: payload[0].user_id,
                                                                        iddevice: iddevice
                                                                    }
                                                                dataheaderquery = `
                                                                DELETE from user_devicelog_driver where fk_userlogin = :fk_userlogin
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
                                // moment.updateLocale('en', null);

                                return models.user_devicelog_driver.update({
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
        (select th.id_transaction_header from production_tolongbeliin.transaction_header th where th.id_driver = ul.user_id
            and th.id_transaction_status in (0,1,2,3,4) limit 1
        ) as transaksi
        from user_login_driver ul
                left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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
                     update user_devicelog_driver set expired_date = DATE_ADD(now(), INTERVAL 1 MONTH), update_date = now(),
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
                                 // from user_login_driver ul
                                 //         left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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
 
                                         return success(req, res, payload, "Berhasil", true);
 
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
                            // return models.user_devicelog_driver.update({
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
                let query = `select * from user_login_driver where user_fullname = :namefull and user_password = :passwordLama limit 1`;
        
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
                            return models.user_login_driver.update({
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
                let query = `select * from user_login_driver where user_fullname = :namefull limit 1`;
        
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
                                    return models.user_devicelog_driver.create({
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
                            // return models.user_login_driver.update({
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
                let query = `select * from user_login_driver ul
                left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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
                            return models.user_devicelog_driver.update({
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
        
                let query = `select * from user_login_driver ul
                left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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
                        return models.user_login_driver.update({
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
                nama_kendaraan,nomor_kendaraan, jenis_driver, tgl_aktif_sim, user_id, userpass, alamat, username } = req.body;
        
                console.log(merchantid);
        
                if(!merchantid)
                {

                    let filesim = 'upload_icon.png';
                            let filestnk = 'upload_icon.png';
                            let fileProfile = 'upload_icon.png';
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
                                    filesim = req.files[0].filename;
                                    filestnk = req.files[1].filename;
                                }

                                if(req.files.length == 3)
                                {
                                    fileProfile = req.files[2].filename;
                                    filestnk = req.files[1].filename;
                                    filesim = req.files[0].filename;
                                }






                            }

                            console.log(req.files);

                    if(!user_id)
                    {

                        let query = `
                        select * from user_login_driver where (user_fullname = :namefull or username = :username) and ( user_email = :emaill or user_notlp = :notelp ) limit 1
                        `;

                        return models.sequelize
                            .query(query, {
                                replacements: {
                                    namefull: user_fullname,
                                    emaill: user_email,
                                    notelp: user_notlp,
                                    username: username
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload) => {
                                let cont = payload.length;
                                if(cont < 1)
                                {
                                    


                                    return models.user_login_driver.create({
                                        user_fullname: user_fullname || null,
                                        user_email: user_email || null,
                                        user_notlp: user_notlp || null,
                                        //user_password: md5(fullname) || null,
                                        nama_kendaraan: nama_kendaraan || null,
                                        nomor_kendaraan: nomor_kendaraan,
                                        jenis_driver: jenis_driver || null,
                                        user_password: md5(userpass) || null,
                                        foto_link_sim: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filesim+'' || null,
                                        foto_link_stnk: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filestnk+'' || null,
                                        tgl_aktif_sim: tgl_aktif_sim || null,
                                        //merchant_id: merchantid || null,
                                        alamat: alamat || null,
                                        username: username || null,
                                        foto_link_profile: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+fileProfile+'' || null,
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {

                                                if(!merchantid)
                                                {
                                                    // moment.updateLocale('en', null);

                                                    return models.user_devicelog_driver.create({
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
                                                                    text: `   Kode OTP Anda untuk masuk adalah: `+ kodee.toString() +` \n\nHarap gunakan kode ini untuk masuk ke akun Anda dalam 10 menit ke depan. \n\nJika Anda tidak meminta kode ini, silakan abaikan pesan ini. \n\n========================= \n\n Your OTP Code for login is: `+ kodee.toString() +` \n\nPlease use this code to log in to your account within the next few minutes. \n\nIf you didn't request this code, please ignore this message.`
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
    
                                return models.user_login_driver.update({
                                    user_fullname: user_fullname || null,
                                    user_email: user_email || null,
                                    user_notlp: user_notlp || null,
                                    user_password: md5(userpass) || null,
                                    nama_kendaraan: nama_kendaraan || null,
                                    nomor_kendaraan: nomor_kendaraan,
                                    jenis_driver: jenis_driver || null,
                                    user_update_date: Date.now(),
                                    foto_link_sim: (filesim = 'upload_icon.png') ? filesim : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filesim+'',
                                    foto_link_stnk: (filestnk = 'upload_icon.png') ? filestnk : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filestnk+'',
                                    tgl_aktif_sim: tgl_aktif_sim || null,
                                    merchant_id: merchantid || null,
                                    alamat: alamat || null,
                                    username: username || null,
                                    foto_link_profile: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+fileProfile+'' || null,
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
                select * from production_tolongbeliin.product_header ph
                where
                ph.prod_id = :idmerchant and 
                ph.fk_user_id = 
                (select user_id from production_tolongbeliin.user_login ul where ul.user_fullname = :namefull) `;
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



                                return models.user_login_driver.create({
                                    user_fullname: user_fullname || null,
                                    user_email: user_email || null,
                                    user_notlp: user_notlp || null,
                                    user_password: md5(fullname) || null,
                                    nama_kendaraan: nama_kendaraan || null,
                                    nomor_kendaraan: nomor_kendaraan,
                                    jenis_driver: jenis_driver || null,
                                    //user_password: md5(userpass) || null,
                                    foto_link_sim: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filesim+'' || null,
                                    foto_link_stnk: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/stnk/'+filestnk+'' || null,
                                    tgl_aktif_sim: tgl_aktif_sim || null,
                                    merchant_id: merchantid || null,
                                    alamat: alamat || null
                                })
                                .then((userdetail2) => {
                                    if (userdetail2) {

                                        if(!merchantid)
                                        {
                                            // moment.updateLocale('en', null);

                                            return models.user_devicelog_driver.create({
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

                        return models.user_login_driver.update({
                            user_fullname: user_fullname || null,
                            user_email: user_email || null,
                            user_notlp: user_notlp || null,
                            user_password: md5(fullname) || null,
                            nama_kendaraan: nama_kendaraan || null,
                            nomor_kendaraan: nomor_kendaraan,
                            jenis_driver: jenis_driver || null,
                            user_update_date: Date.now(),
                            foto_link_sim: (filesim = 'upload_icon.png') ? filesim : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filesim+'',
                            foto_link_stnk: (filestnk = 'upload_icon.png') ? filestnk : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/stnk/'+filestnk+'',
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
    



    // } catch (error) {
    //     return error(req, res, error, "Error , Silahkan Cobalagi", false, 'error');
    // }
}

exports.listaddresstoko = (req, res) => {

    let { fullname } = req.body;

    let query = `select * from production_tolongbeliin.product_header ph
    where fk_user_id = (select ul.user_id from production_tolongbeliin.user_login ul where ul.user_fullname = :namefull)
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
    from user_login_driver ul
    left join production_tolongbeliin.product_header ph on ul.merchant_id = ph.prod_id
    left join production_tolongbeliin.user_login ul2 on ul2.user_id = ph.fk_user_id
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
    where ul2.user_fullname = :namefull  and th.id_transaction_status >= 5`;

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
    select produk_nama from production_tolongbeliin.product_makanan pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 2 then (
    select produk_nama from production_tolongbeliin.product_buahsayur pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 3 then (
    select produk_nama from production_tolongbeliin.product_elektronik pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 4 then (
    select produk_nama from production_tolongbeliin.product_otomotif pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 5 then (
    select produk_nama from production_tolongbeliin.product_pharmacy pm where pm.produk_id = td.id_product)
    when ph.kategori_id = 6 then (
    select produk_nama from production_tolongbeliin.product_fashion pm where pm.produk_id = td.id_product)
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
    from production_tolongbeliin.transaction_detail td
    left join production_tolongbeliin.transaction_header th on th.id_transaction_header = td.fk_transaction_header
    left join production_tolongbeliin.product_header ph on ph.prod_id = th.id_merchant
    left join production_tolongbeliin.user_login ul3 on ul3.user_id = ph.fk_user_id
    left join user_login_customer ul on ul.user_id = th.id_customer
    left join user_login_driver ul2 on ul2.user_id = th.id_driver
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

    let query = `select * from production_tolongbeliin.transaction_header where id_transaction_header = :idtransaksi
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
                UPDATE production_tolongbeliin.transaction_header SET id_transaction_status=2,
                ket_transaction_status='Driver Sedang Menuju Merchant',input_datedriver=now(),
                coordinate_driver_ambil=Point(:lat,:long)
                WHERE id_transaction_header = :idtransaksi
                `;

                    return models.sequelize
                    .query(query, {
                        replacements: {
                            lat: lat,
                            long: long,
                            idtransaksi: id_transaksi,
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return models.transaction_header.update({
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

    let query = `select * from production_tolongbeliin.transaction_header where id_transaction_header = :idtransaksi
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
                console.log(req.files[0]);
                if(req.files[0].filename)
                {


                    return models.transaction_header.update({
                        id_transaction_status: 3 || null,
                        ket_transaction_status: 'Driver Sudah Mengambil Pesanan' || null,
                        date_driver_ambil: Date.now(),
                        foto_barang: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+req.files[0].filename+'' || null,
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

    let query = `select * from production_tolongbeliin.transaction_header where id_transaction_header = :idtransaksi
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
                UPDATE production_tolongbeliin.transaction_header SET id_transaction_status=4,
                ket_transaction_status='Driver Sedang Mengantar Pesanan',date_driver_anter=now(),
                coordinate_driver_anter=Point(:lat,:long)
                WHERE id_transaction_header = :idtransaksi
                `;

                return models.sequelize
                    .query(query, {
                        replacements: {
                            lat: lat,
                            long: long,
                            idtransaksi: id_transaksi,
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return models.transaction_header.update({
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

    let query = `select * from production_tolongbeliin.transaction_header where id_transaction_header = :idtransaksi
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
                    if(req.files[0].filename)
                {

                    query = `
                    UPDATE production_tolongbeliin.transaction_header SET id_transaction_status=5,
                    ket_transaction_status='Driver Selesai Mengantar Pesanan',date_driver_selesai=now(),
                    coordinate_driver_selesai=Point(:lat,:long),foto_barang_selesai = :foto_barang
                    WHERE id_transaction_header = :idtransaksi
                    `;

                    return models.sequelize
                        .query(query, {
                            replacements: {
                                lat: lat,
                                long: long,
                                idtransaksi: id_transaksi,
                                foto_barang: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+req.files[0].filename+'' || null,
                            },
                            type: QueryTypes.UPDATE,
                        })
                        // return models.transaction_header.update({
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


                    // return models.transaction_header.update({
                    //     id_transaction_status: 3 || null,
                    //     ket_transaction_status: 'Driver Sudah Mengambil Pesanan' || null,
                    //     date_driver_ambil: Date.now(),
                    //     foto_barang: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+req.files[0].filename+'' || null,
                    // },{where: {id_transaction_header: id_transaksi}})
                    // .then((userdetail2) => {
                    //     if(userdetail2)
                    //     {
                    //         return success(req, res, payload, "Sukses Update", true);
                    //     }
                    // })
                    // .catch((err) => {
                    //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    // });

                }else{

                    return error(req, res, {}, "Harap Foto Pesanan", false, err);
                }


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

    let query = `select * from production_tolongbeliin.transaction_header where id_transaction_header = :idtransaksi`;

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
                UPDATE production_tolongbeliin.transaction_header SET id_transaction_status=:statuss
                WHERE id_transaction_header = :idtransaksi
                `;

                    return models.sequelize
                    .query(query, {
                        replacements: {
                            // lat: lat,
                            // long: long,
                            idtransaksi: id_transaksi,
                            statuss:status
                        },
                        type: QueryTypes.UPDATE,
                    })
                    // return models.transaction_header.update({
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

exports.cekProfile = (req, res) => {

    let { iddevice,tokenfirebase} = req.body;

    let querysigin = `select ull.*,
    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
            (
            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
            (
            select case when sum(biayapihaklain) is null then 0 else sum(biayapihaklain) end as jumlah1 from transaction_header th 
		    left join m_referensi mr on mr.lineid = th.id_ref_ongkir
		    where 
		    th.id_driver = ull.user_id and 
		    th.id_transaction_status = 5
            ) as data1 join (
            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
            where tw.fk_user_driver = 
            ull.user_id and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
            ) as data2
            ) as data3) as saldoterkini,
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
            from user_login_driver ull 
    left join user_devicelog_driver udd on udd.fk_userlogin = ull.user_id
    left join transaction_withdraw tw on tw.fk_user_driver = ull.user_id 
    where udd.is_login is true 
    and ( udd.firebasetoken = :firebase or udd.iddevice = :iddevice) limit 1
    
    `;

        return models.sequelize
            .query(querysigin, {
                replacements: {
                    firebase: tokenfirebase,
                    iddevice: iddevice
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let count = payload.length;

                if (count > 0) {

                    return success(req, res, payload, "Data Profile Driver", true);

                }else {
                    return error(req, res, {}, "Error Login Silahkan Cobalagi", false, true);
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error Login Silahkan Cobalagi", false, err);
            });



}

exports.updateprofile = (req, res) => {

    let { fullname , email, notelp, bank, norek } = req.body;


        let query = `select *,(select id from mref_bank_linkqu where namaBank = :banknama and isActive is true limit 1) as refidlinkqu from user_login_driver where user_fullname = :namefull limit 1`;

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
                                            return models.user_login_driver.update({
                                                user_email: email,
                                                user_notlp: notelp,
                                                nama_bank: bank,
                                                no_rekening: norek,
                                                foto_link_profile: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_driver/sim/'+filenametoko+'' || null,
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

                                    return models.user_login_driver.update({
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

exports.logout = (req, res) => {
    let { fullname , iddevice} = req.body;


    let query = `select ul.*, ud.log_id from user_login_driver ul
    left join user_devicelog_driver ud on ud.fk_userlogin = ul.user_id
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

                return models.user_devicelog_driver.destroy({where: {log_id: payload[0].log_id}})
                .then((userdetail2) => {
                    if(userdetail2)
                    {
                        return success(req, res, payload, "Data Berhasil Di Update", true);
                    }else{
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
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

exports.historywithdraw = (req,res) => {

    let { fullname , tokenfirebase} = req.body;


    let query = `select ull.*,tw.*,
    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
            (
            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
            (
            select case when sum(biayapihaklain) is null then 0 else sum(biayapihaklain) end as jumlah1 from transaction_header th 
		    left join m_referensi mr on mr.lineid = th.id_ref_ongkir
		    where 
		    th.id_driver = ull.user_id and 
		    th.id_transaction_status = 5
            ) as data1 join (
            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
            where tw.fk_user_driver = 
            ull.user_id and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
            ) as data2
            ) as data3) as saldoterkini,
            (
                select 
                CONCAT(
                '[', 
                GROUP_CONCAT(CONCAT('"',mbl.type,'-',mbl.namaBank,'"')),
                ']'
                ) as jj 
                 from mref_bank_linkqu mbl 
                where mbl.isActive is true and (mbl.type_kode = 'va')
                
                ) as refbank,
                ull.saldopoint as point
    from user_login_driver ull 
    left join user_devicelog_driver udd on udd.fk_userlogin = ull.user_id
    left join transaction_withdraw tw on tw.fk_user_driver = ull.user_id 
    where udd.is_login is true 
    and ( udd.firebasetoken = :token or ull.user_fullname = :namefull )
    `;

    let query2 = `select ull.*,tw.*,
    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
            (
            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
            (
            select case when sum(biayapihaklain) is null then 0 else sum(biayapihaklain) end as jumlah1 from transaction_header th 
		    left join m_referensi mr on mr.lineid = th.id_ref_ongkir
		    where 
		    th.id_driver = ull.user_id and 
		    th.id_transaction_status = 5
            ) as data1 join (
            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
            where tw.fk_user_driver = 
            ull.user_id and tw.tipedokumen = 'penarikan' and tw.status in (2)
            ) as data2
            ) as data3) as saldoterkini,
            (
                select 
                CONCAT(
                '[', 
                GROUP_CONCAT(CONCAT('"',mbl.type,'-',mbl.namaBank,'"')),
                ']'
                ) as jj 
                 from mref_bank_linkqu mbl 
                where mbl.isActive is true and (mbl.type_kode = 'va' or mbl.type_kode = 'uniquecode')
            ) as refbank,
            ull.saldopoint as point   
    from transaction_withdraw tw 
    left join user_login_driver ull  on tw.fk_user_driver = ull.user_id 
    left join user_devicelog_driver udd on udd.fk_userlogin = ull.user_id
    where udd.is_login is true 
    and ( udd.firebasetoken = :token or ull.user_fullname = :namefull )
    `;

    return models.sequelize
        .query(query2, {
            replacements: {
                namefull: fullname,
                token: tokenfirebase
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;
            console.log(cont);

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
                // return success(req, res, payload, "Data Ditemukan", true);
                return models.sequelize
                        .query(query2, {
                            replacements: {
                                namefull: fullname,
                                token: tokenfirebase
                            },
                            type: QueryTypes.SELECT,
                        })
                        .then((payload5) => {
                            return success(req, res, payload5, "Data Ditemukan", true);
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Data Tidak Ditemukan", false, err);
                        });
            }else{
                return models.sequelize
                    .query(query, {
                        replacements: {
                            namefull: fullname,
                            token: tokenfirebase
                        },
                        type: QueryTypes.SELECT,
                    })
                    .then((payload2) => {
                        let cont2 = payload2.length;

                        if(cont2 > 0)
                        {
                            // for(e=0; e <= (payload2.length - 1); e++)
                            // {
                            //     let prref = '';

                            //     prref = payload2[e]['partner_ref'];

                            //     console.log(prref);
                            // }
                            return success(req, res, payload2, "Data Ditemukan", true);
                        }else{
                            let err= '404';
                            return error(req, res, {}, "Data Tidak Ditemukan", false, err);
                        }
                    })
                    .catch((err) => {
                        return error(req, res, {}, "Data Tidak Ditemukan", false, err);
                    });
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Data Tidak Ditemukan", false, err);
        });
}

exports.proseswithdraw = (req,res) => {

    let { fullname , tokenfirebase, jumlahpenarikan} = req.body;

    let query = `select ull.*,tw.*
    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
            (
            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
            (
            select case when sum(biayapihaklain) is null then 0 else sum(biayapihaklain) end as jumlah1 from transaction_header th 
		    left join m_referensi mr on mr.lineid = th.id_ref_ongkir
		    where 
		    th.id_driver = ull.user_id and 
		    th.id_transaction_status = 5
            ) as data1 join (
            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
            where tw.fk_user_driver = 
            ull.user_id and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
            ) as data2
            ) as data3) as saldoterkini,
            bmk.kodeBank as kodebank,
            bmk.id as refidlinkqu 
    from user_login_driver ull 
    left join user_devicelog_driver udd on udd.fk_userlogin = ull.user_id
    left join transaction_withdraw tw on tw.fk_user_driver = ull.user_id 
    left join mref_bank_linkqu bmk on bmk.id = ull.ref_id_linkqu
    where udd.is_login is true 
    and ( udd.firebasetoken = :token or ull.user_fullname = :namefull )
  
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
                                                            fk_user_driver: idmerchant || null, 
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

                   
                    // return success(req, res, cont, "Sukses Melakukan Penarikan, Kami akan segera transfer ke Rekening Anda", true);
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

exports.prosestopup = (req,res) => {

    let { fullname , tokenfirebase, jumlahpenarikan, bank} = req.body;

    let query = `select *,
    CONCAT(mbl.type,'-',mbl.namaBank),
    data.*,
    DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl
         from mref_bank_linkqu mbl , 
		(
        select uld.* 
        from user_devicelog_driver udd 
        left join user_login_driver uld on udd.fk_userlogin = uld.user_id
            where udd.firebasetoken = :firebase
            limit 1
        ) as data
        where mbl.isActive is true and 
        CONCAT(mbl.type,'-',mbl.namaBank)= :bankk
  
    `;

    return models.sequelize
        .query(query, {
            replacements: {
                bankk: bank,
                firebase: tokenfirebase
            },
            type: QueryTypes.SELECT,
        })
        .then((payload) => {
            let cont = payload.length;

            if(cont > 0)
            {
                                    const regex = '/[^0-9a-zA-Z]/g';
                                    const path = "/transaction/create/va";
                                    const method = "POST";
                                    //const clientID = "testing";
                                    const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
                                    const amount = (parseFloat(jumlahpenarikan) + 2500);
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
                                    console.log('topup'+(parseFloat(jumlahpenarikan) + 2500).toString()+''+payload[0].user_fullname+''+(Math.floor(100000 + Math.random() * 900000)).toString()+'');
                                    const expired = payload[0].tgl;
                                    const bankcode = payload[0].kodeBank;
                                    const partner_reff = 'topup'+(parseFloat(jumlahpenarikan) + 2500).toString()+''+payload[0].user_fullname+''+(Math.floor(100000 + Math.random() * 900000)).toString()+'';
                                    const customer_id = ""+payload[0].user_id+"0000";
                                    const customer_name = payload[0].user_fullname;
                                    const customer_email = payload[0].user_email;
                                    const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";





                                    console.log(expired);

                                    var string1 = amount+expired+bankcode+partner_reff.replace(/\s/g,"")+customer_id+customer_name+customer_email+clien_id;
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
                                        let datakirim = JSON.stringify({
                                        "amount": (parseFloat(jumlahpenarikan) + 2500),
                                        "partner_reff": partner_reff.replace(/\s/g,""),
                                        "customer_id": ""+payload[0].user_id+"0000",
                                        "customer_name": payload[0].user_fullname,
                                        "expired": expired,
                                        "username": "LI9948NTV",
                                        "pin": "JQoDvZNvd57C1l5",
                                        "customer_phone": (payload[0].user_notlp == null) ? '0' : payload[0].user_notlp,
                                        "customer_email": payload[0].user_email,
                                        "bank_code": payload[0].kodeBank,
                                        "signature": signature
                                        });

                                        let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://gateway.linkqu.id/linkqu-partner/transaction/create/va',
                                        headers: {
                                            'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0',
                                            'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN',
                                            'Content-Type': 'application/json'
                                        },
                                        data : datakirim
                                        };

                                        axios.request(config)
                                        .then((response) => {

                                            //5634010000006621



                                            console.log(JSON.stringify(response.data));
                                            if(response.data.status == "SUCCESS")
                                            {

                                                const idmerchant = payload[0].user_id;
                                                const kodebank = payload[0].namaBank;
                                                const accountno = payload[0].id.toString();
                                                return models.transaction_withdraw.create({

                                                    tanggal : moment(new Date(), "YYYY-MM-DD"),
                                                    fk_user_driver: idmerchant || null, 
                                                    tipedokumen: 'topup', 
                                                    jumlahuang: (parseFloat(jumlahpenarikan) + 2500)|| null, 
                                                    status : 1, 
                                                    status_ket: 'Permintaan Topup, \nSilahkan Transfer No Virtual Akun Berikut '+response.data.virtual_account+' \nBank '+kodebank+' ', 
                                                    fullname: fullname, 
                                                    bankcode: kodebank || null, 
                                                    accountnumber: accountno || null, 
                                                    virtualaccount: ""+response.data.virtual_account+"" || null,
                                                    signature: ""+response.data.signature+"" || null,
                                                    partner_ref: partner_reff
                                                    })
                                                    .then((userdetail) => {
                                                        if (userdetail) {
                                                            return success(req, res, payload, "Sukses Melakukan Permintaan Top up, Silahkan Transfer Ke Rekening Berikut", true);
                                                        }
                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                                                    })
                                                    .catch((err) => {
                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                    });
                                            }
                                            else{
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                            }

                                        })
                                        .catch((error) => {
                                            return error(req, res, {}, error.response_desc, false, false);
                                        });
                    

                
            }else{
                let err= '404';
                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            }
        })
        .catch((err) => {
            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        });
}

exports.cektransaksilinkqu =  (req,res) => {
    // const axios = require('axios');

    // let { partner_reff} = req.body;

    // // let partnerreff = '';

    // // partnerreff = 

    // let config = {
    // method: 'get',
    // maxBodyLength: Infinity,
    // url: 'https://gateway.linkqu.id/linkqu-partner/transaction/payment/checkstatus?username=LI9948NTV&partnerreff='+partner_reff+'',
    // headers: { 
    //     'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0', 
    //     'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN'
    // }
    // };

    // axios.request(config)
    // .then((response) => {
    //     console.log(response.data.rc);
    //     let statuss = 1;
    //     let ketstatuss = '';
    //     if(response.data.rc == "00")
    //     {
    //         statuss = 2;
    //         ketstatuss = 'TOPUP BERHASIL';

    //     }else{
    //         statuss = 3;
    //         ketstatuss = 'PEMBAYARAN ANDA GAGAL';
    //     }
    //     // return success(req, res, response.data, "Sukses", true);
    // })
    // .catch((error) => {
    // console.log(error);
    // });
    const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
    const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";
                            const path = "/transaction/withdraw/inquiry";
                            const method = "POST";
                            const accountno = "8015215387";
                            const amount = 20000;
                            const bankkode = '014';
                            var partner_reff = 'penarikan-'+'20000'+'-Yudha-8989898';
                            var string1 = amount+accountno+bankkode+partner_reff.replace(/\s/g,"")+clien_id;
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
                            "amount": amount,
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

                                        var string4 = amount+accountno+bankkode+partner_reff.replace(/\s/g,"")+inquiryreff+clien_id;
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
                                        "amount": amount,
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
                                        return success(req, res, response.data, "Sukses", true);
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


}





