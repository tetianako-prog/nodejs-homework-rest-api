const app = require('../app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const uriDb = process.env.DB_HOST

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

connection
  .then(() => {
    app.listen(PORT, async function () {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`),
  )
