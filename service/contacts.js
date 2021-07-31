const Contact = require('./schemas/contact')

const getAllContacts = userId => {
  return Contact.find({ owner: userId }).populate('owner')
}

const getContactById = (userId, id) => {
  return Contact.findOne({ _id: id, owner: userId }).populate('owner')
}

const addContact = (body, userId) => {
  return Contact.create({ ...body, owner: userId })
}

const removeContact = (userId, id) => {
  return Contact.findOneAndRemove({ _id: id, owner: userId })
}

const updateContact = (userId, id, fields) => {
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, fields, {
    new: true,
  })
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
