const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const karyaRoutes = require('./src/routes/karya')
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/karya', karyaRoutes);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => app.listen(process.env.PORT || 8080, () => console.log("im working")))
.catch( err => console.log(err));