const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
require('colors')
// const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
// const cloudinary = require('cloudinary').v2
const errorHandler = require('./middleware/error')
const ErrorResponse = require('./utils/errorResponse')
const connectDB = require('./config/db')

// Load environment vairables
dotenv.config({ path: './config/config.env' })

/*
// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
*/

// Connect to database
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middlware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

/*
// File upload
app.use(
  fileupload({
    useTempFiles: true,
  }),
)
*/

// Sanitize data against NoSQL injections
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
const corsWhitelist = process.env.CORS_WHITELIST.split(' ')
const corsOptions = {
  origin(origin, callback) {
    if (corsWhitelist.includes(origin) || !origin) callback(null, true)
    else callback(new ErrorResponse('Not allowed by CORS', 401))
  },
}
app.use(cors(corsOptions))

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
/* app.get('/', (req, res) => {
  return res.sendFile('public/apiDocumentation.html', { root: __dirname })
}) */

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold),
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.name}: ${err.message}`.red)
  console.error(err)
  // Close server & exit process
  server.close(() => process.exit(1))
})
