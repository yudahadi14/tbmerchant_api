module.exports = {
  development: {
    username: process.env.DEV_DB_USER_SIM,
    password: process.env.DEV_DB_PASS_SIM,
    database: process.env.DEV_DB_NAME_SIM,
    host: process.env.DEV_DB_HOST_SIM,
    dialect: process.env.DEV_DB_DIALECT_SIM,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.PROD_DB_USER_SIM,
    password: process.env.PROD_DB_PASS_SIM,
    database: process.env.PROD_DB_NAME_SIM,
    host: process.env.PROD_DB_HOST_SIM,
    dialect: process.env.PROD_DB_DIALECT_SIM,
  },
  siknet: {
    username: "user33",
    password: "Password1234",
    database: "siknet_rs",
    host: "172.18.38.50",
    dialect: "mssql",
  },
  simrs: {
    username: "admin",
    password: "admin",
    database: "rsudc",
    host: "192.168.200.12",
    dialect: "postgres",
  },
};
