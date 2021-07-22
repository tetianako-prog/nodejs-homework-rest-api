const service = require('../service')

const get = async (req, res, next) => {
  try {
    const results = await service.getAllContacts()
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
  const { contactId: id } = req.params
  try {
    const result = await service.getContactById(id)
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
    const result = await service.addContact(req.body)

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
  const { contactId: id } = req.params
  try {
    const result = await service.updateContact(id, req.body)
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
    const result = await service.updateContact(id, req.body)
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
  const { contactId: id } = req.params

  try {
    const result = await service.removeContact(id)
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
