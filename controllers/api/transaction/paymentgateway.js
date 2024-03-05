
const { error, success } = require("../../../helpers/utility/response");
const models = require("../../../modelstbproduction");
const { QueryTypes } = require("sequelize");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const moment = require("moment");
const axios = require('axios');


exports.getdatabank = (req, res) => {

    const { username, password } = req.body;

    if(username == "beliintolong" && password == "ghaida789")
    {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://gateway.linkqu.id/linkqu-partner/masterbank/list',
            headers: {
              'client-id': 'dc43848c-f384-4fc8-a1b5-bfecd880ddc0',
              'client-secret': 'qoLnbvI60pFt7oEuGMljDjUZN'
            }
          };

          axios.request(config)
          .then(async (response) => {
            // console.log(JSON.stringify(response.data));
            // for(i=0; i<=length(response.data.data); i++)
            // {

            // }
            return success(req, res, response.data.data, "List All Bank", true);
            // await models.mref_bank_linkqu.bulkCreate(
            //   response.data.data,
            //   {
            //     updateOnDuplicate: ["kodeBank","namaBank","isActive","url_image"],
            //   }
            // ).then(async (userdetail2) => {

            //   return success(req, res, response.data.data, "List All Bank", true);

            // })
            // .catch((err) => {
            //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
            // });

          })
          .catch((err) => {
            return error(req, res, {}, ""+err+"", false, false);
          });


    }else{
        return error(req, res, {}, "", false, false);
    }



};

exports.getdatabankLinkqu = (req, res) => {

  const { username, password } = req.body;

  if(username == "beliintolong" && password == "ghaida789")
  {

        let query = `select * from mref_bank_linkqu where isActive is true order by namaBank asc`;

        return models.sequelize
        .query(query, {
            // replacements: {
            //     idtrx: idtrxdetail
            //     // filterSatu: filterSatu,
            //     // filterDua: filterDua,
            //     // filterTiga: filterTiga
            // },
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

exports.callbackuniquecode = (req, res) => {

  const { amount, type,token, account_number, date, 
    balance, updated_at, created_at, mutation_id , bank_id } = req.body[0];

  //console.log(token);
  //console.log(req.body[0]);
  if(token == "VS2kiL59")
  {
        let querycekva = `select * from transaction_payment tp 
        where tp.username = :bankid or tp.amount = :amount`;

        return models.sequelize
        .query(querycekva, {
            replacements: {
              bankid: bank_id,
              amount: amount
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then((datatransaksi) => {

            console.log(datatransaksi[0].id_transaction_header);
            const dataheaderid = datatransaksi[0].id_transaction_header;
            const idpaymentt = datatransaksi[0].id_payment;

            let querycekmethod = `select * from callback_payment mbl
            where mbl.amount = :amount and type = 'payuniquecode' limit 1`;

            return models.sequelize
              .query(querycekmethod, {
                  replacements: {
                    amount: amount
                      // filterSatu: filterSatu,
                      // filterDua: filterDua,
                      // filterTiga: filterTiga
                    },
                    type: QueryTypes.SELECT,
                })
                .then((data) => {

                      const count = data.length;
                      console.log(dataheaderid);


                      if(count > 0)
                      {

                            return models.callback_payment.update({
                              amount : amount || null,
                              type : 'payuniquecode' || null,
                              balance : balance || null,
                              transaction_time : date || null,
                              va_number : va_number || null,
                              customer_name : customer_name || null,
                              username : bank_id || null,
                              status : 'SUCCESS' || null,
                              signature : bank_id || null,
                              jenisbayar : "uniquecode" || null,
                              fk_id_payment: idpaymentt || null,
                              serialnumber: account_number || null,
                            },{where: {va_number: va_number}})
                            .then((userdetail) => {

                                if(userdetail)
                                {

                                  // if(status == "SUCCESS")
                                  // {

                                    return models.transaction_header.update({
                                      id_transaction_status: 0,
                                      ket_transaction_status: 'Menunggu Konfirmasi Merchant',
                                      input_datecustomer: Date.now(),
                                    },{where: {id_transaction_header: dataheaderid}})
                                    .then((userdetail4) => {
                                        if (userdetail4) {

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
                                                                    where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                                    and th.id_transaction_status = 0
                                                                    ) data `;
                                                                    return models.sequelize
                                                                    .query(querydata, {
                                                                        replacements: {
                                                                          idtransaksi: dataheaderid
                                                                            // filterSatu: filterSatu,
                                                                            // filterDua: filterDua,
                                                                            // filterTiga: filterTiga
                                                                        },
                                                                        type: QueryTypes.SELECT,
                                                                    })
                                                                    .then((data4) => {

                                                                          const count4 = data4.length;

                                                                          if(count4 > 0)
                                                                          {
                                                                              const datar = [];
                                                                              for(t=0; t <= (data4.length - 1); t++)
                                                                                      {
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
                                                                              "to": ""+data4[0].firebasetokenmerchant+"",
                                                                              "notification": {
                                                                                  "body": "Orderan Baru Masuk",
                                                                                  "title": "Orderan Baru Masuk",
                                                                                  "subtitle": "Orderan Baru Masuk"
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
                                                                              data : datakirim
                                                                              };

                                                                              axios.request(config)
                                                                              .then((response) => {
                                                                                  return success(req, res, data, "Sukses", true);

                                                                              })
                                                                              .catch((error) => {
                                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, error);
                                                                              });
                                                                            }else{
                                                                              return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
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

                                  // }else{
                                  //   return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                  // }
                                }else{
                                  return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                      }else{

                          return models.callback_payment.create({
                            amount : amount || null,
                            type : 'payuniquecode' || null,
                            balance : balance || null,
                            transaction_time : date || null,
                            va_number : va_number || null,
                            customer_name : customer_name || null,
                            username : bank_id || null,
                            status : 'SUCCESS' || null,
                            signature : bank_id || null,
                            jenisbayar : "uniquecode" || null,
                            fk_id_payment: idpaymentt || null,
                            serialnumber: account_number || null,
                          })
                          .then((userdetail) => {

                              if(userdetail)
                              {

                                //if(status == "SUCCESS")
                                //{

                                  return models.transaction_header.update({
                                    id_transaction_status: 0,
                                    ket_transaction_status: 'Menunggu Konfirmasi Merchant',
                                    input_datecustomer: Date.now(),
                                  },{where: {id_transaction_header: dataheaderid}})
                                  .then((userdetail4) => {
                                      if (userdetail4) {

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
                                                                  where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                                  and th.id_transaction_status = 0
                                                                  ) data `;
                                                                  return models.sequelize
                                                                  .query(querydata, {
                                                                      replacements: {
                                                                        idtransaksi: dataheaderid
                                                                          // filterSatu: filterSatu,
                                                                          // filterDua: filterDua,
                                                                          // filterTiga: filterTiga
                                                                      },
                                                                      type: QueryTypes.SELECT,
                                                                  })
                                                                  .then((data4) => {

                                                                        const count4 = data4.length;

                                                                        if(count4 > 0)
                                                                        {
                                                                            const datar = [];
                                                                            for(t=0; t <= (data4.length - 1); t++)
                                                                                    {
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
                                                                            "to": ""+data4[0].firebasetokenmerchant+"",
                                                                            "notification": {
                                                                                "body": "Orderan Baru Masuk",
                                                                                "title": "Orderan Baru Masuk",
                                                                                "subtitle": "Orderan Baru Masuk"
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
                                                                            data : datakirim
                                                                            };

                                                                            axios.request(config)
                                                                            .then((response) => {
                                                                                return success(req, res, data, "Sukses", true);

                                                                            })
                                                                            .catch((error) => {
                                                                              return error(req, res, {}, "Gagal Silahkan Cobalagi", false, error);
                                                                            });
                                                                          }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
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

                                //}else{
                                //   return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                // }




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
          })
          .catch(err => {
                  // res.status(500).send({
                  //     message:
                  //     err.message || "Some error occurred while retrieving tutorials."
                  // });
                  return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });
  }else{
    return error(req, res, req.body, "Error , Silahkan Cobalagi", false, false);
  }

  // account_number: 2577739,
  // date: '2023-09-29 14:22:54',
  // description: 'wwww',
  // amount: '10000',
  // type: 'CR',
  // balance: 520000,
  // updated_at: '2023-09-29 14:22:54',
  // created_at: '2023-09-29 14:22:54',
  // mutation_id: '9697422',
  // token: 'VS2kiL59',
  // bank_id: '4945661'

};

exports.callbackva = (req, res) => {

  const { amount, serialnumber,type, payment_reff, va_code,partner_reff,partner_reff2,
  additionalfee,balance,credit_balance,transaction_time,va_number,customer_name,
  username,status,signature } = req.body;

  // return models.callback_payment.create({
  //   amount : amount || null,
  //   serialnumber : serialnumber || null,
  //   type : type || null,
  //   payment_reff : payment_reff || null,
  //   va_code : va_code || null,
  //   partner_reff : partner_reff || null,
  //   partner_reff2 : partner_reff2 || null,
  //   additionalfee : additionalfee || null,
  //   balance : balance || null,
  //   credit_balance : credit_balance || null,
  //   transaction_time : transaction_time || null,
  //   va_number : va_number || null,
  //   customer_name : customer_name || null,
  //   username : username || null,
  //   status : status || null,
  //   signature : signature || null,
  // })
  // .then((userdetail) => {

  //     if(userdetail)
  //     {

  //       return success(req, res, data, "Sukses", true);




  //     }else{
  //       return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
  //     }

  // })
  // .catch((err) => {
  //     return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
  // });

    let querycekva = `select * from transaction_payment where virtual_account = :va`;

        return models.sequelize
        .query(querycekva, {
            replacements: {
              va: va_number
                // filterSatu: filterSatu,
                // filterDua: filterDua,
                // filterTiga: filterTiga
            },
            type: QueryTypes.SELECT,
        })
        .then((datatransaksi) => {

            console.log(datatransaksi[0].id_transaction_header);
            const dataheaderid = datatransaksi[0].id_transaction_header;
            const idpaymentt = datatransaksi[0].id_payment;

            let querycekmethod = `select * from callback_payment mbl
            where mbl.va_number = :va limit 1`;

            return models.sequelize
              .query(querycekmethod, {
                  replacements: {
                      va: va_number
                      // filterSatu: filterSatu,
                      // filterDua: filterDua,
                      // filterTiga: filterTiga
                    },
                    type: QueryTypes.SELECT,
                })
                .then((data) => {

                      const count = data.length;
                      console.log(dataheaderid);


                      if(count > 0)
                      {

                            return models.callback_payment.update({
                              amount : amount || null,
                              serialnumber : serialnumber || null,
                              type : type || null,
                              payment_reff : payment_reff || null,
                              va_code : va_code || null,
                              partner_reff : partner_reff || null,
                              partner_reff2 : partner_reff2 || null,
                              additionalfee : additionalfee || null,
                              balance : balance || null,
                              credit_balance : credit_balance || null,
                              transaction_time : transaction_time || null,
                              va_number : va_number || null,
                              customer_name : customer_name || null,
                              username : username || null,
                              status : status || null,
                              signature : signature || null,
                              jenisbayar : "va" || null,
                              fk_id_payment: idpaymentt || null,
                            },{where: {va_number: va_number}})
                            .then((userdetail) => {

                                if(userdetail)
                                {

                                  if(status == "SUCCESS")
                                  {

                                    return models.transaction_header.update({
                                      id_transaction_status: 0,
                                      ket_transaction_status: 'Menunggu Konfirmasi Merchant',
                                      input_datecustomer: Date.now(),
                                    },{where: {id_transaction_header: dataheaderid}})
                                    .then((userdetail4) => {
                                        if (userdetail4) {

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
                                                                    where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                                    and th.id_transaction_status = 0
                                                                    ) data `;
                                                                    return models.sequelize
                                                                    .query(querydata, {
                                                                        replacements: {
                                                                          idtransaksi: dataheaderid
                                                                            // filterSatu: filterSatu,
                                                                            // filterDua: filterDua,
                                                                            // filterTiga: filterTiga
                                                                        },
                                                                        type: QueryTypes.SELECT,
                                                                    })
                                                                    .then((data4) => {

                                                                          const count4 = data4.length;

                                                                          if(count4 > 0)
                                                                          {
                                                                              const datar = [];
                                                                              for(t=0; t <= (data4.length - 1); t++)
                                                                                      {
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
                                                                              "to": ""+data4[0].firebasetokenmerchant+"",
                                                                              "notification": {
                                                                                  "body": "Orderan Baru Masuk",
                                                                                  "title": "Orderan Baru Masuk",
                                                                                  "subtitle": "Orderan Baru Masuk"
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
                                                                              data : datakirim
                                                                              };

                                                                              axios.request(config)
                                                                              .then((response) => {
                                                                                  return success(req, res, data, "Sukses", true);

                                                                              })
                                                                              .catch((error) => {
                                                                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, error);
                                                                              });
                                                                            }else{
                                                                              return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
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
                                    return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                  }
                                }else{
                                  return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                }

                            })
                            .catch((err) => {
                                return error(req, res, {}, "Gagal Silahkan Cobalagi", false, err);
                            });

                      }else{

                          return models.callback_payment.create({
                            amount : amount || null,
                            serialnumber : serialnumber || null,
                            type : type || null,
                            payment_reff : payment_reff || null,
                            va_code : va_code || null,
                            partner_reff : partner_reff || null,
                            partner_reff2 : partner_reff2 || null,
                            additionalfee : additionalfee || null,
                            balance : balance || null,
                            credit_balance : credit_balance || null,
                            transaction_time : transaction_time || null,
                            va_number : va_number || null,
                            customer_name : customer_name || null,
                            username : username || null,
                            status : status || null,
                            signature : signature || null,
                            jenisbayar : "va" || null,
                            fk_id_payment: idpaymentt || null,
                          })
                          .then((userdetail) => {

                              if(userdetail)
                              {

                                if(status == "SUCCESS")
                                {

                                  return models.transaction_header.update({
                                    id_transaction_status: 0,
                                    ket_transaction_status: 'Menunggu Konfirmasi Merchant',
                                    input_datecustomer: Date.now(),
                                  },{where: {id_transaction_header: dataheaderid}})
                                  .then((userdetail4) => {
                                      if (userdetail4) {

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
                                                                  where th.id_transaction_header = :idtransaksi and cp.status = 'SUCCESS'
                                                                  and th.id_transaction_status = 0
                                                                  ) data `;
                                                                  return models.sequelize
                                                                  .query(querydata, {
                                                                      replacements: {
                                                                        idtransaksi: dataheaderid
                                                                          // filterSatu: filterSatu,
                                                                          // filterDua: filterDua,
                                                                          // filterTiga: filterTiga
                                                                      },
                                                                      type: QueryTypes.SELECT,
                                                                  })
                                                                  .then((data4) => {

                                                                        const count4 = data4.length;

                                                                        if(count4 > 0)
                                                                        {
                                                                            const datar = [];
                                                                            for(t=0; t <= (data4.length - 1); t++)
                                                                                    {
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
                                                                            "to": ""+data4[0].firebasetokenmerchant+"",
                                                                            "notification": {
                                                                                "body": "Orderan Baru Masuk",
                                                                                "title": "Orderan Baru Masuk",
                                                                                "subtitle": "Orderan Baru Masuk"
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
                                                                            data : datakirim
                                                                            };

                                                                            axios.request(config)
                                                                            .then((response) => {
                                                                                return success(req, res, data, "Sukses", true);

                                                                            })
                                                                            .catch((error) => {
                                                                              return error(req, res, {}, "Gagal Silahkan Cobalagi", false, error);
                                                                            });
                                                                          }else{
                                                                            return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
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
                                  return error(req, res, {}, "Gagal Silahkan Cobalagi", false, false);
                                }




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
          })
          .catch(err => {
                  // res.status(500).send({
                  //     message:
                  //     err.message || "Some error occurred while retrieving tutorials."
                  // });
                  return error(req, res, {}, "Error , Silahkan Cobalagi", false, err);
        });


  // "amount": 10000,
  //   "serialnumber": "41233",
  //   "type": "pay",
  //   "payment_reff": 51233,
  //   "va_code": "PERMATA",
  //   "partner_reff": "123123123",
  //   "partner_reff2": "5123123123",
  //   "additionalfee": 1500,
  //   "balance": 890000,
  //   "credit_balance": 10000,
  //   "transaction_time": "2020-01-04 14:16:58",
  //   "va_number": "71838188888888",
  //   "customer_name": "OK",
  //   "username": "XXXXXX",
  //   "status": "SUCCESS",
  //   "signature" : "247f704e9249ffa3961edb3dee7c96f6de1d53a99fe5bcc93f8235180139129c"

};

exports.callbackewallet = (req, res) => {

  console.log(req.body);

};