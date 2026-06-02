require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  paymentThreshold: Number(process.env.PENSION_PAYMENT_THRESHOLD || 100),
};
