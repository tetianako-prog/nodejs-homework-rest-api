const { nanoid } = require('nanoid')
const { readFile, writeFile } = require('./helpers')

const listContacts = async () => {
  const contactsList = await readFile()
  return contactsList
}

const getContactById = async contactId => {
  const contactsList = await readFile()
  const contact = contactsList.find(item => item.id.toString() === contactId)
  return contact
}

const removeContact = async contactId => {
  const contactsList = await readFile()
  const contact = contactsList.find(item => item.id.toString() === contactId)
  if (!contact) {
    return null
  }
  const newContacts = contactsList.filter(
    item => item.id.toString() !== contactId,
  )
  await writeFile(newContacts)
  return contact
}

const addContact = async body => {
  const contactsList = await readFile()
  const newContact = { id: nanoid(), ...body }
  contactsList.push(newContact)
  await writeFile(contactsList)
  return newContact
}

const updateContact = async (contactId, body) => {
  const contactsList = await readFile()
  const contactIndex = contactsList.findIndex(
    item => item.id.toString() === contactId,
  )
  if (contactIndex === -1) {
    return null
  }
  contactsList[contactIndex] = { ...contactsList[contactIndex], ...body }
  await writeFile(contactsList)
  return contactsList[contactIndex]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
