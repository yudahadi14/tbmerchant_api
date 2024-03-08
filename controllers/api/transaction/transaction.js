
const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbproduction");
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
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_makanan pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        `;
        //table = 'product_makanan';

    }else if(kategori_id == 2)
    {
        // table = 'product_buahsayur';
        query = `select *,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg  FROM product_buahsayur pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;

    }else if(kategori_id == 3)
    {
        // table = 'product_elektronik';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_elektronik pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 4)
    {
        // table = 'product_otomotif';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_otomotif pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 5)
    {
        // table = 'product_pharmacy';
        query = `select *,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_pharmacy pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 6)
    {
        // table = 'product_fashion';
        query = `select *,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_fashion pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 7)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_matrial pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 8)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_olahraga pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 9)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_ibubayi pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 10)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_atk pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 11)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_mainananak pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
        where pm.prod_id_header = :idheader and pm.produk_nama like :namaproduk
        LIMIT :limitt OFFSET :offsett
        `;
    }else if(kategori_id == 12)
    {
        // table = 'product_matrial';
        query = `select * ,
        ( select sum(nilai) / (select count(lineid) from ratings where fk_id_merchant = pm.prod_id_header) as ratingg
        from ratings r where fk_id_merchant = pm.prod_id_header
        ) as ratingg FROM product_officialstore pm
        left join product_header ph on ph.prod_id  = pm.prod_id_header
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
    //     select * FROM product_header ph
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
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select max(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select max(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select max(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select max(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select max(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select max(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select max(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select max(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select max(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select max(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select max(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamax,
    case
        when ph.kategori_id = 1 then (select min(pm.produk_harga)
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select min(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select min(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select min(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select min(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select min(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select min(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select min(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select min(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select min(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select min(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select min(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamin
    FROM product_header ph
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

exports.listprodukheaderall = (req, res) => {

    const { page, size, title, kategori_id, longitude, latitude } = req.body;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    //let table = '';
    let query = '';
    console.log(longitude,latitude);

    console.log(title);

    // query = `
    //     select * FROM product_header ph
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
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select max(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select max(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select max(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select max(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select max(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select max(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select max(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select max(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select max(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select max(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select max(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamax,
    case
        when ph.kategori_id = 1 then (select min(pm.produk_harga)
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select min(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select min(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select min(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select min(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select min(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select min(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select min(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select min(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select min(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select min(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select min(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamin
    FROM product_header ph
            where ph.nama_toko like :namaproduk
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
    //     select * FROM product_header ph
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
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select max(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select max(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select max(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select max(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select max(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select max(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select max(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select max(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select max(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select max(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select max(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamax,
    case
        when ph.kategori_id = 1 then (select min(pm.produk_harga)
        from product_makanan pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 2 then (select min(pm.produk_harga)
        from product_buahsayur pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 3 then (select min(pm.produk_harga)
        from product_elektronik pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 4 then (select min(pm.produk_harga)
        from product_otomotif pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 5 then (select min(pm.produk_harga)
        from product_pharmacy pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 6 then (select min(pm.produk_harga)
        from product_fashion pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 7 then (select min(pm.produk_harga)
        from product_matrial pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 8 then (select min(pm.produk_harga)
        from product_olahraga pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 9 then (select min(pm.produk_harga)
        from product_ibubayi pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 10 then (select min(pm.produk_harga)
        from product_atk pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 11 then (select min(pm.produk_harga)
        from product_mainananak pm where pm.prod_id_header = ph.prod_id)
        when ph.kategori_id = 12 then (select min(pm.produk_harga)
        from product_officialstore pm where pm.prod_id_header = ph.prod_id)
        else 0
    end as hargamin
    FROM product_header ph
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
            (select sum(totalharga_produk) from transaction_detail td
            where td.fk_transaction_header = th.id_transaction_header) as totalhargapesanan,
            (select count(*) from transaction_detail td
            where td.fk_transaction_header = th.id_transaction_header) as jmlpesanan
            from transaction_header th
            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
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
    (select sum(totalharga_produk) from transaction_detail td
        where td.fk_transaction_header = th.id_transaction_header) as totalhargapesanan,
    case when
    phh.kategori_id
     = 1 then
    (select pe.produk_nama from product_makanan pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 2 then
    (select pe.produk_nama from product_buahsayur pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 3 then
    (select pe.produk_nama from product_elektronik pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 4 then
    (select pe.produk_nama from product_otomotif pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 5 then
    (select pe.produk_nama from product_pharmacy pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 6 then
    (select pe.produk_nama from product_fashion pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 7 then
    (select pe.produk_nama from product_matrial pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 8 then
    (select pe.produk_nama from product_olahraga pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 9 then
    (select pe.produk_nama from product_ibubayi pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 10 then
    (select pe.produk_nama from product_atk pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 11 then
    (select pe.produk_nama from product_mainananak pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 12 then
    (select pe.produk_nama from product_officialstore pe where pe.produk_id = td2.id_product)
    end as namaprodukk,
    case when
    phh.kategori_id
     = 1 then
    (select pe.produk_foto from product_makanan pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 2 then
    (select pe.produk_foto from product_buahsayur pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 3 then
    (select pe.produk_foto from product_elektronik pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 4 then
    (select pe.produk_foto from product_otomotif pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 5 then
    (select pe.produk_foto from product_pharmacy pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 6 then
    (select pe.produk_foto from product_fashion pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 7 then
    (select pe.produk_foto from product_matrial pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 8 then
    (select pe.produk_foto from product_olahraga pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 9 then
    (select pe.produk_foto from product_ibubayi pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id
     = 10 then
    (select pe.produk_foto from product_atk pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id 
     = 11 then
    (select pe.produk_foto from product_mainananak pe where pe.produk_id = td2.id_product)
    when
    phh.kategori_id = 12 then
    (select pe.produk_foto from product_officialstore pe where pe.produk_id = td2.id_product)
    end as fotoprodukk,
    phh.*
    from transaction_detail td2
    left join transaction_header th on th.id_transaction_header = td2.fk_transaction_header
    left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
    left join product_header phh on phh.prod_id = th.id_merchant
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

    const { idcustomer,id_product,jumlah,hargajual,stokproduk,totalharga,idmerchant,note_produk, ischange,
        latitude, longitude, alamatlengkap, alamatket } = req.body;

    let query = '';

    // console.log(title);

    query = `
            select
            th.*,
            (select count(*) from transaction_detail td
            where td.fk_transaction_header = th.id_transaction_header) as jmlpesanan
            from transaction_header th
            left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
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

                    dataheader =
                    {
                        detailalamat: alamatket || null,
                        alamatlengkap_customer: alamatlengkap || null,
                        idtransactionheader: parseInt(idheader) || null,
                        latitudee: latitude,
                        longitudee: longitude
                    }
                    dataheaderquery = `
                                                                    UPDATE transaction_header SET
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
                            if (userdetail2) {

                                if (cekidmerchant == idmerchant && ischange != "true") {
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

                                } else if (cekidmerchant != idmerchant && ischange == "true") {

                                    console.log("ok");

                                    return models.transaction_detail.destroy({ where: { fk_transaction_header: idheader } })
                                        .then((userdetail2) => {
                                            if (userdetail2) {
                                                return models.transaction_header.update({
                                                    id_merchant: idmerchant || null,
                                                }, { where: { id_transaction_header: idheader } })
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

                                } else {
                                    return error(req, res, {}, "1", false, '');
                                }

                            } else {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            }
                        })
                        .catch((err) => {
                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                        });

                }else{

                    return models.transaction_header.create({
                        id_customer: idcustomer || null,
                        input_date: Date.now(),
                        id_merchant: idmerchant || null,
                    })
                        .then((userdetail2) => {
                            if (userdetail2) {

                                let idheader = userdetail2.id_transaction_header;
                                dataheader =
                                {
                                    detailalamat: alamatket || null,
                                    alamatlengkap_customer: alamatlengkap || null,
                                    idtransactionheader: parseInt(idheader) || null,
                                    latitudee: latitude,
                                    longitudee: longitude
                                }
                                dataheaderquery = `
                                                                                UPDATE transaction_header SET
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
                                        if (userdetail2) {

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

                                        } else {
                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
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
            * from transaction_detail td
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
    console.log(jarak);
    if(username == "beliintolong" && password == "ghaida789")
    {

        let querycekmethod = `select *,
        (select lineid from m_referensi mr
            where mr.jenisdokumen in ('ongkir')
            and :jarakk between mr.value1 and mr.value2 limit 1) as ref_ongkirid,
        (select lineid from m_referensi mr
                    where mr.jenisdokumen in ('layanan')
                    and :jarakk between mr.value1 and mr.value2 limit 1) as ref_layananid,
        (select lineid from m_referensi mr
                    where mr.jenisdokumen in ('jasaaplikasi')
                    and :jarakk between mr.value1 and mr.value2 limit 1) as ref_jasaid,
        (select lineid from m_referensi mr
                    where mr.jenisdokumen in ('packaging')
                    and :jarakk between mr.value1 and mr.value2 limit 1) as ref_packagingid
        from mref_bank_linkqu mbl
        where mbl.id = :idd limit 1`;

          return models.sequelize
          .query(querycekmethod, {
              replacements: {
                  idd: idmethod,
                  jarakk: parseInt(jarak)
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
                        from transaction_header th
                        left join user_login_customer ul on ul.user_id = th.id_customer
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
                                    const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
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
                                        "amount": jumlah,
                                        "partner_reff": partner_reff.replace(/\s/g,""),
                                        "customer_id": ""+data2[0].user_id+"0000",
                                        "customer_name": data2[0].user_fullname,
                                        "expired": expired,
                                        "username": "LI9948NTV",
                                        "pin": "JQoDvZNvd57C1l5",
                                        "customer_phone": (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp,
                                        "customer_email": data2[0].user_email,
                                        "bank_code": data[0].kodeBank,
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }
                                                                    dataheaderquery = `
                                                                    UPDATE transaction_header SET
                                                                    coordinate_customer = Point(:latitudee, :longitudee),
                                                                    detail_alamatcustomer = :detailalamat,
                                                                    alamatlengkap_customer = :alamatlengkap_customer,
                                                                    id_ref_ongkir = :ref_ongkirid,
                                                                    id_ref_layanan = :ref_layananid,
                                                                    id_ref_jasaapp = :ref_jasaid,
                                                                    id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }
                                                                    dataheaderquery = `
                                                                    UPDATE transaction_header SET
                                                                    coordinate_customer = Point(:latitudee, :longitudee),
                                                                    detail_alamatcustomer = :detailalamat,
                                                                    alamatlengkap_customer = :alamatlengkap_customer,
                                                                    id_ref_ongkir = :ref_ongkirid,
                                                                    id_ref_layanan = :ref_layananid,
                                                                    id_ref_jasaapp = :ref_jasaid,
                                                                    id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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

                    else if(data[0].type_kode == "uniquecode")
                    {

                        let query2 = `
                        select
                        th.*,
                        ul.user_fullname,
                        ul.user_email,
                        ul.user_id,
                        ul.user_notlp,
                        DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl
                        from transaction_header th
                        left join user_login_customer ul on ul.user_id = th.id_customer
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
                                    const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
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
                                    const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";





                                    console.log(expired);

                                    var string1 = amount+expired+data[0].namaBank+partner_reff.replace(/\s/g,"")+customer_id+customer_name+customer_email+clien_id;
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
                                        // "amount": jumlah,
                                        // "partner_reff": partner_reff.replace(/\s/g,""),
                                        // "customer_id": ""+data2[0].user_id+"0000",
                                        // "customer_name": data2[0].user_fullname,
                                        // "expired": expired,
                                        // "username": "LI9948NTV",
                                        // "pin": "JQoDvZNvd57C1l5",
                                        // "customer_phone": (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp,
                                        // "customer_email": data2[0].user_email,
                                        // "bank_code": data[0].kodeBank,
                                        // "signature": signature
                                        "amount": jumlah,
                                        "partner_reff": partner_reff.replace(/\s/g,""),
                                        "username": "LI9948NTV",
                                        "pin": "JQoDvZNvd57C1l5",
                                        "bank_code": data[0].namaBank,
                                        "signature": signature
                                        });

                                        let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: 'https://gateway.linkqu.id/linkqu-partner/transaction/create/uniquecode',
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
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

                    else if(data[0].type_kode == "cash"){

                        let query2 = `
                        select
                        th.*,
                        ul.user_fullname,
                        ul.user_email,
                        ul.user_id,
                        ul.user_notlp,
                        DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl
                        from transaction_header th
                        left join user_login_customer ul on ul.user_id = th.id_customer
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

                                const customer_id = "" + data2[0].user_id + "";
                                const customer_name = data2[0].user_fullname;
                                const customer_email = data2[0].user_email;

                                let query5 = `select * from transaction_payment where id_transaction_header = :idheader`;

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

                                        if (cot == 0) {

                                            return models.transaction_payment.create({
                                                id_transaction_header: idtransactionheader || null,
                                                amount: jumlah || null,
                                                customer_nama: customer_name || null,
                                                customer_id: customer_id || null,
                                                customer_phone: (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp || null,
                                                customer_email: customer_email || null,
                                                bank_code: data[0].kodeBank || null,
                                                username: "LI307GXIN" || null,
                                                pin: "2K2NPCBBNNTovgB" || null,
                                                virtual_account: "" || null,
                                                signature: "" || null,
                                                ref_id_bayar: data[0].id || null
                                            })
                                                .then((userdetail) => {
                                                    if (userdetail) {

                                                        const point = 'Point(' + parseFloat(latitudee) + ', ' + parseFloat(longitudee) + ')';

                                                        dataheader =
                                                                        {
                                                                            point : point || null,
                                                                            detailalamat: detailalamat || null,
                                                                            alamatlengkap_customer: alamatlengkap || null,
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid,
                                                                        id_transaction_status = 0,
                                                                        ket_transaction_status = 'Menunggu Konfirmasi Merchant'
                                                                        where id_transaction_header = :idtransactionheader
                                                                        `;


                                                        return models.sequelize
                                                            .query(dataheaderquery, {
                                                                replacements: dataheader,
                                                                type: QueryTypes.UPDATE,
                                                            })
                                                            .then(async (userdetail2) => {
                                                                if (userdetail2) {

                                                                    // return success(req, res, userdetail2, "Berhasil", true);
                                                                    let querydata = `select data.*,
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
                                                ph.fk_user_id as idmerchantt,
                                                (select dl.firebasetoken from user_login tbul
                                                                    left join user_devicelog dl on dl.fk_userlogin = tbul.user_id
                                                                    where tbul.user_id = ph.fk_user_id and
                                                                    dl.is_login = 1 and dl.jenisdokumen = 'LOGIN' and DATE_FORMAT(dl.update_date, '%d-%m-%Y')
                                                          = DATE_FORMAT(now(), '%d-%m-%Y') and dl.firebasetoken is not null
                                                          limit 1) firebasetokenmerchant
                                            from transaction_detail td
                                            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
                                                                    left join transaction_payment tp on tp.id_transaction_header = th.id_transaction_header
                                                                    left join callback_payment cp on cp.fk_id_payment = tp.id_payment
                                                                    left join product_header ph on ph.prod_id = th.id_merchant
                                                                    where th.id_transaction_header = :idtransaksi
                                                                    and th.id_transaction_status = 0
                                                                    ) data `;
                                                                    return models.sequelize
                                                                        .query(querydata, {
                                                                            replacements: {
                                                                                idtransaksi: parseInt(idtransactionheader)
                                                                                // filterSatu: filterSatu,
                                                                                // filterDua: filterDua,
                                                                                // filterTiga: filterTiga
                                                                            },
                                                                            type: QueryTypes.SELECT,
                                                                        })
                                                                        .then((data4) => {

                                                                            const count4 = data4.length;

                                                                            if (count4 > 0) {
                                                                                const datar = [];
                                                                                for (t = 0; t <= (data4.length - 1); t++) {
                                                                                    datar.push({
                                                                                        "nama_produk": data4[t].namaproduk,
                                                                                        "harga_produk": data4[t].totalharga_produk,
                                                                                        "photo_link": data4[t].photoproduk,
                                                                                        "categori": data4[t].kategori_nama,
                                                                                        "jumlah": data4[t].jumlah,
                                                                                        "idtransaksi": data4[t].id_transaction_header
                                                                                    }
                                                                                    );
                                                                                }

                                                                                console.log(datar);
                                                                                const axios = require('axios');
                                                                                let datakirim = JSON.stringify({
                                                                                    "to": "" + data4[0].firebasetokenmerchant + "",
                                                                                    "notification": {
                                                                                        "body": "Ada Pesanan Baru",
                                                                                        "title": "Ada Pesanan Baru",
                                                                                        "subtitle": "Segera Lakukan Konfirmasi"
                                                                                    },
                                                                                    "data": {
                                                                                        "nama_toko": data4[0].nama_toko,
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
                                                                                    data: datakirim
                                                                                };

                                                                                axios.request(config)
                                                                                    .then((response) => {
                                                                                        return success(req, res, data, "Berhasil", true);

                                                                                    })
                                                                                    .catch((error) => {
                                                                                        return error(req, res, {}, "Gagal Silahkan Cobalagi", false, error);
                                                                                    });
                                                                            } else {
                                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                                                            }

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


                                                        // return success(req, res, userdetail, "Berhasil.", true);


                                                    }
                                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
                                                })
                                                .catch((err) => {
                                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                                                });

                                        } else {

                                            const point = 'Point(' + parseFloat(latitudee) + ', ' + parseFloat(longitudee) + ')';

                                            dataheader =
                                                                        {
                                                                            point : point || null,
                                                                            detailalamat: detailalamat || null,
                                                                            alamatlengkap_customer: alamatlengkap || null,
                                                                            idtransactionheader: parseInt(idtransactionheader) || null,
                                                                            latitudee: latitudee,
                                                                            longitudee: longitudee,
                                                                            ref_ongkirid: data[0].ref_ongkirid || null,
                                                                            ref_layananid: data[0].ref_layananid || null,
                                                                            ref_jasaid: data[0].ref_jasaid || null,
                                                                            ref_packagingid: data[0].ref_packagingid || null, 
                                                                        }

                                                                        dataheaderquery = `
                                                                        UPDATE transaction_header SET
                                                                        coordinate_customer = Point(:latitudee, :longitudee),
                                                                        detail_alamatcustomer = :detailalamat,
                                                                        alamatlengkap_customer = :alamatlengkap_customer,
                                                                        id_ref_ongkir = :ref_ongkirid,
                                                                        id_ref_layanan = :ref_layananid,
                                                                        id_ref_jasaapp = :ref_jasaid,
                                                                        id_ref_packaging = :ref_packagingid
                                                                        where id_transaction_header = :idtransactionheader
                                                                        `;

                                            return models.sequelize
                                                .query(dataheaderquery, {
                                                    replacements: dataheader,
                                                    type: QueryTypes.UPDATE,
                                                })
                                                .then(async (userdetail2) => {
                                                    if (userdetail2) {

                                                        return success(req, res, userdetail2, "Berhasil", true);

                                                    } else {
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

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                    }
        //             else if(data[0].type_kode == "uniquecode")
        //             {

        //                 let query2 = `
        //                 select
        //                 th.*,
        //                 ul.user_fullname,
        //                 ul.user_email,
        //                 ul.user_id,
        //                 ul.user_notlp,
        //                 DATE_FORMAT(now()+interval 1 day, '%Y%m%d%H%i%s') as tgl
        //                 from transaction_header th
        //                 left join user_login_customer ul on ul.user_id = th.id_customer
        //                 where th.id_transaction_header = :idheader`;

        //                 return models.sequelize
        //                 .query(query2, {
        //                     replacements: {
        //                         idheader: parseInt(idtransactionheader)
        //                         // filterSatu: filterSatu,
        //                         // filterDua: filterDua,
        //                         // filterTiga: filterTiga
        //                     },
        //                     type: QueryTypes.SELECT,
        //                 })
        //                 .then((data2) => {

        //                         let count = data2.length;

        //                         if(count > 0)
        //                         {

        //                             const regex = '/[^0-9a-zA-Z]/g';
        //                             const path = "/transaction/create/va";
        //                             const method = "POST";
        //                             //const clientID = "testing";
        //                             const serverKey = "niLdq9u7PBZjSNHnH1RRPve1";
        //                             var refid = Math.floor(10 + Math.random() * 99);
        //                             var amount = parseInt(jumlah) + parseInt(Math.floor(10 + Math.random() * 99));
        //                             //const  = moment(new Date(), "YYYYMMDD").add(1, 'days');
        //                             var d = new Date();
        //                             d.setDate(d.getDate() + 1);
        //                             // const expired = [ (d.getMonth()+1).padLeft(),
        //                             //     d.getDate().padLeft(),
        //                             //     d.getFullYear()].join('')+
        //                             //     '' +
        //                             // [ d.getHours().padLeft(),
        //                             //     d.getMinutes().padLeft(),
        //                             //     d.getSeconds().padLeft()].join('');
        //                             console.log(""+data[0].namaBank+""+data2[0].user_fullname+""+data2[0].user_id+""+data2[0].id_transaction_header+"");
        //                             const expired = data2[0].tgl;
        //                             const bankcode = data[0].kodeBank;
        //                             const partner_reff = ""+data2[0].user_fullname+""+data2[0].user_id+""+data2[0].id_transaction_header+"";
        //                             const customer_id = ""+data2[0].user_id+"0000";
        //                             const customer_name = data2[0].user_fullname;
        //                             const customer_email = data2[0].user_email;
        //                             const clien_id = "dc43848c-f384-4fc8-a1b5-bfecd880ddc0";
        //                             var virtualakun = '';
        //                             var bank_id = '';

        //                             var string1 = amount+expired+bankcode+partner_reff.replace(/\s/g,"")+customer_id+customer_name+customer_email+clien_id;
        //                             var secondvalue2 = string1.replace(/[^0-9a-zA-Z]/g, "");
        //                             var secondvalue = secondvalue2.toLowerCase();
        //                             var signToString = path+method+secondvalue;
                                    
        //                             console.log(secondvalue2);
        //                             console.log(string1);
        //                             var signature = crypto.createHmac('sha256', serverKey)

        //                             // updating data
        //                             .update(signToString)

        //                             // Encoding to be used
        //                             .digest('hex');

        //                             const axios = require('axios');
        //                             let datkirim = '';

        //                             let config = {
        //                             method: 'get',
        //                             maxBodyLength: Infinity,
        //                             url: 'https://app.moota.co/api/v2/bank?page=1&per_page=10',
        //                             headers: { 
        //                                 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJucWllNHN3OGxsdyIsImp0aSI6ImQxMDAzNWIxZDM2MTg3ZGM5MjI2NjA4MTc2NTQwMzhmNjk1YmNiMGUwOWE4ZmU5MzY5ZDEwYWQ1ODA5YmQ3NWU4MmE3NDY4MDQzMzg0YmRkIiwiaWF0IjoxNjk1MDk2Mjg3Ljc1NzUyNywibmJmIjoxNjk1MDk2Mjg3Ljc1NzUyOSwiZXhwIjoxNzI2NzE4Njg3Ljc1NDg4NCwic3ViIjoiMzAxODEiLCJzY29wZXMiOlsiYXBpIiwiYmFuayIsIm11dGF0aW9uIl19.q5vQjnkuIJp1HuICdDvnfm_4JE07rmrgN0kdfM2Y7z3m4L16F9QblWe888dOgQZjeCe5zHRrFg_7hJ8W5q4Qo0ejlqvEDBXYz2GGx6KJVi59DMc6Mhkm-anfCAktZcY8vifqg1TLrx7GaF5i5YDJVmDk_ID_N4WEBQea0B0PkEqW_OwkfMH1s9iffk7CFpCRpOxvQwckba7FmyeJO7yqg3a8AhiuF4_WoXn1DNoABHSaE2tq_R1TzjImIrsqwMhjNLytBwcaNgOy8bPXkZtNXmaRh6j4Cwmv09gyfT_gbP9ZptWhTTXM1JnqbPOOxc_DFxD8njGX2XYnqDOW1QRpAHV-wD3mNXPyKghXxAMnkAZy7FlE9ujciN0HuaFPi536WDi2LbSa5Y_eJ-TEgGghnB3tLJN0A8rHvMQBxIIkMU1EZLGDB4CDn10ocDGW8azeXpT9vojGptcGv0PjjqoLKO5dqzW_LiGivo_kh7T7IQc9DU3_M_c5NDlwP5GeQrHvBywUG3MT1LI2WeIswYo1MQEyS5otyk_UAppC_eDl4lLloJGGBCfphsNxG-oSIOZyLL5V22SzlLG3KUtbyh7jecog8Q_aNujuT4FIy2MLWhWhKFqlOXXMbinRJgaywXTDImm93nlkhnFbtBSL_LgfLsN5LiyRhx291FEA2r_L7eA'
        //                             },
        //                             data : datkirim
        //                             };

        //                             axios.request(config)
        //                             .then((response) => {
                                        
        //                                 var dataf = [];
        //                                 dataf = response.data.data;
        //                                 console.log(dataf.length);

                                        
        //                                 //console.log(length(json.encode(response.data.data)));
        //                                   for(i=0; i<=(dataf.length - 1); i++)
        //                                   {
        //                                     console.log(data[0].namaBank);
        //                                     console.log(dataf[i].is_active);
        //                                     if(data[0].namaBank == "MANDIRI" && dataf[i].is_active == true )
        //                                     {
                                                
        //                                         virtualakun = dataf[i].account_number;
        //                                         bank_id = dataf[i].bank_id;
        //                                         console.log(virtualakun);

        //                                     }else if(data[0].namaBank == "BANK BNI" && dataf[i].is_active == true)
        //                                     {
        //                                         virtualakun = dataf[i].account_number;
        //                                         bank_id = dataf[i].bank_id;
        //                                     }else if(data[0].namaBank == "BANK BCA" && dataf[i].is_active == true)
        //                                     {
        //                                         virtualakun = dataf[i].account_number;
        //                                         bank_id = dataf[i].bank_id;
        //                                     }else if(data[0].namaBank == "BANK MUAMALAT" && dataf[i].is_active == true)
        //                                     {
        //                                         virtualakun = dataf[i].account_number;
        //                                         bank_id = dataf[i].bank_id;
        //                                     }
        //                                   }

                                          

                                        

        //                                 if(virtualakun == "")
        //                                 {

        //                                     return error(req, res, {}, "Maaf Akun Bank Sedang Mengalami Gangguan", false, "Maaf Akun Bank Sedang Mengalami Gangguan");

        //                                 }else{
        //                                     let query5 = `
        //                                         select * from transaction_payment where id_transaction_header = :idheader`;

        //                                         return models.sequelize
        //                                         .query(query5, {
        //                                             replacements: {
        //                                                 idheader: parseInt(idtransactionheader)
        //                                                 // filterSatu: filterSatu,
        //                                                 // filterDua: filterDua,
        //                                                 // filterTiga: filterTiga
        //                                             },
        //                                             type: QueryTypes.SELECT,
        //                                         })
        //                                         .then((datapaymentt) => {

        //                                             let cot = datapaymentt.length;

        //                                             if(cot == 0)
        //                                             {
                                                        
        //                                                 return models.transaction_payment.create({
        //                                                     id_transaction_header: idtransactionheader || null,
        //                                                     amount: amount || null,
        //                                                     customer_nama: customer_name|| null,
        //                                                     customer_id: customer_id || null,
        //                                                     partner_reff: partner_reff || null,
        //                                                     expired: expired || null,
        //                                                     customer_phone: (data2[0].user_notlp == null) ? '0' : data2[0].user_notlp || null,
        //                                                     customer_email: customer_email || null,
        //                                                     bank_code: bankcode || null,
        //                                                     username: bank_id || null,
        //                                                     pin: "" || null,
        //                                                     virtual_account: virtualakun || null,
        //                                                     signature: "" || null,
        //                                                     ref_id_bayar: data[0].id || null
        //                                                 })
        //                                                     .then((userdetail) => {
        //                                                         if (userdetail) {

        //                                                             const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';

        //                                                             dataheader =
        //                                                                 {
        //                                                                     point : point || null,
        //                                                                     detailalamat: detailalamat || null,
        //                                                                     alamatlengkap_customer: alamatlengkap || null,
        //                                                                     idtransactionheader: parseInt(idtransactionheader) || null,
        //                                                                     latitudee: latitudee,
        //                                                                     longitudee: longitudee
        //                                                                 }
        //                                                             dataheaderquery = `
        //                                                             UPDATE transaction_header SET
        //                                                             coordinate_customer = Point(:latitudee, :longitudee),
        //                                                             detail_alamatcustomer = :detailalamat,
        //                                                             alamatlengkap_customer = :alamatlengkap_customer
        //                                                             where id_transaction_header = :idtransactionheader
        //                                                             `;


        //                                                             return models.sequelize
        //                                                                     .query(dataheaderquery, {
        //                                                                         replacements: dataheader,
        //                                                                         type: QueryTypes.UPDATE,
        //                                                             })
        //                                                             .then(async (userdetail2) => {
        //                                                                 if(userdetail2){

        //                                                                     return success(req, res, userdetail, "Berhasil", true);

        //                                                                 }else{
        //                                                                     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
        //                                                                 }
        //                                                             })
        //                                                             .catch((err) => {
        //                                                                 return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        //                                                             });


        //                                                            // return success(req, res, userdetail, "Berhasil.", true);


        //                                                         }
        //                                                         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, '');
        //                                                     })
        //                                                     .catch((err) => {
        //                                                         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        //                                                     });

        //                                             }else{

        //                                                 const point = 'Point('+parseFloat(latitudee)+', '+parseFloat(longitudee)+')';
                                                        
        //                                                 dataheader =
        //                                                 {
        //                                                     point : point || null,
        //                                                     detailalamat: detailalamat || null,
        //                                                     alamatlengkap_customer: alamatlengkap || null,
        //                                                     idtransactionheader: parseFloat(idtransactionheader) || null,
        //                                                     latitudee: latitudee,
        //                                                     longitudee: longitudee
        //                                                 }
        //                                                 dataheaderquery = `
        //                                                 UPDATE transaction_header SET
        //                                                 coordinate_customer = Point(:latitudee, :longitudee),
        //                                                 detail_alamatcustomer = :detailalamat,
        //                                                 alamatlengkap_customer = :alamatlengkap_customer
        //                                                 where id_transaction_header = :idtransactionheader
        //                                                 `;

        //                                                 return models.sequelize
        //                                                         .query(dataheaderquery, {
        //                                                             replacements: dataheader,
        //                                                             type: QueryTypes.UPDATE,
        //                                                 })
        //                                                 .then(async (userdetail2) => {
        //                                                     if(userdetail2){

        //                                                         return success(req, res, datapaymentt, "Berhasil", true);

        //                                                     }else{
        //                                                         return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        //                                                     }
        //                                                 })
        //                                                 .catch((err) => {
        //                                                     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        //                                                 });
        //                                             }
        //                                         })
        //                                         .catch((err) => {
        //                                             return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
        //                                         });

        //                                 }

                                        

                                        
                                        
        //                             })
        //                             .catch((errorr) => {
        //                                 return error(req, res, {}, "Maaf Akun Bank Sedang Mengalami Gangguan", false, errorr);
        //                             });



        // }else{

        //     return error(req, res, {}, "Error , Silahkan Cobalagi", false, false);

        // }
        //                     })
        //                 .catch(err => {
        //                 // res.status(500).send({
        //                 //     message:
        //                 //     err.message || "Some error occurred while retrieving tutorials."
        //                 // });
        //                 return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        //                                     });



                    
                        
                        
        //                 //return error(req, res, {}, "Maaf Metode Pembayaran Belum Tersedia, Silahkan ganti pembayaran lain.", false, false);
        //             }
                    else{
                        return error(req, res, {}, "Maaf Metode Pembayaran Belum Tersedia, Silahkan ganti pembayaran lain.", false, false);
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
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key=AIzaSyAlpiIfvGdEyJQJ7CdEtwvvKH5xCu7Uhsg',
    headers: { }
    };

    axios.request(config)
    .then((response) => {

    console.log(JSON.stringify(response.data));
        // console.log(response.data.results.length);
        // if(response.data.results.length > 0)
        // {

        // }else{

        // }

        return success(req, res, response.data, "Berhasil.", true);

    })
    .catch((error) => {

        return success(req, res, { result: [] }, "Berhasil.", false, false);

    });
}

exports.topupdigiflazz = (req, res) => {
    const axios = require('axios');
    let data = `{\r\n    
    "username": "rifotagxnLQD",\r\n    
    "buyer_sku_code": "TRI-PULSA-5000",\r\n    
    "customer_no": "089693095919",\r\n    
    "ref_id": "some1d",\r\n    
    "sign": "cfcd208495d565ef66e7dff9f98764da"\r\n}`;

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.digiflazz.com/v1/transaction',
    headers: { 
        'Content-Type': 'text/plain'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
        //return JSON.stringify(response.data);
        return success(req, res, response.data, "Berhasil.", true);
        
    })
    .catch((error) => {
        console.log(error);
        // return error;
        return error(req, res, { result: [] }, "Gagal.", false, false);
    });
}

exports.cekstatustopup = (req, res) => {
    
    const axios = require('axios');
    let data = `{\r\n    
    "commands": "status-pasca",\r\n    
    "username": "rifotagxnLQD",\r\n    
    "buyer_sku_code": "TRI-PULSA-5000",\r\n    
    "customer_no": "089693095919",\r\n    
    "ref_id": "some1d",\r\n    
    "sign": "ee803d5778956dd4f21f250ec90977fd"\r\n
    }`;

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.digiflazz.com/v1/transaction',
    headers: { 
        'Content-Type': 'text/plain'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        // console.log(response.data['data']['message']);
        // return JSON.stringify(response.data);
        return success(req, res, response.data, "Berhasil.", true);
    })
    .catch((error) => {
        //console.log(error);
        // return error;
        return error(req, res, { result: [] }, "Gagal.", false, false);
    });
}

