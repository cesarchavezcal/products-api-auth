const express = require('express');

const mdAuth = require('../middlewares/middlewares.auth');

const Product = require('../models/models.product');

const app = express();

//===============
// Obtener sucursales
//===============

app.get('/', mdAuth.tokenVerify, (req, res, next) => {
  // Pagination from
  let from = req.query.from || 0;
  from = Number(from);

  Product.find({})
  // Pagination skipping
  .skip(from)
  // Limit number of results
  .limit(5)
  .populate('user', 'name email')
  .populate('productCategory', 'categoryName')
  .populate('branch', 'branchName branchAddress').exec(
    (err, products) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando productos',
          errors: err
        });
      };

      Product.count({}, (err, count) => {
        if(err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando productos',
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          total: count,
          products,
        });
      });
    }
  );
});

//===============
// Actualizar sucursal
//===============

app.put('/:id', mdAuth.tokenVerify, (req, res) => {
  let id = req.params.id;

  let body = req.body;

  const {user, branch, productName, productPrice, productCategory, productQuantity} = body;

  Product.findById( id, (err, product) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar sucursal',
        errors: err,
      });
    };

    if(!product) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado sucursal con id:' + id,
        errors: {message: 'No existe sucursal con ese id'},
      });
    }

    product.user = user,
    product.branch = branch,
    product.productName = productName,
    product.productPrice = productPrice,
    product.productCategory = productCategory,
    product.productQuantity = productQuantity

    product.save((err, productSaved) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar producto',
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        product: productSaved,
      });
    })
  });

});


//===============
// Agregar sucursal
//===============

app.post('/', mdAuth.tokenVerify, (req, res, next) => {
  let body = req.body;

  const {user, branch, productName, productPrice, productCategory, productQuantity} = body;

  const product = new Product({
    user,
    branch,
    productName,
    productPrice,
    productCategory,
    productQuantity
  });

  product.save((err, productSaved) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear producto',
        errors: err
      });
    };

    res.status(201).json({
      ok: true,
      product: productSaved,
      userToken: req.user
    });
  });
});


//===============
// Eliminar sucursal
//===============

app.delete('/:id', mdAuth.tokenVerify, (req, res, next) => {

  let id = req.params.id;

  Product.findByIdAndRemove(id, (err, productDeleted) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar producto ',
        errors: err
      });
    };

    if(!productDeleted) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado producto con id:' + id,
        errors: {message: 'No existe producto con ese id'},
      });
    }

    res.status(201).json({
      deleted: true,
      product: productDeleted
    });
  })
})

module.exports = app;
