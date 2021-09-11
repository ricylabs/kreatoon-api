const express = require('express');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const karyaRoutes = require('./src/routes/karya');
const userRoutes = require('./src/routes/user');
const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    components: {},
    info: {
      title: 'Kreatoon API',
      desciption: 'API for Kreatoon App'
    },
    contact: {
        name: 'Sadad'
    },
    servers: [
        { url: 'http://localhost:8080'},
        { url: 'https://kreatoon-ylabs.herokuapp.com'}
    ]
  },
  apis: ['index.js', './src/routes/*.js'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.get('/', (req, res) => res.send('halo'));

/**
 * @swagger
 * tags: 
 *  name: User
 *  description: User managing API 
 */

/**
 * @swagger
 * tags:
 *  name: Karya
 *  description: Karya managing API
 */
app.use('/auth', authRoutes);
app.use('/karya', karyaRoutes);
app.use('/user', userRoutes);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => app.listen(process.env.PORT || 8080, () => console.log("im working")))
.catch( err => console.log(err));