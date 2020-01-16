// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicialización de variables
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Conexión a la BDD
mongoose.connection.openUri('mongodb://localhost:27017/productsDB',{ useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if(err) throw err;
  console.log(`Base de datos: \x1b[32m%s\x1b[0m`, 'online');
})

// Importar Rutas
const appRoutes = require('./src/routes/routes.app');
const userRoutes = require('./src/routes/routes.user');
const branchRoutes = require('./src/routes/routes.branch');
const productRoutes = require('./src/routes/routes.product');
const categoryRoutes = require('./src/routes/routes.category');
const authRoutes = require('./src/routes/routes.auth');

// Middleware
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/branch', branchRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
  console.log(`Servidor corriendo en puerto 3000: \x1b[32m%s\x1b[0m`, 'online');
});
