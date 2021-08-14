const Joi = require('joi')

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  subscription: Joi.string().valid('starter', 'pro', 'business').optional(),
  verify: Joi.boolean(),
  verifyToken: Joi.string(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
})

const schemaVerificationUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
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

module.exports.validateCreateUser = (req, res, next) => {
  return validate(schemaCreateUser, req.body, next)
}

module.exports.validateLoginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next)
}

module.exports.validateVerificationUser = (req, res, next) => {
  return validate(schemaVerificationUser, req.body, next)
}
