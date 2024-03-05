const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../models");
const { QueryTypes } = require("sequelize");
const uploadMakanan = require("../../../middleware/uploadMakanan");
// const md5 = require("md5");
// const nodemailer = require('nodemailer');
const moment = require("moment");

exports.listUserMakanan = (req, res) => {

    let { fullname } = req.body;

    
        let query = `select 
        c.*,
        b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko, b.coordinate as maps_toko  
        from product_makanan c
        left join product_header b on b.prod_id = c.prod_id_header 
        left join user_login a on a.user_id = b.fk_user_id
        where user_fullname = :namefull and b.kategori_id = 1 order by c.produk_id asc
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
                    return success(req, res, payload, "List Produk Makanan", true);
                   
                }else{
                    return success(req, res, {}, "List Produk Makanan", true);
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

        let { fullname, foto_toko, alamat_toko, latitude_toko, longitude_toko, kategori_id_produk, kategori_nama_produk, nama_produk, harga_produk, stok_produk, foto_produk } = req.body;

        if(foto_toko != undefined)
        {
            //uploadMakanan('tb_merchant/makanan');
            return success(req, res, {}, "List Produk Makanan", true); 
        }

        return success(req, res, {}, "List Produk Makanan", true);        

        // let query = `select 
        // b.nama_toko as nama_toko, b.kategori_nama as kategori_toko, b.alamat_toko as alamat_toko,b.foto as foto_toko, b.coordinate as maps_toko  
        // from product_header b 
        // left join user_login a on a.user_id = b.fk_user_id
        // where user_fullname = :namefull and b.kategori_id = 1 order by c.produk_id asc
        // `;

        // return models.sequelize
        //     .query(query, {
        //         replacements: {
        //             namefull: fullname
        //         },
        //         type: QueryTypes.SELECT,
        //     })
        //     .then((payload) => {
        //         let cont = payload.length;

        //         if(cont > 0)
        //         {
        //             return success(req, res, payload, "List Produk Makanan", true);
                   
        //         }else{
        //             return success(req, res, {}, "List Produk Makanan", true);
        //         }
        //     })
        //     .catch((err) => {
        //         return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        //     });
        
    } catch (error) {
        return error(req, res, error, "Error , Silahkan Cobalagi", false, err);
    }
}