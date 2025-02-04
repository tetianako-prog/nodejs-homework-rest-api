const { usersService } = require('../service')
const { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET
const fs = require('fs').promises
const path = require('path')
const jimp = require('jimp')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

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
    const verifyToken = nanoid()
    const result = await usersService.createUser(
      email,
      password,
      subscription,
      verifyToken,
    )
    const msg = {
      to: result.email,
      from: 'tanja254@ukr.net',
      subject: 'Email verification',
      text: 'Email verification',
      html: `<a href="http://localhost:3000/api/users/verify/${verifyToken}">Verify email</a>`,
    }

    await sgMail.send(msg)
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
  if (!user || !user.validPassword(password) || !user.verify) {
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

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params
    const user = await usersService.findUserByField(verificationToken)

    if (user) {
      await usersService.updateVerify(user._id, true, null)
      return res.json({
        status: 'success',
        code: 200,
        message: 'Verification successful',
      })
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}

const repeatVerification = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await usersService.findUser(email)
    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'User not found',
      })
    }
    const { verify, verifyToken } = user
    if (!verify) {
      const msg = {
        to: email,
        from: 'tanja254@ukr.net',
        subject: 'Email verification',
        text: 'Email verification',
        html: `<a href="http://localhost:3000/api/users/verify/${verifyToken}">Verify email</a>`,
      }

      await sgMail.send(msg)
      return res.json({
        status: 'success',
        code: 200,
        data: {
          message: 'Verification email sent',
        },
      })
    }
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Verification has already been passed',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  getCurrent,
  logout,
  avatar,
  verify,
  repeatVerification,
}
