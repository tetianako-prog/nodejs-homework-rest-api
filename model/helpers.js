const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.join(__dirname, 'contacts.json')

const readFile = async () => {
  const contactsList = await fs.readFile(contactsPath)
  return JSON.parse(contactsList)
}

const writeFile = async data => {
  await fs.writeFile(contactsPath, JSON.stringify(data))
}

module.exports = {
  readFile,
  writeFile,
}
