const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bCrypt = require('bcryptjs')
const gravatar = require('gravatar')

const user = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      required: [true, 'Sunsrc is required'],
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true)
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  {
    versionKey: false,
  },
)

user.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6))
}

user.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password)
}

const User = mongoose.model('user', user)

module.exports = User
