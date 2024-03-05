const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../models");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");

exports.listUserAllProduct = (req, res) => {

    let { fullname, filterSatu, filterDua, filterTiga } = req.body;
    
        let query = `select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
                ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_buahsayur pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        union
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_makanan pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION 
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_elektronik pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION 
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_fashion pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION 
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_pharmacy pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION 
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_otomotif pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION 
        select 
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga, 
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko, 
                ph.alamat_toko as alamat_toko,ph.foto as foto_toko, ph.coordinate as maps_toko
        from product_matrial pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
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
                    return success(req, res, payload, "List All Produk", true);
                   
                }else{
                    
                    return success(req, res, {}, "List Produk Makanan", true);
                            
                    
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
            });
        

}

exports.listaddresstoko = (req, res) => {

        let { fullname } = req.body;
    
        let query = `select ph.*,ul.user_email from product_header ph 
        left join user_login ul on ul.user_id = ph.fk_user_id
        where ul.user_fullname = :namefull
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
                    return success(req, res, payload, "List All Produk", true);
                   
                }else{
                    
                    return success(req, res, {}, "List Produk Makanan", true);
                            
                    
                }
            })
            .catch((err) => {
                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
            });

}