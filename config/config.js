module.exports = {
  development: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: process.env.DEV_DB_RDS_NAME,
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
  },
};
