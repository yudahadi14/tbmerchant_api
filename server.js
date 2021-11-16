const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const routeDoctor = require("./routes/api/doctor");
// const routeService = require("./routes/api/service");

let port = 5001;
const app = express();
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
app.use(express.json());
app.use("/api/doctor", routeDoctor);
// app.use("/api/service", routeService);

app.use(function (req, res, next) {
  res.status(404).send("Oops! Where are you going ?");
});

if (process.env.NODE_ENV === "production") {
  port = 2001;
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server Running : ", port);
});
