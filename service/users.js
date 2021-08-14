const User = require('./schemas/user')

const findUser = email => {
  return User.findOne({ email })
}

const createUser = (email, password, subscription, verifyToken) => {
  const newUser = new User({ email, subscription, verifyToken })
  newUser.setPassword(password)
  return newUser.save()
}

const updateToken = (id, token) => {
  return User.updateOne({ _id: id }, { token })
}

const updateUserAvatar = (userId, url) => {
  return User.findOneAndUpdate(
    { _id: userId },
    { avatarURL: url },
    {
      new: true,
    },
  )
}

const findUserByField = verifyToken => {
  return User.findOne({ verifyToken })
}

const updateVerify = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken })
}

module.exports = {
  findUser,
  createUser,
  updateToken,
  updateUserAvatar,
  findUserByField,
  updateVerify,
}
