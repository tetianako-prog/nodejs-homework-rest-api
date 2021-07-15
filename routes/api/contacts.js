const express = require('express')
const router = express.Router()
const model = require('../../model')
const {
  validateCreateContact,
  validateUpdateContact,
} = require('../../validation/contacts')

router.get('/', async (req, res, next) => {
  try {
    const data = await model.listContacts()
    res.json({ status: 'success', code: 200, data })
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const data = await model.getContactById(contactId)
  if (data) {
    res.json({
      code: 200,
      data: { data },
    })
  } else {
    res.status(404).json({
      code: 404,
      message: 'Not found',
    })
  }
})

router.post('/', validateCreateContact, async (req, res, next) => {
  console.log(req.body)
  const data = await model.addContact(req.body)
  res.status(201).json({
    status: 'success',
    code: 201,
    data,
  })
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const data = await model.removeContact(contactId)
  if (data) {
    res.json({
      status: 200,
      message: 'contact deleted',
    })
  } else {
    res.status(404).json({
      status: 404,
      message: 'Not found',
    })
  }
})

router.patch('/:contactId', validateUpdateContact, async (req, res, next) => {
  const { contactId } = req.params
  const data = await model.updateContact(contactId, req.body)
  if (data) {
    res.json({
      status: 200,
      data,
    })
  } else {
    res.status(404).json({
      status: 404,
      message: 'Not found',
    })
  }
})

module.exports = router
