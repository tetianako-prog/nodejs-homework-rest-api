const Contacts = require('./schemas/contacts')

const getAllContacts = async () => {
  return Contacts.find()
}

const getContactById = id => {
  return Contacts.findOne({ _id: id })
}

const addContact = body => {
  return Contacts.create(body)
}

const removeContact = id => {
  return Contacts.findByIdAndRemove({ _id: id })
}

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true })
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
}
