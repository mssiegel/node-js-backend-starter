const fs = require('fs')
const mongoose = require('mongoose')
require('colors')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./models/Bootcamp')
const User = require('./models/User')
const Course = require('./models/Course')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await User.create(users)
    await Course.create(courses)
    console.log('Data Imported...'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await User.deleteMany()
    await Course.deleteMany()
    console.log('Data Destroyed...'.red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
