const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbproduction");
const { QueryTypes } = require("sequelize");
const uploadMakanan = require("../../../middleware/uploadMakanan");
// const md5 = require("md5");
// const nodemailer = require('nodemailer');
const moment = require("moment");

exports.listUserMakanan = (req, res) => {

    let { fullname, filterSatu, filterDua, filterTiga } = req.body;

    //console.log(filterSatu, filterDua, filterTiga);

        if(filterSatu == false && filterDua == false && filterTiga == false)
        {
            filterSatu = 1;
            filterDua = 2;
            filterTiga = 3;
        }else if(filterSatu == true && filterDua == true && filterTiga == true)
        {
            filterSatu = 1;
            filterDua = 2;
            filterTiga = 3;
        }else{

            if(filterSatu == true){
                filterSatu = 1;

            }else if(filterSatu == false){
                filterSatu = null;

            }

            if(filterDua == true){
                filterDua = 2;

            }else if(filterDua == false){
                filterDua = null;

            }

            if(filterTiga == true){
                filterTiga = 3;

            }else if(filterTiga == false){
                filterTiga = null;

            }

        }


        let query = `select
        c.*,c.prod_id_header as id_toko,
        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
        ,b.biayapackaging
        from product_makanan c
        left join product_header b on b.prod_id = c.prod_id_header
        left join user_login a on a.user_id = b.fk_user_id
        where user_fullname = :namefull
        and (c.produk_kategori_id = :filterSatu or c.produk_kategori_id = :filterDua or c.produk_kategori_id = :filterTiga or c.produk_kategori_id = 0)
        and b.kategori_id = 1 order by c.produk_id asc
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    namefull: fullname,
                    filterSatu: filterSatu,
                    filterDua: filterDua,
                    filterTiga: filterTiga
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let cont = payload.length;

                if(cont > 0)
                {
                    return success(req, res, payload, "List Produk Makanan", true);

                }else{
                    let query2 = `select
                        b.prod_id as id_toko,
                        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                        from product_header b
                        left join user_login a on a.user_id = b.fk_user_id
                        where user_fullname = :namefull and b.kategori_id = 1
                        `;

                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    namefull: fullname
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;
                                if(cont2 > 0)
                                {
                                    return success(req, res, payload2, "List Produk Makanan", true);
                                }else{
                                    return success(req, res, {}, "List Produk Makanan", true);
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                            });

                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
            });


}

exports.listUserMakananbyIddevice = (req, res) => {

    let { iddevice } = req.body;


        let query = `select
        c.*,c.prod_id_header as id_toko,
        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
        from product_makanan c
        left join product_header b on b.prod_id = c.prod_id_header
        left join user_login a on a.user_id = b.fk_user_id
        left join user_devicelog ud on ud.fk_userlogin  = a.user_id
        where ud.iddevice = :iddevicee and b.kategori_id = 1 order by c.produk_id desc
        `;

        return models.sequelize
            .query(query, {
                replacements: {
                    iddevicee: iddevice
                },
                type: QueryTypes.SELECT,
            })
            .then((payload) => {
                let cont = payload.length;
                
                if(cont > 0)
                {
                    return success(req, res, payload, "List Produk Makanan", true);

                }else{
                    let query2 = `select
                    b.prod_id as id_toko,
                    b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                    from product_header b
                    left join user_login a on a.user_id = b.fk_user_id
                    left join user_devicelog ud on ud.fk_userlogin  = a.user_id
                    where ud.iddevice = :iddevicee and b.kategori_id = 1 limit 1
                        `;

                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    iddevicee: iddevice
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;
                                if(cont2 > 0)
                                {
                                    return success(req, res, payload2, "List Produk Makanan", true);
                                }else{
                                    return success(req, res, {}, "List Produk Makanan", true);
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                            });

                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
            });


}

exports.uploadFotoUserMakanan = async (req, res) => {
    try {
        await uploadMakanan(req, res);

        if (req.file == undefined) {
          return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
      }
}

exports.addUserMakanan = (req, res) => {
    try {
        let { fullname, alamat_toko, nama_toko, coordinate, kategori_id_produk, kategori_nama_produk, nama_produk, harga_produk, stok_produk, foto_produk,biayapackaging } = req.body;

            // start add makanan



            let query = `
            select
            *
            from user_login
            where user_fullname = :namefull limit 1
            `;
            return models.sequelize
                .query(query, {
                    replacements: {
                        namefull: fullname
                    },
                    type: QueryTypes.SELECT,
                })
                .then((payload) => {
                    let cont = payload.length;
                    if(cont > 0)
                    {

                        let query2 = `select b.prod_id,
                        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                        from product_header b
                        left join user_login a on a.user_id = b.fk_user_id
                        where user_fullname = :namefull2 and b.kategori_id = 1
                        `;
                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    namefull2: fullname
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;
                                let filenametoko = 'upload_icon.png';
                                    let filenameproduk = 'upload_icon.png';

                                    if(req.files[0])
                                    {
                                        filenametoko = req.files[0].filename;
                                    }

                                    if(req.files[1])
                                    {
                                        filenameproduk = req.files[1].filename;
                                    }

                                if(cont2 > 0)
                                {

                                    //let idheader = payload2.prod_id;
                                    //let idheader2 = payload2[0].prod_id;
                                    //console.log(idheader);
                                    console.log(payload2.prod_id);

                                    return models.product_makanan.create({
                                        produk_nama: nama_produk || null,
                                        produk_harga: harga_produk,
                                        produk_stok: stok_produk || null,
                                        produk_kategori_id: kategori_id_produk || null,
                                        produk_kategori_nama: kategori_nama_produk || null,
                                        produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameproduk+'' || null,
                                        prod_id_header: payload2[0].prod_id || null
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                return success(req, res, payload, "Berhasil Tambah Produk", true);
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                        });

                                }else{
                                    
                                    return models.product_header.create({
                                        fk_user_id: payload[0].user_id || null,
                                        kategori_id: 1,
                                        kategori_nama: 'MAKANAN' || null,
                                        nama_toko: nama_toko || null,
                                        alamat_toko: alamat_toko || null,
                                        foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenametoko+'' || null,
                                        coordinate: coordinate || null,
                                        biayapackaging: biayapackaging || null
                                    })
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {
                                            let idheader = userdetail2.prod_id;

                                            return models.product_makanan.create({
                                                produk_nama: nama_produk || null,
                                                produk_harga: harga_produk,
                                                produk_stok: stok_produk || null,
                                                produk_kategori_id: kategori_id_produk || null,
                                                produk_kategori_nama: kategori_nama_produk || null,
                                                produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+req.files[1].filename+'' || null,
                                                prod_id_header: idheader || null
                                            })
                                            .then((userdetail2) => {
                                                if(userdetail2)
                                                {
                                                    return success(req, res, payload, "Berhasil Tambah Produk", true);
                                                }
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                            //return success(req, res, payload, "Login Berhasil.", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                            });

                    }else{

                        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                });

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
        //     //uploadMakanan('tb_merchant/makanan');
        //     return success(req, res, {}, "List Produk Makanan", true);
        // }

        //return success(req, res, {}, "Tambah Produk Makanan Sukses", true);





    } catch (error) {
        return error(req, res, error, "Error , Silahkan Cobalagi", false, err);
    }
}

exports.NewUserMakanan = (req, res) => {
    try {
        let { fullname, alamat_toko, nama_toko, coordinate, kategori_id_produk, kategori_nama_produk, nama_produk, harga_produk, stok_produk,biayapackaging } = req.body;

            // start add makanan



            let query = `
            select
            *
            from user_login
            where user_fullname = :namefull limit 1
            `;
            return models.sequelize
                .query(query, {
                    replacements: {
                        namefull: fullname
                    },
                    type: QueryTypes.SELECT,
                })
                .then((payload) => {
                    let cont = payload.length;
                    if(cont > 0)
                    {

                        let query2 = `select b.prod_id,
                        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                        from product_header b
                        left join user_login a on a.user_id = b.fk_user_id
                        where user_fullname = :namefull2 and b.kategori_id = 1
                        `;
                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    namefull2: fullname
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;
                                let filenametoko = 'upload_icon.png';
                                if(req.files.length > 0)
                                {

                                    for(var d=0; d < req.files.length; d++)
                                    {
                                        let fieldname = req.files[d].fieldname;

                                        if(fieldname == "foto_toko")
                                        {
                                            filenametoko = req.files[d].filename;
                                        }
                                    }
                                }
                                let filenameproduk = 'upload_icon.png';

                                    // if(req.files[0])
                                    // {
                                    //     filenametoko = req.files[0].filename;
                                    // }

                                    // if(req.files[1])
                                    // {
                                    //     filenameproduk = req.files[1].filename;
                                    // }

                                if(cont2 > 0)
                                {

                                    //let idheader = payload2.prod_id;
                                    //let idheader2 = payload2[0].prod_id;
                                    //console.log(idheader);
                                    //console.log(payload2.prod_id);

                                    return models.product_makanan.create({
                                        produk_nama: nama_produk || null,
                                        produk_harga: harga_produk,
                                        produk_stok: stok_produk || null,
                                        produk_kategori_id: kategori_id_produk || null,
                                        produk_kategori_nama: kategori_nama_produk || null,
                                        produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameproduk+'' || null,
                                        prod_id_header: payload2[0].prod_id || null
                                    })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                return success(req, res, payload, "Berhasil Tambah Produk", true);
                                            }
                                        })
                                        .catch((err) => {
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                        });

                                }else{

                                    return models.product_header.create({
                                        fk_user_id: payload[0].user_id || null,
                                        kategori_id: 1,
                                        kategori_nama: 'MAKANAN' || null,
                                        nama_toko: nama_toko || null,
                                        alamat_toko: alamat_toko || null,
                                        foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenametoko+'' || null,
                                        coordinate: coordinate || null,
                                        biayapackaging: biayapackaging || null
                                    })
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {
                                            let idheader = userdetail2.prod_id;

                                            return models.product_makanan.create({
                                                produk_nama: nama_produk || null,
                                                produk_harga: harga_produk,
                                                produk_stok: stok_produk || null,
                                                produk_kategori_id: kategori_id_produk || null,
                                                produk_kategori_nama: kategori_nama_produk || null,
                                                produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameproduk+'' || null,
                                                prod_id_header: idheader || null
                                            })
                                            .then((userdetail2) => {
                                                if(userdetail2)
                                                {
                                                    return success(req, res, payload, "Berhasil Tambah Produk", true);
                                                }
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                            //return success(req, res, payload, "Login Berhasil.", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                            });

                    }else{

                        return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                });

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
        //     //uploadMakanan('tb_merchant/elektronik');
        //     return success(req, res, {}, "List Produk Makanan", true);
        // }

        //return success(req, res, {}, "Tambah Produk Makanan Sukses", true);





    } catch (error) {
        return error(req, res, error, "Error , Silahkan Cobalagi", false, err);
    }
}

exports.editUserMakanan = (req, res) => {
    try {
        let { fullname,id_toko, alamat_toko, nama_toko, coordinate, produk_id, kategori_id_produk, kategori_nama_produk, nama_produk, harga_produk, stok_produk, foto_produk, biayapackaging } = req.body;

            // start Edit makanan

            let query = `
            select
            *
            from user_login
            where user_fullname = :namefull limit 1
            `;
            return models.sequelize
                .query(query, {
                    replacements: {
                        namefull: fullname
                    },
                    type: QueryTypes.SELECT,
                })
                .then((payload) => {
                    let cont = payload.length;
                    if(cont > 0)
                    {

                        let query2 = `select b.prod_id,
                        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                        ,pb.*
                        from product_makanan pb
                        left join product_header b on b.prod_id = pb.prod_id_header
                        left join user_login a on a.user_id = b.fk_user_id
                        where user_fullname = :namefull2 and b.kategori_id = 1
                        and pb.produk_id = :produkkid
                        `;
                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    namefull2: fullname,
                                    produkkid: produk_id
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;

                                if(cont2 > 0)
                                {
                                    let filenametoko = 'upload_icon.png';
                                    let filenameproduk = 'upload_icon.png';

                                    if(req.files[0])
                                    {
                                        filenametoko = req.files[0].filename;
                                    }

                                    if(req.files[1])
                                    {
                                        filenameproduk = req.files[1].filename;
                                    }

                                    console.log(filenametoko);

                                    return models.product_header.update({
                                        nama_toko: nama_toko || null,
                                        alamat_toko: alamat_toko || null,
                                        foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenametoko+'' || null,
                                        coordinate: coordinate || null,
                                        biayapackaging: biayapackaging || null
                                    },{where: {prod_id: id_toko}})
                                    .then((userdetail2) => {
                                        if(userdetail2)
                                        {

                                            return models.product_makanan.update({
                                                produk_nama: nama_produk || null,
                                                produk_harga: harga_produk,
                                                produk_stok: stok_produk || null,
                                                produk_kategori_id: kategori_id_produk || null,
                                                produk_kategori_nama: kategori_nama_produk || null,
                                                produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameproduk+'' || null,
                                            },{where: {produk_id: produk_id}})
                                            .then((userdetail2) => {
                                                if(userdetail2)
                                                {
                                                    return success(req, res, payload2, "Berhasil Edit Produk Makanan", true);
                                                }
                                            })
                                            .catch((err) => {
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                            });

                                            //return success(req, res, payload, "Login Berhasil.", true);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }else{
                                    return error(req, res, {}, "Produk Tidak Ditemukan", false, err);
                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi 5", false, err);
                            });

                    }else{

                        return error(req, res, {}, "Error , Silahkan Cobalagi 4", false, err);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Error , Silahkan Cobalagi 3", false, err);
                });

            // end edit makanan






    } catch (error) {
        return error(req, res, error, "Error , Silahkan Cobalagi", false, err);
    }
}

exports.editbatchUserMakanan = (req, res) => {
    try {

        let { fullname,id_toko, alamat_toko, nama_toko, coordinate, dataproduk,
            kelurahan,
            kecamatan,
            kota,
            provinsi,
            kodepos,
            alamatket, lat, long, biayapackaging  } = req.body;

        //return success(req, res, dataproduk.length, "Login Berhasil.", true);
        //console.log(req.files);
        let filenametoko = 'upload_icon.png';
        if(req.files.length > 0)
        {

            for(var d=0; d < req.files.length; d++)
            {
                let fieldname = req.files[d].fieldname;

                if(fieldname == "foto_toko")
                {
                    filenametoko = req.files[d].filename;
                }
            }
        }

        console.log(filenametoko);
        console.log(fullname,id_toko, alamat_toko, nama_toko);
        //return success(req, res, dataproduk.length, "Login Berhasil.", true);


            // start Edit makanan

            let query = `
            select
            *
            from user_login
            where user_fullname = :namefull limit 1
            `;
            return models.sequelize
                .query(query, {
                    replacements: {
                        namefull: fullname
                    },
                    type: QueryTypes.SELECT,
                })
                .then((payload) => {
                    let cont = payload.length;
                    if(cont > 0)
                    {

                        let query2 = `select b.prod_id,
                        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko,a.user_foto as foto_profile, b.coordinate as maps_toko
                        ,pb.*
                        from product_makanan pb
                        left join product_header b on b.prod_id = pb.prod_id_header
                        left join user_login a on a.user_id = b.fk_user_id
                        where user_fullname = :namefull2 and b.kategori_id = 1
                        `;
                        return models.sequelize
                            .query(query2, {
                                replacements: {
                                    namefull2: fullname,
                                    produkkid: id_toko
                                },
                                type: QueryTypes.SELECT,
                            })
                            .then((payload2) => {
                                let cont2 = payload2.length;

                                if(cont2 > 0)
                                {
                                    //let filenametoko = 'upload_icon.png';
                                    let dataheader = {};
                                    let dataheaderquery = '';
                                    const point = 'Point('+parseFloat(lat)+', '+parseFloat(long)+')';
                                    if(filenametoko == "upload_icon.png")
                                    {
                                         dataheader =
                                            {
                                                nama_toko: nama_toko || null,
                                                alamat_toko: alamat_toko || null,
                                                coordinate: point || null,
                                                kelurahan: kelurahan || null,
                                                kecamatan: kecamatan || null,
                                                kota: kota || null,
                                                provinsi: provinsi || null,
                                                kodepos: kodepos || null,
                                                alamatket: alamatket || null,
                                                prod_id: payload2[0].prod_id,
                                                lat: lat || null,
                                                long: long || null,
                                                biayapackaging: biayapackaging || null,
                                            }
                                        dataheaderquery = `
                                        UPDATE product_header SET
                                        nama_toko = :nama_toko, alamat_toko = :alamat_toko,
                                        kelurahan = :kelurahan, kecamatan = :kecamatan, kota = :kota,
                                        provinsi = :provinsi, kodepos = :kodepos, alamatket = :alamatket,
                                        coordinate = Point(:lat,:long),
                                        biayapackaging = :biayapackaging
                                        WHERE prod_id = :prod_id
                                        `;



                                    }else{

                                        dataheaderquery = `
                                        UPDATE product_header SET
                                        nama_toko = :nama_toko, alamat_toko = :alamat_toko, foto = :foto,
                                        kelurahan = :kelurahan, kecamatan = :kecamatan, kota = :kota,
                                        provinsi = :provinsi, kodepos = :kodepos, alamatket = :alamatket,
                                        coordinate = Point(:lat,:long),
                                        biayapackaging = :biayapackaging
                                        WHERE prod_id = :prod_id
                                        `;

                                        dataheader =
                                            {
                                                nama_toko: nama_toko || null,
                                                alamat_toko: alamat_toko || null,
                                                foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenametoko+'' || null,
                                                //coordinate: coordinate || null,
                                                coordinate: point || null,
                                                kelurahan: kelurahan || null,
                                                kecamatan: kecamatan || null,
                                                kota: kota || null,
                                                provinsi: provinsi || null,
                                                kodepos: kodepos || null,
                                                alamatket: alamatket || null,
                                                prod_id: payload2[0].prod_id,
                                                lat: lat || null,
                                                long: long || null,
                                                biayapackaging: biayapackaging || null
                                            }
                                    }

                                    console.log(dataheader);


                                    //console.log(payload2[0].prod_id);
                                    //return models.product_header.update(dataheader,{where: {prod_id: payload2[0].prod_id}})
                                    return models.sequelize
                                            .query(dataheaderquery, {
                                                replacements: dataheader,
                                                type: QueryTypes.UPDATE,
                                    })
                                    .then(async (userdetail2) => {
                                        if(userdetail2)
                                        {
                                            //let hasil = '';
                                            //console.log(dataproduk.length);
                                            //console.log(dataproduk[0]['id_produk']);
                                            //const statements = [];
                                            if(dataproduk.length > 0)
                                            {
                                                const savedataproduk = [];
                                                const savedataproduknoimage = [];
                                                    for(var e=0; e < dataproduk.length; e++)
                                                    {
                                                        let filenameprodukk = 'upload_icon.png';
                                                        if(req.files.length > 0)
                                                        {

                                                            for(var a=0; a < req.files.length; a++)
                                                            {
                                                                let fieldname = req.files[a].fieldname;
                                                                //console.log(fieldname);
                                                                if(fieldname == "dataproduk["+e+"][foto_produk]")
                                                                {
                                                                    filenameprodukk = req.files[a].filename;
                                                                }
                                                            }
                                                        }



                                                        // statements.push(
                                                        //     models.query(
                                                        //       `UPDATE product_makanan
                                                        //       SET
                                                        //       produk_nama='${dataproduk[e]['nama_produk'] || null}' ,
                                                        //       produk_harga='${dataproduk[e]['harga_produk'] || null}' ,
                                                        //       produk_stok='${dataproduk[e]['stok_produk'] || null}' ,
                                                        //       produk_kategori_id='${dataproduk[e]['kategori_id_produk'] || null}' ,
                                                        //       produk_kategori_nama='${dataproduk[e]['kategori_nama_produk'] || null}' ,
                                                        //       produk_foto='${'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameprodukk+'' || null}'

                                                        //       WHERE produk_id=${dataproduk[e]['id_produk']};`
                                                        //     )
                                                        // );
                                                        if(filenameprodukk == "upload_icon.png")
                                                        {
                                                            savedataproduknoimage.push(
                                                                {
                                                                    'produk_id' : dataproduk[e]['produk_id'],
                                                                    'produk_nama' : dataproduk[e]['produk_nama'] || null,
                                                                    'produk_harga' : dataproduk[e]['produk_harga'] || null,
                                                                    'produk_stok' : dataproduk[e]['produk_stok'] || null,
                                                                    'produk_kategori_id' : dataproduk[e]['produk_kategori_id'] || null,
                                                                    'produk_kategori_nama' : dataproduk[e]['produk_kategori_nama'] || null,
                                                                    //'produk_foto' : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameprodukk+'' || null,
                                                                }
                                                            );
                                                        }else{
                                                            savedataproduk.push(
                                                                {
                                                                    'produk_id' : dataproduk[e]['produk_id'],
                                                                    'produk_nama' : dataproduk[e]['produk_nama'] || null,
                                                                    'produk_harga' : dataproduk[e]['produk_harga'] || null,
                                                                    'produk_stok' : dataproduk[e]['produk_stok'] || null,
                                                                    'produk_kategori_id' : dataproduk[e]['produk_kategori_id'] || null,
                                                                    'produk_kategori_nama' : dataproduk[e]['produk_kategori_nama'] || null,
                                                                    'produk_foto' : 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameprodukk+'' || null,
                                                                }
                                                            );
                                                        }


                                                        // return models.product_makanan.bulkCreate({
                                                        //     produk_nama: dataproduk[e]['nama_produk'] || null,
                                                        //     produk_harga: dataproduk[e]['harga_produk'] || null,
                                                        //     produk_stok: dataproduk[e]['stok_produk'] || null,
                                                        //     produk_kategori_id: dataproduk[e]['kategori_id_produk'] || null,
                                                        //     produk_kategori_nama: dataproduk[e]['kategori_nama_produk'] || null,
                                                        //     produk_foto: 'https://production.tolongbeliin.com/tolongbeliinapi/public/upload/tb_merchant/makanan/'+filenameprodukk+'' || null,
                                                        // },{where: {produk_id: dataproduk[e]['id_produk']}})
                                                        // .then((userdetail2) => {
                                                        //     if(userdetail2)
                                                        //     {

                                                        //     }
                                                        // })
                                                        // .catch((err) => {
                                                        //     //return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                        // });
                                                    }

                                                    //console.log(savedataproduk);

                                                    await models.product_makanan.bulkCreate(
                                                        savedataproduk,
                                                        {
                                                          updateOnDuplicate: ["produk_nama","produk_harga","produk_stok","produk_kategori_id","produk_kategori_nama","produk_foto"],
                                                        }
                                                      ).then(async (userdetail2) => {
                                                            if(userdetail2)
                                                            {
                                                                await models.product_makanan.bulkCreate(
                                                                    savedataproduknoimage,
                                                                    {
                                                                      updateOnDuplicate: ["produk_nama","produk_harga","produk_stok","produk_kategori_id","produk_kategori_nama"],
                                                                    }
                                                                  ).then((userdetail3) => {
                                                                        if(userdetail3)
                                                                        {
                                                                            return success(req, res, userdetail3, "Berhasil Simpan  "+dataproduk.length+" Produk ", true);
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                    });
                                                            }else{
                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                        });

                                                    //const result = await Promise.all(statements);
                                                    //console.log(result);


                                            }else{
                                                return success(req, res, userdetail2, "Berhasil Simpan "+dataproduk.length+" Produk ", true);
                                            }


                                            //return success(req, res, payload, "Login Berhasil.", true);
                                        }else{
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                        }
                                    })
                                    .catch((err) => {
                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                    });

                                }else{
                                    return error(req, res, {}, "Produk Tidak Ditemukan", false, err);
                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Error , Silahkan Cobalagi 5", false, err);
                            });

                    }else{

                        return error(req, res, {}, "Error , Silahkan Cobalagi 4", false, err);
                    }
                })
                .catch((err) => {
                    return error(req, res, {}, "Error , Silahkan Cobalagi 3", false, err);
                });

            // end edit makanan






    } catch (error) {
        return error(req, res, '', "Error , Silahkan Cobalagi", false, '');
    }
}

exports.deleteUserMakanan = (req, res) => {
    try {
        let { fullname,produk_id } = req.body;

        if(produk_id)
        {
            return models.product_makanan.destroy({where: {produk_id: produk_id}})
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
