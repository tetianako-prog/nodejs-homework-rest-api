const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

const routerApi = require('./api')
require('./config/config-passport')
app.use('/api/contacts', routerApi.contacts)
app.use('/api/users', routerApi.users)

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found',
  })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  })
})

module.exports = app
