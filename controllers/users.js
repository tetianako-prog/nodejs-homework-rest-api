const { usersService } = require('../service')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const signup = async (req, res, next) => {
  const { email, password, subscription } = req.body
  const user = await usersService.findUser(email)
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email in use',
      data: 'Conflict',
    })
  }
  try {
    const result = await usersService.createUser(email, password, subscription)
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await usersService.findUser(email)
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Email or password is wrong',
      data: 'Bad request',
    })
  }
  const payload = {
    id: user.id,
  }
  const token = jwt.sign(payload, secret, { expiresIn: '1h' })
  await usersService.updateToken(user.id, token)
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  })
}

const getCurrent = async (req, res, next) => {
  const { email } = req.user
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful: ${email}`,
    },
  })
}

const logout = async (req, res, next) => {
  const { id } = req.user
  await usersService.updateToken(id, null)
  return res.status(204).json({})
}

module.exports = {
  signup,
  login,
  getCurrent,
  logout,
}
