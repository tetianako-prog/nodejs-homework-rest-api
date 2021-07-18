const express = require('express')
const router = express.Router()
const ctrlContacts = require('../controller')
const {
  validateCreateContact,
  validateUpdateContact,
} = require('../validation/contacts')

router.get('/contacts', ctrlContacts.get)

router.get('/contacts/:contactId', ctrlContacts.getById)

router.post('/contacts', validateCreateContact, ctrlContacts.create)

router.put('/contacts/:contactId', validateUpdateContact, ctrlContacts.update)

router.patch('/contacts/:contactId/favorite', ctrlContacts.updateContactStatus)

router.delete('/contacts/:contactId', ctrlContacts.remove)

module.exports = router
