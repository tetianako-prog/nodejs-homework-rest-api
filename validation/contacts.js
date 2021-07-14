const Joi = require('joi')
const phoneNumberJoi = Joi.extend(require('joi-phone-number'))

const schemaCreateContact = Joi.object({
  name: Joi.string()
    .regex(/^\w+(?:\s+\w+)*$/)
    .min(3)
    .max(45)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: phoneNumberJoi.string().phoneNumber().required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .regex(/^\w+(?:\s+\w+)*$/)
    .min(3)
    .max(45)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: phoneNumberJoi.string().phoneNumber().optional(),
})

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Request',
    })
  }
  next()
}

module.exports.validateCreateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}

module.exports.validateUpdateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
