const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/models.user');

const app = express();

app.post('/', (req, res) => {

  let body = req.body;

  const {email, password} = body;
  User.findOne({email: email}, (err, userData) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if(!userData) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: err,
      });
    };

    if(!bcrypt.compareSync(password, userData.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: err,
      });
    };

    // Crear token
    userData.password = ':)';

    const token = jwt.sign({
      user: userData
    }, 'Cch4vez.813', {expiresIn: 14400 /* 4h */ });

    res.status(200).json({
      ok: true,
      token,
      user: userData,
      id: userData._id,
    });
  });
});

module.exports = app;
