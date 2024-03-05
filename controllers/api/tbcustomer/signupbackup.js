const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbcustomer");
const modelsmerchant = require("../../../models");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");
//const jwt = require('jsonwebtoken');
//const { signRefreshJwt, signAuthJwt, regenerateToken } = require("../../helpers/utility/jwt");



exports.insertSignup = (req, res) => {
    let { fullname,emailphone, referalcode, idonesignal } = req.body;
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
        select * from user_login where user_notlp = :tlp limit 1
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
                        //user_password: md5(userpass) || null,
                        user_referalcode: referalcode || null,
                    })
                        .then((userdetail) => {
                            if (userdetail) {

                                if (idonesignal == null || idonesignal == '') {
                                    return success(req, res, userdetail, "Anda Berhasil Terdaftar.", true);
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
                                                            "message": "Kode OTP anda adalah "+kodee+""
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
        select *, 1 as isemail from user_login where user_email = :emaill limit 1
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
                    return models.user_login.create({
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
        select *,2 as isemail from user_login where user_notlp = :tlp limit 1
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

                    
                        return models.user_devicelog.create({
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
                                    "message": "Kode OTP anda adalah " + kodee + ""
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
        select *,1 as isemail from user_login where user_email = :emaill limit 1
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

                    
                    return models.user_devicelog.create({
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

    let { emailphone, iddevice, kodeotp, idonesignal } = req.body;

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

            query = `select * from user_login ul 
            left join user_devicelog ud on ud.fk_userlogin = ul.user_id 
            where ul.user_notlp = :nohp and ud.jenisdokumen = 'OTP'
            and now() <= ud.expired_date and kode_otp = :otpcode
            order by ud.log_id desc
            LIMIT 1;`;

        }else if (email != null && notlp == null) {

            query = `select * from user_login ul 
            left join user_devicelog ud on ud.fk_userlogin = ul.user_id 
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

                                    return models.user_devicelog.update({
                                        is_login: true || null,
                                        kode_otp: payload[0].kode_otp,
                                        fk_userlogin: payload[0].user_id || null,
                                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                                        update_date: moment(new Date(), "YYYY-MM-DD"),
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
                    return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
                }

            })
            .catch((err) => {
                return error(req, res, {}, "Error Kode Yang Dimasukkan Salah", false, err);
            });
    }



}

exports.cekLoginIDDevice = (req, res) => {

    let { idonesignal } = req.body;

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
        from user_login ul 
                left join user_devicelog ud on ud.fk_userlogin = ul.user_id 
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
                    return models.user_devicelog.update({
                        expired_date: moment(new Date(), "YYYY-MM-DD").add(1, 'months') || null,
                        update_date: moment(new Date(), "YYYY-MM-DD"),
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
    (select sum(totalharga_produk) from tb_merchant.transaction_detail td 
    where td.fk_transaction_header = th.id_transaction_header) as totalhargapesanan,
    (select count(*) from tb_merchant.transaction_detail td 
    where td.fk_transaction_header = th.id_transaction_header) as jmlpesanan
    from tb_merchant.transaction_header th
    left join tb_merchant.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    where th.id_customer = (
    select
            ul.user_id
            from tb_customer.user_login ul 
                    left join tb_customer.user_devicelog ud on ud.fk_userlogin = ul.user_id 
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
    select produk_nama from tb_merchant.product_makanan pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    )
    when ph.kategori_id = 2 then (
    select produk_nama from tb_merchant.product_buahsayur pm where pm.produk_id = 
	(select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    when ph.kategori_id = 3 then (
    select produk_nama from tb_merchant.product_elektronik pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    when ph.kategori_id = 4 then (
    select produk_nama from tb_merchant.product_otomotif pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    when ph.kategori_id = 5 then (
    select produk_nama from tb_merchant.product_pharmacy pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    when ph.kategori_id = 6 then (
    select produk_nama from tb_merchant.product_fashion pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    when ph.kategori_id = 7 then (
    select produk_nama from tb_merchant.product_matrial pm where pm.produk_id = 
    (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
    end as namaproduk,
    case when ph.kategori_id = 1 then (
        select produk_foto from tb_merchant.product_makanan pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
        )
        when ph.kategori_id = 2 then (
        select produk_foto from tb_merchant.product_buahsayur pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        when ph.kategori_id = 3 then (
        select produk_foto from tb_merchant.product_elektronik pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        when ph.kategori_id = 4 then (
        select produk_foto from tb_merchant.product_otomotif pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        when ph.kategori_id = 5 then (
        select produk_foto from tb_merchant.product_pharmacy pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        when ph.kategori_id = 6 then (
        select produk_foto from tb_merchant.product_fashion pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        when ph.kategori_id = 7 then (
        select produk_foto from tb_merchant.product_matrial pm where pm.produk_id = 
        (select td.id_product from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)) 
        end as fotoproduk,
    (select count(td.id_transaction_detail) from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
    as totalpesanan,
    (select amount from tb_merchant.transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
    (select td.hargajual_produk from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    as hargajual_produk,
    case when ph.kategori_id = 1 then 'Makanan & Minuman'
    when ph.kategori_id = 2 then 'Buah & Sayur'
    when ph.kategori_id = 3 then 'Elektronik & Cellular'
    when ph.kategori_id = 4 then 'Otomotif'
    when ph.kategori_id = 5 then 'Pharmacy'
    when ph.kategori_id = 6 then 'Fashion & Hobby'
    when ph.kategori_id = 7 then 'Material'
    end as namakategori,
    ph.kategori_id,
    case when ph.kategori_id = 1 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/fast-food.png'
    when ph.kategori_id = 2 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/healthy-food.png'
    when ph.kategori_id = 3 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/gadgets.png'
    when ph.kategori_id = 4 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/automotive.png'
    when ph.kategori_id = 5 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/pharmacy.png'
    when ph.kategori_id = 6 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/laundry.png'
    when ph.kategori_id = 7 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/brickwall.png'
    end as photokategori,
    case when th.ket_transaction_status is null then 'Silahkan Lakukan Pembayaran' else th.ket_transaction_status end as statuspesanann,
    case when ul2.user_fullname is null then 'Silahkan Transfer' else ul2.user_fullname end as namadriver,
    th.kode_transaksi as kodetransaksi,
    (select tp.virtual_account as aa from tb_merchant.transaction_payment tp 
        where tp.id_transaction_header = th.id_transaction_header) nova,
    case when ul2.user_notlp is null then CONCAT(' ',(select CONCAT(
        (select mbl.namaBank from tb_merchant.mref_bank_linkqu mbl where mbl.kodeBank = tp.bank_code  
        LIMIT 1 ), ' ' , tp.virtual_account) as aa from tb_merchant.transaction_payment tp 
        where tp.id_transaction_header = th.id_transaction_header)) else ul2.user_notlp end as notelpdriver
    from tb_merchant.transaction_header th  
    left join tb_merchant.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    -- left join tb_merchant.transaction_detail td on th.id_transaction_header = td.fk_transaction_header 
    left join tb_merchant.product_header ph on ph.prod_id = th.id_merchant 
    left join tb_merchant.user_login ul3 on ul3.user_id = ph.fk_user_id 
    left join tb_customer.user_login ul on ul.user_id = th.id_customer 
    left join tb_driver.user_login ul2 on ul2.user_id = th.id_driver 
    where 
    ul.user_id = 
    (
        select
                ul.user_id
                from tb_customer.user_login ul 
                        left join tb_customer.user_devicelog ud on ud.fk_userlogin = ul.user_id 
                        where ud.jenisdokumen = 'LOGIN'
                        and now() <= ud.expired_date AND ud.id_onesignal = :onesignalid
                        order by ud.log_id desc
                        LIMIT 1
    ) 
    and tp.id_payment is not null
    
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
    select produk_nama from tb_merchant.product_makanan pm where pm.produk_id = 
	td.id_product    )
    when ph.kategori_id = 2 then (
    select produk_nama from tb_merchant.product_buahsayur pm where pm.produk_id = 
	td.id_product
	) 
    when ph.kategori_id = 3 then (
    select produk_nama from tb_merchant.product_elektronik pm where pm.produk_id = 
    td.id_product) 
    when ph.kategori_id = 4 then (
    select produk_nama from tb_merchant.product_otomotif pm where pm.produk_id = 
    td.id_product) 
    when ph.kategori_id = 5 then (
    select produk_nama from tb_merchant.product_pharmacy pm where pm.produk_id = 
    td.id_product) 
    when ph.kategori_id = 6 then (
    select produk_nama from tb_merchant.product_fashion pm where pm.produk_id = 
    td.id_product) 
    when ph.kategori_id = 7 then (
    select produk_nama from tb_merchant.product_matrial pm where pm.produk_id = 
    td.id_product) 
    end as namaproduk,
    case when ph.kategori_id = 1 then (
        select produk_foto from tb_merchant.product_makanan pm where pm.produk_id = 
        td.id_product
        )
        when ph.kategori_id = 2 then (
        select produk_foto from tb_merchant.product_buahsayur pm where pm.produk_id = 
        td.id_product) 
        when ph.kategori_id = 3 then (
        select produk_foto from tb_merchant.product_elektronik pm where pm.produk_id = 
        td.id_product) 
        when ph.kategori_id = 4 then (
        select produk_foto from tb_merchant.product_otomotif pm where pm.produk_id = 
        td.id_product) 
        when ph.kategori_id = 5 then (
        select produk_foto from tb_merchant.product_pharmacy pm where pm.produk_id = 
        td.id_product) 
        when ph.kategori_id = 6 then (
        select produk_foto from tb_merchant.product_fashion pm where pm.produk_id = 
        td.id_product) 
        when ph.kategori_id = 7 then (
        select produk_foto from tb_merchant.product_matrial pm where pm.produk_id = 
        td.id_product) 
        end as fotoproduk,
    (select count(td.id_transaction_detail) from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header)
    as totalpesanan,
    (select amount from tb_merchant.transaction_payment tp where tp.id_transaction_header = th.id_transaction_header limit 1) as total_harga_detail,
    (select td.hargajual_produk from tb_merchant.transaction_detail td where td.fk_transaction_header = th.id_transaction_header limit 1)
    as hargajual_produk,
    case when ph.kategori_id = 1 then 'Makanan & Minuman'
    when ph.kategori_id = 2 then 'Buah & Sayur'
    when ph.kategori_id = 3 then 'Elektronik & Cellular'
    when ph.kategori_id = 4 then 'Otomotif'
    when ph.kategori_id = 5 then 'Pharmacy'
    when ph.kategori_id = 6 then 'Fashion & Hobby'
    when ph.kategori_id = 7 then 'Material'
    end as namakategori,
    ph.kategori_id,
    case when ph.kategori_id = 1 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/fast-food.png'
    when ph.kategori_id = 2 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/healthy-food.png'
    when ph.kategori_id = 3 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/gadgets.png'
    when ph.kategori_id = 4 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/automotive.png'
    when ph.kategori_id = 5 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/pharmacy.png'
    when ph.kategori_id = 6 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/laundry.png'
    when ph.kategori_id = 7 then 'https://dev.tolongbeliin.com/public/upload/tb_merchant/brickwall.png'
    end as photokategori,
    case when th.ket_transaction_status is null then 'Silahkan Lakukan Pembayaran' else th.ket_transaction_status end as statuspesanann,
    case when ul2.user_fullname is null then 'Silahkan Transfer' else ul2.user_fullname end as namadriver,
    th.kode_transaksi as kodetransaksi,
    case when ul2.user_notlp is null then CONCAT(' ',(select CONCAT(
        (select mbl.namaBank from tb_merchant.mref_bank_linkqu mbl where mbl.kodeBank = tp.bank_code  
        LIMIT 1 ), ' ' , tp.virtual_account) as aa from tb_merchant.transaction_payment tp 
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
                ) ) AS distance
    from tb_merchant.transaction_detail td  
    left join tb_merchant.transaction_header th on th.id_transaction_header = td.fk_transaction_header 
    left join tb_merchant.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    left join tb_merchant.product_header ph on ph.prod_id = th.id_merchant 
    left join tb_merchant.user_login ul3 on ul3.user_id = ph.fk_user_id 
    left join tb_customer.user_login ul on ul.user_id = th.id_customer 
    left join tb_driver.user_login ul2 on ul2.user_id = th.id_driver 
    left join tb_merchant.mref_bank_linkqu ml on ml.id = tp.ref_id_bayar 
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
            // dataheaderquery = `delete from tb_merchant.transaction_detail where id_transaction_detail = :idtransaksii`;
            // dataheader =
            // {
            //     idtransaksii: idtransaksi 
            // }

            // return models.sequelize
            //                                 .query(dataheaderquery, {
            //                                     replacements: dataheader,
            //                                     type: QueryTypes.DELETE,
            //                         })
            return modelsmerchant.transaction_detail.destroy({where: {id_transaction_detail: idtransaksi}})
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


