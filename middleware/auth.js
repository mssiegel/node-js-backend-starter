const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token

  // Set token from Bearer token in header or from cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) token = req.cookies.token

  // Make sure token exists
  if (!token) next(new ErrorResponse('Not authorized to access this route', 401))

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
  } catch (err) {
    next(new ErrorResponse('Not authorized to access this route', 401))
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    next(new ErrorResponse(`User role of ${req.user.role} is not authorized to access this route`, 403))
  }
  next()
}
