const express = require('express');

const mdAuth = require('./../middlewares/middlewares.auth');

const Branch = require('./../models/models.branch');

const app = express();

//===============
// Obtener sucursales
//===============

app.get('/', mdAuth.tokenVerify, (req, res, next) => {
  Branch.find({}).exec(
    (err, branches) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando sucursales',
          errors: err
        });
      };

      res.status(200).json({
        ok: true,
        branches,
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

  const {branchName, branchAddress} = body;

  Branch.findById( id, (err, branch) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar sucursal',
        errors: err,
      });
    };

    if(!branch) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado sucursal con id:' + id,
        errors: {message: 'No existe sucursal con ese id'},
      });
    }

    branch.branchName = branchName;
    branch.branchAddress = branchAddress;

    branch.save((err, branchSaved) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar sucursal',
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        branch: branchSaved,
      });
    })
  });

});


//===============
// Agregar sucursal
//===============

app.post('/', mdAuth.tokenVerify, (req, res, next) => {
  let body = req.body;

  const {branchName, branchAddress, user} = body;

  const branch = new Branch({
    user,
    branchName,
    branchAddress,
  });

  branch.save((err, branchSaved) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear sucursal',
        errors: err
      });
    };

    res.status(201).json({
      ok: true,
      user: branchSaved,
      userToken: req.user
    });
  });
});


//===============
// Eliminar sucursal
//===============

app.delete('/:id', mdAuth.tokenVerify, (req, res, next) => {

  let id = req.params.id;

  Branch.findByIdAndRemove(id, (err, branchDeleted) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar sucursal',
        errors: err
      });
    };

    if(!branchDeleted) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado sucursal con id:' + id,
        errors: {message: 'No existe sucursal con ese id'},
      });
    }

    res.status(201).json({
      deleted: true,
      branch: branchDeleted
    });
  })
})

module.exports = app;
