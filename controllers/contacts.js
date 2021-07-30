const { contactsService } = require('../service')

const get = async (req, res, next) => {
  try {
    const userId = req.user.id
    const results = await contactsService.getAllContacts(userId)
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
      },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const getById = async (req, res, next) => {
  const userId = req.user.id
  const { contactId: id } = req.params
  try {
    const result = await contactsService.getContactById(userId, id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const create = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await contactsService.addContact(req.body, userId)

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: result },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const update = async (req, res, next) => {
  const userId = req.user.id
  const { contactId: id } = req.params
  try {
    const result = await contactsService.updateContact(userId, id, req.body)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const updateContactStatus = async (req, res, next) => {
  const userId = req.user.id
  const { contactId: id } = req.params
  if (!Object.prototype.hasOwnProperty.call(req.body, 'favorite')) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: 'missing field favorite',
    })
    return
  }
  try {
    const result = await contactsService.updateContact(userId, id, req.body)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const remove = async (req, res, next) => {
  const userId = req.user.id
  const { contactId: id } = req.params
  console.log(typeof userId)
  console.log(typeof req.params.contactId)

  try {
    const result = await contactsService.removeContact(userId, id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

module.exports = {
  get,
  getById,
  create,
  remove,
  update,
  updateContactStatus,
}
