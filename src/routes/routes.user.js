const express = require('express');
const bcrypt = require('bcryptjs');

const mdAuth = require('./../middlewares/middlewares.auth');

const User = require('./../models/models.user');
const app = express();

//===============
// Obtener todos los usuarios
//===============

app.get('/', mdAuth.tokenVerify, (req, res, next) => {

  // Pagination from
  let from = req.query.from || 0;
  from = Number(from);

  User.find({}, 'name email image role')
  // Pagination skipping
  .skip(from)
  // Limit number of results
  .limit(5)
  .exec(
    (err, users) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando usuarios',
          errors: err
        });
      };

      User.count({}, (err, count) => {
        if(err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando usuarios',
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          total: count,
          users,
        });
      });
    }
  );
});



//===============
// Actualizar usuario
//===============

app.put('/:id', mdAuth.tokenVerify, (req, res) => {
  let id = req.params.id;

  let body = req.body;

  const {name, email, password, img, role} = body;

  User.findById( id, (err, user) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err,
      });
    };

    if(!user) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado usuario con id:' + id,
        errors: {message: 'No existe usuario con ese id'},
      });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    user.save((err, userSaved) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err,
        });
      }

      userSaved.password = ':)';

      res.status(200).json({
        ok: true,
        user: userSaved,
      });
    })
  });

});

//===============
// Crear nuevo usuario
//===============

app.post('/', mdAuth.tokenVerify, (req, res) => {

  let body = req.body;

  const {name, email, password, img, role} = body;

  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    img,
    role
  });

  user.save((err, userSaved) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    };

    res.status(201).json({
      ok: true,
      user: userSaved,
      userToken: req.user
    });
  });
});

//===============
// Eliminar usuario usando ID
//===============

app.delete('/:id', mdAuth.tokenVerify, (req, res, next) => {

  let id = req.params.id;

  User.findByIdAndRemove(id, (err, userDeleted) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    };

    if(!userDeleted) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha encontrado usuario con id:' + id,
        errors: {message: 'No existe usuario con ese id'},
      });
    }

    res.status(201).json({
      deleted: true,
      user: userDeleted
    });
  })
})

module.exports = app;
