const app = require('../app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const uriDb = process.env.DB_HOST
const fs = require('fs').promises
require('dotenv').config()
const path = require('path')
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR)

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder)
  }
}

connection
  .then(() => {
    app.listen(PORT, async function () {
      createFolderIsNotExist(uploadDir)
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  )
