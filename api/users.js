const express = require('express')
const router = express.Router()
const { ctrlUsers } = require('../controllers')
const { auth } = require('../guard/auth')
const {
  validateCreateUser,
  validateLoginUser,
  validateVerificationUser,
} = require('../validation/users')
const upload = require('../multer/multer')

router.post('/signup', validateCreateUser, ctrlUsers.signup)

router.post('/login', validateLoginUser, ctrlUsers.login)

router.get('/current', auth, ctrlUsers.getCurrent)

router.post('/logout', auth, ctrlUsers.logout)

router.patch('/avatar', auth, upload.single('avatar'), ctrlUsers.avatar)

router.get('/verify/:verificationToken', ctrlUsers.verify)

router.post('/verify', validateVerificationUser, ctrlUsers.repeatVerification)

module.exports = router
