const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor, indique su nombre de usuario'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, indique su correo'],
    unique: [true, 'Este correo ya está registrado'],
    validate: [validator.isEmail, 'El correo no es válido'],
  },
  password: {
    type: String,
    required: [true, 'Por favor, indique su contraseña'],
    minlength: [8, 'Introduzca mínimo 8 caracteres'],
    maxlength: [20, 'Introduzca máximo 20 caracteres'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Debe confirmar la contraseña'],
    minlength: [8, 'Introduzca mínimo 8 caracteres'],
    maxlength: [20, 'Introduzca máximo 20 caracteres'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Las contraseñas no coinciden',
    },
  },
  passwordChangedAt: Date,
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  /* 
   Ejecutar sólo si la contraseña ha sido cambiada.
   Eso es porque utilziamos "save" para actualizar valores
   De lo contrario, los validadores personalizados no se ejecutan
    */
  if (!this.isModified('password')) return next();
  // Encriptación de contraseña
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  next();
});

userSchema.pre('save', function (next) {
  /* No ejecutar con "create", pero si cuando password se modifique */
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

// Func comprobar contraseña encriptada
userSchema.methods.checkPassword = async function (
  candidatePassword,
  storedPassword
) {
  return await bcrypt.compare(candidatePassword, storedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
