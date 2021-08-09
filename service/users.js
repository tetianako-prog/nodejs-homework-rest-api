const User = require('./schemas/user')

const findUser = email => {
  return User.findOne({ email })
}

const createUser = (email, password, subscription) => {
  const newUser = new User({ email, subscription })
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

module.exports = {
  findUser,
  createUser,
  updateToken,
  updateUserAvatar,
}
