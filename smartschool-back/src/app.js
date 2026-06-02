
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const reportingRoutes = require("./modules/reporting/reporting.routes");

const financeRoutes = require('./modules/finance/finance.routes');

const app = express();


const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(morgan('dev'));

app.use("/reporting", reportingRoutes);

// const authRoutes = require('./modules/auth/auth.routes');
const academiqueRoutes = require('./modules/academique/academique.routes');


app.use('/api/auth', require('./modules/auth/auth.routes'));


// Routes du module Admin
const adminRoutes = require('./modules/admin/admin.routes');
app.use('/api/admin', adminRoutes);

app.use('/finance', financeRoutes);


const scolariteRoutes = require('./modules/scolarite/scolarite.routes');
// Middlewares globaux

app.use('/api/scolarite', scolariteRoutes);

// Route test
app.get("/", (req, res) => {
  res.json({ message: "SmartSchool API running" });
});


// app.use('/api/auth', authRoutes);
app.use('/api/academique', academiqueRoutes);


module.exports = app;
