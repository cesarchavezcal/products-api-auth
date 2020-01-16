
const express = require('express');

const mdAuth = require('../middlewares/middlewares.auth');

const Category = require('../models/models.category');

const app = express();

//===============
// Obtener sucursales
//===============

app.get('/', mdAuth.tokenVerify, (req, res, next) => {
  // Pagination from
  let from = req.query.from || 0;
  from = Number(from);

  Category.find({})
  // Pagination skipping
  .skip(from)
  // Limit number of results
  .limit(5)
  .populate('user', 'name email')
  .exec(
    (err, categories) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando categorías',
          errors: err
        });
      };

      Category.count({}, (err, count) => {
        if(err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando categorías',
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          total: count,
          categories,
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

  const {categoryName} = body;

  Category.findById( id, (err, category) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar categoria',
        errors: err,
      });
    };

    if(!category) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado categoría con id:' + id,
        errors: {message: 'No existe categoría con ese id'},
      });
    }

    category.categoryName = categoryName;

    category.save((err, categorySaved) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar categoría',
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        category: categorySaved,
      });
    })
  });

});


//===============
// Agregar sucursal
//===============

app.post('/', mdAuth.tokenVerify, (req, res, next) => {
  let body = req.body;

  const {categoryName, user} = body;

  const category = new Category({
    user,
    categoryName,
  });

  category.save((err, categorySaved) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear categoría',
        errors: err
      });
    };

    res.status(201).json({
      ok: true,
      category: categorySaved,
      userToken: req.user
    });
  });
});


//===============
// Eliminar sucursal
//===============

app.delete('/:id', mdAuth.tokenVerify, (req, res, next) => {

  let id = req.params.id;

  Category.findByIdAndRemove(id, (err, categoryDeleted) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar categoría',
        errors: err
      });
    };

    if(!categoryDeleted) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado categoría con id:' + id,
        errors: {message: 'No existe categoría con ese id'},
      });
    }

    res.status(201).json({
      deleted: true,
      category: categoryDeleted
    });
  })
})

module.exports = app;
