
const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbproduction");
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
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
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_matrial pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION
        select
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga,
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko,
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_ibubayi pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION
        select
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga,
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko,
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_mainananak pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION
        select
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga,
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko,
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_officialstore pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION
        select
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga,
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko,
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
        (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_atk pm
        left join product_header ph on ph.prod_id = pm.prod_id_header
        left join user_login a on a.user_id = ph.fk_user_id
        where a.user_fullname = :namefull
        UNION
        select
        pm.prod_id_header as id_toko,
        pm.produk_nama , pm.produk_id , pm.produk_stok ,pm.produk_kategori_id , pm.produk_kategori_nama , pm.produk_foto ,
        pm.produk_harga,
        ph.nama_toko as nama_toko, ph.kategori_nama as kategori_toko,
                ph.alamat_toko as alamat_toko,a.user_foto as foto_toko, ph.coordinate as maps_toko,
         (
         	select 
			    (select data3.jumlah1 - data3.jumlah2 as jumlahsaldo from 
			            (
			            select case when jumlah1 is not null then jumlah1 else 0 end as jumlah1,
			            case when jumlah2 is not null then jumlah2 else 0 end as jumlah2 from 
			            (
			            select 
			            sum(totalharga_produk) as jumlah1
			            from transaction_detail td 
			            left join transaction_header th on th.id_transaction_header = td.fk_transaction_header
			            where th.id_merchant in 
			            (
			            select phh.prod_id from product_header phh 
			            left join user_login ul on ul.user_id = phh.fk_user_id
			            where ul.user_fullname = ull.user_fullname
			            ) and th.id_transaction_status = 5
			            ) as data1 join (
			            select sum(jumlahuang) as jumlah2 from transaction_withdraw tw 
			            where tw.fk_user_merchant = 
			            (
			            select ul.user_id from user_login ul 
			            where ul.user_fullname = ull.user_fullname
			            ) and tw.tipedokumen = 'penarikan' and tw.status in (1,2)
			            ) as data2
			            ) as data3) as saldoterkini
			            from user_login ull 
			    left join transaction_withdraw tw on tw.fk_user_merchant = ull.user_id 
			    where ull.user_fullname = a.user_fullname limit 1
         ) as saldotoko
        from product_olahraga pm
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