module.exports = {
  development: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: process.env.DEV_DB_RDS_NAME,
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  developmentDriver: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: 'tb_driver',
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  developmentCustomer: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: 'tb_customer',
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  developmentCMS: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: 'tb_admin',
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DEV_DB_RDS_USERNAME,
    password: process.env.DEV_DB_RDS_PASSWORD,
    database: 'production_tolongbeliin',
    host: process.env.DEV_DB_RDS_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT_SIM,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
};