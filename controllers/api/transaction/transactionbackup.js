const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../models");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");

const crypto = require('crypto');


const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, tutorials, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};
  
  
exports.listproduk = (req, res) => {

    const { page, size, title, kategori_id, id_header } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';

    console.log(title);

    if(kategori_id == 1)
    {
        query = `select * FROM tb_merchant.product_makanan pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        `;
        //table = 'tb_merchant.product_makanan';

    }else if(kategori_id == 2)
    {
        // table = 'tb_merchant.product_buahsayur';
        query = `select * FROM tb_merchant.product_buahsayur pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;

    }else if(kategori_id == 3)
    {
        // table = 'tb_merchant.product_elektronik';
        query = `select * FROM tb_merchant.product_elektronik pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 4)
    {
        // table = 'tb_merchant.product_otomotif';
        query = `select * FROM tb_merchant.product_otomotif pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 5)
    {
        // table = 'tb_merchant.product_pharmacy';
        query = `select * FROM tb_merchant.product_pharmacy pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 6)
    {
        // table = 'tb_merchant.product_fashion';
        query = `select * FROM tb_merchant.product_fashion pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 7)
    {
        // table = 'tb_merchant.product_matrial';
        query = `select * FROM tb_merchant.product_matrial pm 
        left join tb_merchant.product_header ph on ph.prod_id  = pm.prod_id_header 
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }

    

    return models.sequelize
        .query(query, {
            replacements: {
                namaproduk: title ? '%'+title+'%' : '%%',
                limitt: limit,
                offsett: offset,
                idheader: id_header,
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then(data => {
            // const response = getPagingData(data, page, limit);
            // res.send(response);
            return success(req, res, data, "List All Produk", true);
        })
        .catch(err => {
            // res.status(500).send({
            //     message:
            //     err.message || "Some error occurred while retrieving tutorials."
            // });
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });

}

exports.listprodukheader = (req, res) => {

    const { page, size, title, kategori_id, longitude, latitude } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';
    console.log(longitude,latitude);

    console.log(title);

    // query = `
    //     select * FROM tb_merchant.product_header ph 
    //     where ph.kategori_id = :idkategori and ph.nama_toko like :namaproduk
    //     LIMIT :limitt OFFSET :offsett
    // `;
    query = `select 
    *
    from 
    (
    select 
    *,
    ST_X(coordinate) as latitude,
    ST_Y(coordinate) as longitude,
    ROUND(6373 * acos (cos ( radians(:latitude) ) * cos( radians( ST_X(coordinate) ) ) * 
    cos( radians( ST_Y(coordinate) ) - radians(:longitude) ) + sin ( radians(:latitude) ) * 
    sin( radians( ST_X(coordinate) ) ))) AS distance,
    case 
    	when ph.kategori_id = 1 then (select max(pm.produk_harga)  
    	from tb_merchant.product_makanan pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 2 then (select max(pm.produk_harga)  
    	from tb_merchant.product_buahsayur pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 3 then (select max(pm.produk_harga)  
    	from tb_merchant.product_elektronik pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 4 then (select max(pm.produk_harga)  
    	from tb_merchant.product_otomotif pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 5 then (select max(pm.produk_harga)  
    	from tb_merchant.product_pharmacy pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 6 then (select max(pm.produk_harga)  
    	from tb_merchant.product_fashion pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 7 then (select max(pm.produk_harga)  
    	from tb_merchant.product_matrial pm where pm.prod_id_header = ph.prod_id)
    	else 0
    end as hargamax,
    case 
    	when ph.kategori_id = 1 then (select min(pm.produk_harga)  
    	from tb_merchant.product_makanan pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 2 then (select min(pm.produk_harga)  
    	from tb_merchant.product_buahsayur pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 3 then (select min(pm.produk_harga)  
    	from tb_merchant.product_elektronik pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 4 then (select min(pm.produk_harga)  
    	from tb_merchant.product_otomotif pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 5 then (select min(pm.produk_harga)  
    	from tb_merchant.product_pharmacy pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 6 then (select min(pm.produk_harga)  
    	from tb_merchant.product_fashion pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 7 then (select min(pm.produk_harga)  
    	from tb_merchant.product_matrial pm where pm.prod_id_header = ph.prod_id)
    	else 0
    end as hargamin
    FROM tb_merchant.product_header ph 
            where ph.kategori_id = :idkategori and ph.nama_toko like :namaproduk
            ) data where data.distance <= 10
            order by data.distance asc
            LIMIT :limitt OFFSET :offsett`;

    

    return models.sequelize
        .query(query, {
            replacements: {
                namaproduk: title ? '%'+title+'%' : '%%',
                limitt: limit,
                offsett: offset,
                idkategori: kategori_id,
                longitude: longitude,
                latitude: latitude
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then(data => {

            //console.log(query);
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

exports.listprodukheadermaps = (req, res) => {

    const { page, size, title, longitude, latitude } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';

    console.log(latitude);

    // query = `
    //     select * FROM tb_merchant.product_header ph 
    //     where ph.kategori_id = :idkategori and ph.nama_toko like :namaproduk
    //     LIMIT :limitt OFFSET :offsett
    // `;
    query = `select 
    *
    from 
    (
    select 
    *,
    ST_X(coordinate) as latitude,
    ST_Y(coordinate) as longitude,
    ROUND(6373 * acos (cos ( radians(:latitude) ) * cos( radians( ST_X(coordinate) ) ) * 
    cos( radians( ST_Y(coordinate) ) - radians(:longitude) ) + sin ( radians(:latitude) ) * 
    sin( radians( ST_X(coordinate) ) ))) AS distance,
    case 
    	when ph.kategori_id = 1 then (select max(pm.produk_harga)  
    	from tb_merchant.product_makanan pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 2 then (select max(pm.produk_harga)  
    	from tb_merchant.product_buahsayur pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 3 then (select max(pm.produk_harga)  
    	from tb_merchant.product_elektronik pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 4 then (select max(pm.produk_harga)  
    	from tb_merchant.product_otomotif pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 5 then (select max(pm.produk_harga)  
    	from tb_merchant.product_pharmacy pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 6 then (select max(pm.produk_harga)  
    	from tb_merchant.product_fashion pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 7 then (select max(pm.produk_harga)  
    	from tb_merchant.product_matrial pm where pm.prod_id_header = ph.prod_id)
    	else 0
    end as hargamax,
    case 
    	when ph.kategori_id = 1 then (select min(pm.produk_harga)  
    	from tb_merchant.product_makanan pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 2 then (select min(pm.produk_harga)  
    	from tb_merchant.product_buahsayur pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 3 then (select min(pm.produk_harga)  
    	from tb_merchant.product_elektronik pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 4 then (select min(pm.produk_harga)  
    	from tb_merchant.product_otomotif pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 5 then (select min(pm.produk_harga)  
    	from tb_merchant.product_pharmacy pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 6 then (select min(pm.produk_harga)  
    	from tb_merchant.product_fashion pm where pm.prod_id_header = ph.prod_id)
    	when ph.kategori_id = 7 then (select min(pm.produk_harga)  
    	from tb_merchant.product_matrial pm where pm.prod_id_header = ph.prod_id)
    	else 0
    end as hargamin
    FROM tb_merchant.product_header ph 
            where ph.kategori_id in (1,2,3,4,5,6,7) and ph.nama_toko like :namaproduk
            ) data where data.distance <= 10
            order by data.distance asc
            LIMIT :limitt OFFSET :offsett`;

    

    return models.sequelize
        .query(query, {
            replacements: {
                namaproduk: title ? '%'+title+'%' : '%%',
                limitt: limit,
                offsett: offset,
                longitude: longitude,
                latitude: latitude
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then(data => {

            //console.log(query);
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

exports.listpesananbasket = (req, res) => {

    const { idonesignal } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    // const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';

    // console.log(title);

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
            and th.id_transaction_status is null
            and tp.id_payment is null
            limit 1;
    `;

    

    return models.sequelize
        .query(query, {
            replacements: {
                onesignalid: idonesignal
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

exports.listpesananbasketdetail = (req, res) => {

    const { idonesignal } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    // const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';

    // console.log(title);

    query = `
        select 
        td2.*,
        th.*,
        (select sum(totalharga_produk) from tb_merchant.transaction_detail td 
            where td.fk_transaction_header = th.id_transaction_header) as totalhargapesanan,
        case when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 1 then 
        (select pe.produk_nama from product_makanan pe where pe.produk_id = td2.id_product) 
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 2 then 
        (select pe.produk_nama from product_buahsayur pe where pe.produk_id = td2.id_product) 
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 3 then 
        (select pe.produk_nama from product_elektronik pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 4 then 
        (select pe.produk_nama from product_otomotif pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 5 then 
        (select pe.produk_nama from product_pharmacy pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 6 then 
        (select pe.produk_nama from product_fashion pe where pe.produk_id = td2.id_product)
        end as namaprodukk,
        case when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 1 then 
        (select pe.produk_foto from product_makanan pe where pe.produk_id = td2.id_product) 
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 2 then 
        (select pe.produk_foto from product_buahsayur pe where pe.produk_id = td2.id_product) 
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 3 then 
        (select pe.produk_foto from product_elektronik pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 4 then 
        (select pe.produk_foto from product_otomotif pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 5 then 
        (select pe.produk_foto from product_pharmacy pe where pe.produk_id = td2.id_product)
        when 
        (select ph.kategori_id from tb_merchant.product_header ph where 
        ph.prod_id = th.id_merchant ) = 6 then 
        (select pe.produk_foto from product_fashion pe where pe.produk_id = td2.id_product)
        end as fotoprodukk
        from tb_merchant.transaction_detail td2 
        left join tb_merchant.transaction_header th on th.id_transaction_header = td2.fk_transaction_header
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
        and th.id_transaction_status is null
        and tp.id_payment is null
    `;

    

    return models.sequelize
        .query(query, {
            replacements: {
                onesignalid: idonesignal
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

exports.tambahdetailpesanan = (req, res) => {

    const { idcustomer,id_product,jumlah,hargajual,stokproduk,totalharga,idmerchant,note_produk, ischange } = req.body;

    let query = '';

    // console.log(title);

    query = `
            select 
            th.*,
            (select count(*) from tb_merchant.transaction_detail td 
            where td.fk_transaction_header = th.id_transaction_header) as jmlpesanan
            from tb_merchant.transaction_header th
            left join tb_merchant.transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
            where th.id_customer = :idcustomer
            and th.id_transaction_status is null
            and tp.id_payment is null
            limit 1;
    `;

    console.log(ischange);

    

    return models.sequelize
        .query(query, {
            replacements: {
                idcustomer: idcustomer
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

                    let idheader = payload[0].id_transaction_header;
                    let cekidmerchant = payload[0].id_merchant;

                    console.log(cekidmerchant,idmerchant,idheader);

                    if(cekidmerchant == idmerchant && ischange != "true")
                    {
                        return models.transaction_detail.create({
                            id_product: id_product || null,
                            fk_transaction_header: idheader || null,
                            jumlah: jumlah || null,
                            hargajual_produk: hargajual || null,
                            totalharga_produk: totalharga || null,
                            stok_produk: stokproduk || null,
                            input_date: Date.now(), 
                            note_produk: note_produk || null
                        })
                            .then((userdetail3) => {
                                if (userdetail3) {
                                    return success(req, res, payload, "Berhasil Tambah Produk", true);
                                }
                            })
                            .catch((err) => {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                    }else if(cekidmerchant != idmerchant && ischange == "true"){

                        console.log("ok");

                        return models.transaction_detail.destroy({where: {fk_transaction_header: idheader}})
                        .then((userdetail2) => {
                            if(userdetail2)
                            {
                                return models.transaction_header.update({
                                    id_merchant: idmerchant || null,
                                },{where: {id_transaction_header: idheader}})
                                    .then((userdetail4) => {
                                        if (userdetail4) {

                                            return models.transaction_detail.create({
                                                id_product: id_product || null,
                                                fk_transaction_header: idheader || null,
                                                jumlah: jumlah || null,
                                                hargajual_produk: hargajual || null,
                                                totalharga_produk: totalharga || null,
                                                stok_produk: stokproduk || null,
                                                input_date: Date.now(), 
                                                note_produk: note_produk || null
                                            })
                                                .then((userdetail3) => {
                                                    if (userdetail3) {
                                                        return success(req, res, payload, "Berhasil Tambah Produk", true);
                                                    }
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
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });
                    
                    }else{
                        return error(req, res, {}, "1", false, '');
                    }
                                
                                

                }else{

                    return models.transaction_header.create({
                        id_customer: idcustomer || null,
                        input_date: Date.now(),
                        id_merchant: idmerchant || null,
                    })
                        .then((userdetail2) => {
                            if (userdetail2) {

                                let idheader = userdetail2.id_transaction_header;
                                
                                return models.transaction_detail.create({
                                    id_product: id_product || null,
                                    fk_transaction_header: idheader || null,
                                    jumlah: jumlah || null,
                                    hargajual_produk: hargajual || null,
                                    totalharga_produk: totalharga || null,
                                    stok_produk: stokproduk || null,
                                    input_date: Date.now(), 
                                    note_produk: note_produk || null
                                })
                                    .then((userdetail3) => {
                                        if (userdetail3) {
                                            return success(req, res, payload, "Berhasil Tambah Produk", true);
                                        }
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
        .catch(err => {
            // res.status(500).send({
            //     message:
            //     err.message || "Some error occurred while retrieving tutorials."
            // });
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });



}

exports.editdetailpesanan = (req, res) => {

    const { jumlah,hargajual,totalharga,note_produk,idtrxdetail,stokproduk } = req.body;

    let query = '';

    // console.log(title);

    query = `
            select 
            * from tb_merchant.transaction_detail td 
            where td.id_transaction_detail = :idtrx
            limit 1;
    `;
    

    return models.sequelize
        .query(query, {
            replacements: {
                idtrx: idtrxdetail
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
                    return models.transaction_detail.update({
                        jumlah : jumlah || null,
                        hargajual_produk : hargajual || null,
                        totalharga_produk : totalharga || null,
                        stok_produk : stokproduk || null,
                        note_produk : note_produk || null,
                        update_date : Date.now()
                    },{where: {id_transaction_detail: idtrxdetail}})
                        .then((userdetail4) => {


                            if(userdetail4)
                            {
                                return success(req, res, payload, "Berhasil Edit Produk", true);
                            }else{
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                            }



                    })
                    .catch((err) => {
                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                    });
            }

        })
        .catch(err => {
            // res.status(500).send({
            //     message:
            //     err.message || "Some error occurred while retrieving tutorials."
            // });
            return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });


}

exports.getbiayalainlain = (req, res) => {

    const { username, password, jarak } = req.body;
  
    if(username == "beliintolong" && password == "ghaida789")
    {
  
          let query = `select * from m_referensi mr 
          where mr.jenisdokumen in ('ongkir','layanan','jasaaplikasi','packaging')
          and :jarakk between mr.value1 and mr.value2`;
  
          return models.sequelize
          .query(query, {
              replacements: {
                  jarakk: jarak
                  // filterSatu: filterSatu,
                  // filterDua: filterDua,
                  // filterTiga: filterTiga
              },
              type: QueryTypes.SELECT,
          })
          .then(data => {
            // const response = getPagingData(data, page, limit);
            // res.send(response);
            return success(req, res, data, "List Biaya Lain Lain", true);
          })
          .catch(err => {
              // res.status(500).send({
              //     message:
              //     err.message || "Some error occurred while retrieving tutorials."
              // });
              return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
          });
  
          // let config = {
          //   method: 'get',
          //   maxBodyLength: Infinity,
          //   url: 'https://gateway-dev.linkqu.id/linkqu-partner/masterbank/list',
          //   headers: { 
          //     'client-id': 'testing', 
          //     'client-secret': '123'
          //   }
          // };
          
          // axios.request(config)
          // .then(async (response) => {
          //   // console.log(JSON.stringify(response.data));
          //   // for(i=0; i<=length(response.data.data); i++)
          //   // {
  
          //   // }
          //   await models.mref_bank_linkqu.bulkCreate(
          //     response.data.data,
          //     {
          //       updateOnDuplicate: ["kodeBank","namaBank","isActive","url_image"],
          //     }
          //   ).then(async (userdetail2) => {
  
          //     return success(req, res, response.data.data, "List All Bank", true);
  
          //   })
          //   .catch((err) => {
          //       return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
          //   }); 
            
          // })
          // .catch((error) => {
          //   return error(req, res, {}, "Error , Silahkan Cobalagi", false, error);  
          // });
          
  
    }else{
        return error(req, res, {}, "Anda Tidak Berhak Mengakses Ini", false, false); 
    }
  
    
  
  };

exports.getnotransfer = (req, res) => {

    // 'username': 'beliintolong',
    //     'password': 'ghaida789',
    //     'idmethod': widget.pembayaranForm!.id.toString(),
    //     'jumlah' : widget.totalbiaya.toString(),
    //     'idonesignal': idonesignal

    const { username, password, idmethod, jumlah, idonesignal, idtransactionheader, jarak, longitudee, latitudee, detailalamat, alamatlengkap } = req.body;
  
    if(username == "beliintolong" && password == "ghaida789")
    {

        let querycekmethod = `select * from tb_merchant.mref_bank_linkqu mbl 
        where mbl.id = :idd limit 1`;
  
          return models.sequelize
          .query(querycekmethod, {
              replacements: {
                  idd: idmethod
                  // filterSatu: filterSatu,
                  // filterDua: filterDua,
                  // filterTiga: filterTiga
              },
              type: QueryTypes.SELECT,
          })
          .then((data) => {

                let count = data.length;

                if(count > 0)
                {

                    if(data[0].type_kode == "va")
                    {

                        let query2 = `
                        select 
                        th.*,
                        ul.user_fullname,
                        ul.user_email,
                        ul.user_id,
                        ul.user_notlp,
                        DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl
                        from tb_merchant.transaction_header th
                        left join tb_customer.user_login ul on ul.user_id = th.id_customer 
                        where th.id_transaction_header = :idheader`;

                        return models.sequelize
                        .query(query2, {
                            replacements: {
                                idheader: parseInt(idtransactionheader)
                                // filterSatu: filterSatu,
                                // filterDua: filterDua,
                                // filterTiga: filterTiga
                            },
                            type: QueryTypes.SELECT,
                        })
                        .then((data2) => {

                                let count = data2.length;

                                if(count > 0)
                                {

                                    const regex = '/[^0-9a-zA-Z]/g';
                                    const path = "/transaction/create/va";
                                    const method = "POST";
                                    //const clientID = "testing";
                                    const serverKey = "LinkQu@2020";
                                    const amount = jumlah;
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
                                    console.log(""+data[0].namaBank+""+data2[0].user_fullname+""+data2[0].user_id+""+data2[0].id_transaction_header+"");
                                    const expired = data2[0].tgl;
                                    const bankcode = data[0].kodeBank;
                                    const partner_reff = ""+data2[0].user_fullname+""+data2[0].user_id+""+data2[0].id_transaction_header+"";
                                    const customer_id = ""+data2[0].user_id+"0000";
                                    const customer_name = data2[0].user_fullname;
                                    const customer_email = data2[0].user_email;
                                    const clien_id = "testing";

                                    

                                    
                                    
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
                                        "amount": jumlah,
                                        "partner_reff": partner_reff.replace(/\s/g,""),
                                        "customer_id": ""+data2[0].user_id+"0000",
                                        "customer_name": data2[0].user_fullname,
                                        "expired": expired,
                                        "username": "LI307GXIN",
                                        "pin": "2K2NPCBBNNTovgB",
                                        "customer_phone": (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp,
                                        "customer_email": data2[0].user_email,
                                        "bank_code": data[0].kodeBank,
                                        "signature": signature
                                        });

                                        let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://gateway-dev.linkqu.id/linkqu-partner/transaction/create/va',
                                        headers: { 
                                            'client-id': 'testing', 
                                            'client-secret': '123', 
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

                                                let query5 = `
                                                select * from transaction_payment where id_transaction_header = :idheader`;

                                                return models.sequelize
                                                .query(query5, {
                                                    replacements: {
                                                        idheader: parseInt(idtransactionheader)
                                                        // filterSatu: filterSatu,
                                                        // filterDua: filterDua,
                                                        // filterTiga: filterTiga
                                                    },
                                                    type: QueryTypes.SELECT,
                                                })
                                                .then((datapaymentt) => {

                                                    let cot = datapaymentt.length;

                                                    if(cot == 0)
                                                    {

                                                        return models.transaction_payment.create({
                                                            id_transaction_header: idtransactionheader || null,
                                                            amount: amount || null,
                                                            customer_nama: customer_name|| null,
                                                            customer_id: customer_id || null,
                                                            partner_reff: partner_reff || null,
                                                            expired: expired || null,
                                                            customer_phone: (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp || null,
                                                            customer_email: customer_email || null,
                                                            bank_code: bankcode || null,
                                                            username: "LI307GXIN" || null,
                                                            pin: "2K2NPCBBNNTovgB" || null,
                                                            virtual_account: ""+response.data.virtual_account+"" || null,
                                                            signature: ""+response.data.signature+"" || null,
                                                            ref_id_bayar: data[0].id || null
                                                        })
                                                            .then((userdetail) => {
                                                                if (userdetail) {

                                                                    const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';

                                                                    dataheader =
                                                                        {
                                                                            point : point || null,
                                                                            detailalamat: detailalamat || null,
                                                                            alamatlengkap_customer: alamatlengkap || null,
                                                                            idtransactionheader: idtransactionheader || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee
                                                                        }
                                                                    dataheaderquery = `
                                                                    UPDATE tb_merchant.transaction_header SET 
                                                                    coordinate_customer = Point(:latitudee, :longitudee),
                                                                    detail_alamatcustomer = :detailalamat,
                                                                    alamatlengkap_customer = :alamatlengkap_customer
                                                                    where id_transaction_header = :idtransactionheader
                                                                    `;


                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.UPDATE,
                                                                    })
                                                                    .then(async (userdetail2) => {
                                                                        if(userdetail2){

                                                                            return success(req, res, userdetail2, "Berhasil", true);

                                                                        }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                    });

                                    
                                                                   // return success(req, res, userdetail, "Berhasil.", true);
                                    
                                    
                                                                }
                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                                                            })
                                                            .catch((err) => {
                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                            });

                                                    }else{

                                                        const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';

                                                                    dataheader =
                                                                        {
                                                                            point : point || null,
                                                                            detailalamat: detailalamat || null,
                                                                            alamatlengkap_customer: alamatlengkap || null,
                                                                            idtransactionheader: idtransactionheader || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee
                                                                        }
                                                                    dataheaderquery = `
                                                                    UPDATE tb_merchant.transaction_header SET 
                                                                    coordinate_customer = Point(:latitudee, :longitudee),
                                                                    detail_alamatcustomer = :detailalamat,
                                                                    where id_transaction_header = :idtransactionheader
                                                                    `;

                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.UPDATE,
                                                                    })
                                                                    .then(async (userdetail2) => {
                                                                        if(userdetail2){

                                                                            return success(req, res, userdetail2, "Berhasil", true);

                                                                        }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                    });

                                                        // return success(req, res, datapaymentt, "Berhasil.", true);

                                                    }

                                                    

                                                })
                                                .catch((err) => {
                                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                });



                                                

                                            }else if(response.data.status == "FAILED" && response.data.response_desc == "Partner Reff Already Registered")
                                            {



                                                let query5 = `
                                                select * from transaction_payment where id_transaction_header = :idheader`;

                                                return models.sequelize
                                                .query(query5, {
                                                    replacements: {
                                                        idheader: parseInt(idtransactionheader)
                                                        // filterSatu: filterSatu,
                                                        // filterDua: filterDua,
                                                        // filterTiga: filterTiga
                                                    },
                                                    type: QueryTypes.SELECT,
                                                })
                                                .then((datapaymentt) => {

                                                    let cot = datapaymentt.length;

                                                    if(cot == 0)
                                                    {

                                                        return models.transaction_payment.create({
                                                            id_transaction_header: idtransactionheader || null,
                                                            amount: amount || null,
                                                            customer_nama: customer_name|| null,
                                                            customer_id: customer_id || null,
                                                            partner_reff: partner_reff || null,
                                                            expired: expired || null,
                                                            customer_phone: (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp || null,
                                                            customer_email: customer_email || null,
                                                            bank_code: bankcode || null,
                                                            username: "LI307GXIN" || null,
                                                            pin: "2K2NPCBBNNTovgB" || null,
                                                            virtual_account: ""+response.data.virtual_account+"" || null,
                                                            signature: ""+response.data.signature+"" || null,
                                                            ref_id_bayar: data[0].id || null
                                                        })
                                                            .then((userdetail) => {
                                                                if (userdetail) {
                                    
                                                                    const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';

                                                                    dataheader =
                                                                        {
                                                                            point : point || null,
                                                                            detailalamat: detailalamat || null,
                                                                            alamatlengkap_customer: alamatlengkap || null,
                                                                            idtransactionheader: idtransactionheader || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee
                                                                        }
                                                                    dataheaderquery = `
                                                                    UPDATE tb_merchant.transaction_header SET 
                                                                    coordinate_customer = Point(:latitudee, :longitudee),
                                                                    detail_alamatcustomer = :detailalamat,
                                                                    alamatlengkap_customer = :alamatlengkap_customer
                                                                    where id_transaction_header = :idtransactionheader
                                                                    `;


                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.UPDATE,
                                                                    })
                                                                    .then(async (userdetail2) => {
                                                                        if(userdetail2){

                                                                            return success(req, res, datapaymentt, "Berhasil", true);

                                                                        }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                    });
                                    
                                    
                                                                }
                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                                                            })
                                                            .catch((err) => {
                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                            });

                                                    }else{

                                                        const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';

                                                                dataheader =
                                                                {
                                                                    point : point || null,
                                                                    detailalamat: detailalamat || null,
                                                                    alamatlengkap_customer: alamatlengkap || null,
                                                                    idtransactionheader: idtransactionheader || null,
                                                                    latitudee: latitudee,
                                                                    longitudee: longitudee
                                                                }
                                                            dataheaderquery = `
                                                            UPDATE tb_merchant.transaction_header SET 
                                                            coordinate_customer = Point(:latitudee, :longitudee),
                                                            detail_alamatcustomer = :detailalamat,
                                                            alamatlengkap_customer = :alamatlengkap_customer
                                                            where id_transaction_header = :idtransactionheader
                                                            `;


                                                                    return models.sequelize
                                                                            .query(dataheaderquery, {
                                                                                replacements: dataheader,
                                                                                type: QueryTypes.UPDATE,
                                                                    })
                                                                    .then(async (userdetail2) => {
                                                                        if(userdetail2){

                                                                            return success(req, res, datapaymentt, "Berhasil", true);

                                                                        }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                                    });

                                                        //return success(req, res, datapaymentt, "Berhasil.", true);

                                                    }

                                                    

                                                })
                                                .catch((err) => {
                                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                });

                                            }else{
                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                            }

                                        })
                                        .catch((error) => {
                                        console.log(error);
                                        });



                                }else{

                                    return error(req, res, {}, "Error , Silahkan Cobalagi", false, false);

                                }
                            })
                        .catch(err => {
                                // res.status(500).send({
                                //     message:
                                //     err.message || "Some error occurred while retrieving tutorials."
                                // });
                                return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
                            });

                        

                    }

                    

                }else{

                    return error(req, res, {}, "Error , Silahkan Cobalagi", false, false);

                }

          })
          .catch(err => {
              // res.status(500).send({
              //     message:
              //     err.message || "Some error occurred while retrieving tutorials."
              // });
              return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
          });
        

        

  
        //   let query = `select * from m_referensi mr 
        //   where mr.jenisdokumen in ('ongkir','layanan','jasaaplikasi','packaging')
        //   and :jarakk between mr.value1 and mr.value2`;
  
        //   return models.sequelize
        //   .query(query, {
        //       replacements: {
        //           jarakk: jarak
        //           // filterSatu: filterSatu,
        //           // filterDua: filterDua,
        //           // filterTiga: filterTiga
        //       },
        //       type: QueryTypes.SELECT,
        //   })
        //   .then(data => {
        //     // const response = getPagingData(data, page, limit);
        //     // res.send(response);
            
        //     // const axios = require('axios');
        //     // let data = JSON.stringify({
        //     // "amount": jumlah,
        //     // "partner_reff": "bcayudha11510",
        //     // "customer_id": "318571161",
        //     // "customer_name": "YUDHA",
        //     // "expired": "20230719230000",
        //     // "username": "LI307GXIN",
        //     // "pin": "2K2NPCBBNNTovgB",
        //     // "customer_phone": "081231857418",
        //     // "customer_email": "cto@linkqu.id",
        //     // "bank_code": "014",
        //     // "signature": "d7aa4dabdaeece540854ab24d5f4375f0b95eb81b979f4ec9d6fd80434c63566"
        //     // });

        //     // let config = {
        //     // method: 'post',
        //     // maxBodyLength: Infinity,
        //     // url: 'https://gateway-dev.linkqu.id/linkqu-partner/transaction/create/va',
        //     // headers: { 
        //     //     'client-id': 'testing', 
        //     //     'client-secret': '123', 
        //     //     'Content-Type': 'application/json'
        //     // },
        //     // data : data
        //     // };

        //     // axios.request(config)
        //     // .then((response) => {
        //     // console.log(JSON.stringify(response.data));
        //     // })
        //     // .catch((error) => {
        //     // console.log(error);
        //     // });
        //     return success(req, res, data, "List Biaya Lain Lain", true);

        //   })
        //   .catch(err => {
        //       // res.status(500).send({
        //       //     message:
        //       //     err.message || "Some error occurred while retrieving tutorials."
        //       // });
        //       return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        //   });
  
          
          
  
    }else{
        return error(req, res, {}, "Anda Tidak Berhak Mengakses Ini", false, false); 
    }
  
    
  
  };

exports.getdetaillokasi = (req, res) => {

   // https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.latitude.toString()+','+position.longitude.toString()+'&key=AIzaSyCsfX0_N2oDsDoxkN7FXDixoeJIwV9AgGI
   const { latitude, longitude  } = req.body;

   const axios = require('axios');

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key=AIzaSyCsfX0_N2oDsDoxkN7FXDixoeJIwV9AgGI',
    headers: { }
    };

    axios.request(config)
    .then((response) => {

    //console.log(JSON.stringify(response.data));
        console.log(response.data);
        
        return success(req, res, response.data, "Berhasil.", true);

    })
    .catch((error) => {

        return error(req, res, { result: [] }, "Gagal.", false, false);

    });
}
 


