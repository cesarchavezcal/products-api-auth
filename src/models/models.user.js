const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const roleValidator = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un role permitido',
};

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is necessary'] ,
  },
  email: {
    type: String,
    required: [true, 'Email is necessary'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is necessary'],
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: [true],
    default: 'USER_ROLE',
    enum: roleValidator,
  },
});

userSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'})

module.exports = mongoose.model('User', userSchema);
