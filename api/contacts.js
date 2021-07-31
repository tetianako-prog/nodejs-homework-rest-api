const express = require('express')
const router = express.Router()
const { ctrlContacts } = require('../controllers')
const { auth } = require('../guard/auth')
const {
  validateCreateContact,
  validateUpdateContact,
} = require('../validation/contacts')

router.get('/', auth, ctrlContacts.get)

router.get('/:contactId', auth, ctrlContacts.getById)

router.post('/', auth, validateCreateContact, ctrlContacts.create)

router.put('/:contactId', auth, validateUpdateContact, ctrlContacts.update)

router.patch('/:contactId/favorite', auth, ctrlContacts.updateContactStatus)

router.delete('/:contactId', auth, ctrlContacts.remove)

module.exports = router
