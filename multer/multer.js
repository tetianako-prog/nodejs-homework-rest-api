const path = require('path')
require('dotenv').config()

const multer = require('multer')
const UPLOAD_DIR = path.join(__dirname, '../', process.env.UPLOAD_DIR)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  limits: {
    fileSize: 2000000,
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      console.log(__dirname)
      return
    }
    cb(null, false)
  },
})

module.exports = upload
