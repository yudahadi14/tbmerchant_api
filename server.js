const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const routeDoctor = require("./routes/api/doctor");
const apiAuth = require("./routes/api/auth");
const apiLayanan = require("./routes/api/layanan");
const apiMaster = require("./routes/api/master");
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
      description: "RSUDC API",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "http://api.rsudcengkareng.com:5001/api"
            : "http://localhost:5001/api",
      },
    ],
  },
  apis: ["./routes/api/*.js"],
};
const specs = swaggerJsDoc(options);
const routeSimrs = require("./routes/api/simrs");
const auth = require("./middleware/authMid");
const base64ToFile = require("./helpers/utility/base64ToFile");
// const routeService = require("./routes/api/service");

let port = 5001;
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
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/doctor", routeDoctor);
app.use("/api/simrs", routeSimrs);
app.use("/api/auth", apiAuth);
app.use("/api/layanan", apiLayanan);
app.use("/api/master", apiMaster);

//SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", auth, express.static(path.join(__dirname, "public")));
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
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

models.sequelize
  // .sync()
  .authenticate()
  .then((aw) => {
    console.log({
      env: process.env.NODE_ENV,
      dbName: models.sequelize.getDatabaseName(),
    });
  })
  .catch((err) => {
    console.log(err);
  });
