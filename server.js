
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
// const routeDoctor = require("./routes/api/doctor");
//const apiAuth = require("./routes/api/auth");
let apiSignup = require("./routes/api/tbmerchant/signup");
let apiMakanan = require("./routes/api/tbmerchant/makanan");
let apiBuahSayur = require("./routes/api/tbmerchant/buahsayur");
let apiElektronik = require("./routes/api/tbmerchant/elektronik");
let apiOtomotif = require("./routes/api/tbmerchant/otomotif");
let apiPharmacy = require("./routes/api/tbmerchant/pharmacy");
let apiFashion = require("./routes/api/tbmerchant/fashion");
let apiMatrial = require("./routes/api/tbmerchant/matrial");
let apiOlahraga = require("./routes/api/tbmerchant/olahraga");
let apiIbubayi = require("./routes/api/tbmerchant/ibubayi");
let apiAtk = require("./routes/api/tbmerchant/atk");
let apiMainananak = require("./routes/api/tbmerchant/mainananak");
let apiOfficialstore = require("./routes/api/tbmerchant/officialstore");


let apiAllProduk = require("./routes/api/tbmerchant/allproduct");

let apiCustomer = require("./routes/api/tbcustomer/signup");
let apiCms = require("./routes/api/tb_cms/index");

let apiTransaksi = require("./routes/api/transaction/transaction");
let apiPaymentGateway = require("./routes/api/tbpayment/pglinkqu");





// API DRIVER

let apiSignupDriver = require("./routes/api/tbdriver/signup");

// END API DRIVER


// const apiUpload = require("./routes/api/tbmerchant/upload");
// const apiLayanan = require("./routes/api/layanan");
// const apiMaster = require("./routes/api/master");
// const apiLab = require("./routes/api/lab");
// const apiRad = require("./routes/api/rad");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");
const models = require("./models");
// const swaggerDocument = require('./swagger.json');
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "TOLONG BELIIN API",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "http://0.0.0.0:3000"
            : "http://0.0.0.0:3000",
      },
    ],
  },
  apis: ["./routes/api/*.js"],
};
const specs = swaggerJsDoc(options);
// const routeSimrs = require("./routes/api/simrs");
const auth = require("./middleware/authMid");
const base64ToFile = require("./helpers/utility/base64ToFile");
// const routeService = require("./routes/api/service");


let port = 3003;
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// const corsOpt = {
//   origin: "*",
//   methods: "*",
//   allowedHeaders: "*",
// };
app.use(cors());
app.options("*", cors());
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

//START API
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/api/doctor", routeDoctor);
// app.use("/api/simrs", routeSimrs);
//app.use("/api/auth", apiAuth);
app.use("/api/merchant", apiSignup);
app.use("/api/merchant/makanan", apiMakanan);
app.use("/api/merchant/buahsayur", apiBuahSayur);
app.use("/api/merchant/elektronik", apiElektronik);
app.use("/api/merchant/otomotif", apiOtomotif);
app.use("/api/merchant/pharmacy", apiPharmacy);
app.use("/api/merchant/fashion", apiFashion);
app.use("/api/merchant/matrial", apiMatrial);
app.use("/api/merchant/allproduk", apiAllProduk);
app.use("/api/merchant/olahraga", apiOlahraga);
app.use("/api/merchant/ibubayi", apiIbubayi);
app.use("/api/merchant/atk", apiAtk);
app.use("/api/merchant/mainananak", apiMainananak);
app.use("/api/merchant/officialstore", apiOfficialstore);



app.use("/api/customer", apiCustomer);
app.use("/api/tbcms", apiCms);

app.use("/api/transaction", apiTransaksi);
app.use("/api/paymentlinkqu", apiPaymentGateway);


// app.use("/api/test", apiUpload);
// app.use("/api/layanan", apiLayanan);
// app.use("/api/master", apiMaster);
// app.use("/api/lab", apiLab);
// app.use("/api/rad", apiRad);


// BUAT DRIVER

app.use("/api/driver", apiSignupDriver);

// END BUAT DRIVER


//SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("build"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
app.get("/privacy", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "privacy.html"));
});

//START WEB
// app.use("/api/auth", webAuth);
app.use(function (req, res, next) {
  res.status(404).send("Oops! Where are you going ?");
});
// if (process.env.NODE_ENV === "production") {
//   port = 5001;
// }



app.listen(port, () => {
  console.log("Server Running : ", port);
});
// models.sequelize
//   // .sync()
//   .authenticate()
//   .then((aw) => {
//     console.log({
//       env: process.env.NODE_ENV,
//       dbName: models.sequelize.getDatabaseName(),
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// let whereAddOn = {
//   ref_prod_nama: ["Vaksinasi Meningitis", "Vaksinasi Influenza"],
// };

// console.log({
//   where: {
//     ...whereAddOn,
//   },
// });


