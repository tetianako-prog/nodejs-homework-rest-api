const { usersService } = require('../service')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET
const fs = require('fs').promises
const path = require('path')
const jimp = require('jimp')

const AVATARS_DIR = path.join(__dirname, '../', 'public', 'avatars')
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
  return res.status(204)
}

const avatar = async (req, res, next) => {
  console.log(req.file)
  const { id } = req.user
  console.log(id)
  if (req.file) {
    const { file } = req
    const img = await jimp.read(file.path)
    await img
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(file.path)
    await fs.rename(
      file.path,
      path.join(AVATARS_DIR, `${id}.${file.originalname.split('.')[1]}`),
    )

    const url = path.join(
      'public/avatars/',
      `${id}.${file.originalname.split('.')[1]}`,
    )
    const user = await usersService.updateUserAvatar(id, url)
    res.json({
      message: 'Файл успешно загружен',
      status: 'success',
      code: 200,
      data: {
        avatarURL: user.avatarURL,
      },
    })
  }
}

module.exports = {
  signup,
  login,
  getCurrent,
  logout,
  avatar,
}
