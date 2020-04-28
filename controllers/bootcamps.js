const cloudinary = require('cloudinary').v2
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../utils/async')
const Bootcamp = require('../models/Bootcamp')

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults)
})

// @desc      Get single bootcamps
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

  return res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Create new bootcamps
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))
  }

  const bootcamp = await Bootcamp.create(req.body)

  return res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

  // Make sure user is bootcamp owner or an admin
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  return res.status(200).json({ success: true, data: bootcamp })
})

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

  // Make sure user is bootcamp owner or an admin
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401))
  }

  bootcamp.remove()

  return res.status(200).json({ success: true, data: {} })
})

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

  // Make sure user is bootcamp owner or an admin
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
  }

  if (!req.files) return next(new ErrorResponse('Please upload a file', 400))

  const file = req.files.file

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) return next(new ErrorResponse('Please upload an image file', 400))

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `, 400))
  }

  // Create custom filename
  // file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`

  // Upload new image
  const image = await cloudinary.uploader.upload(file.tempFilePath, { public_id: `bootcamps/${bootcamp.id}` })

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: image.secure_url })

  return res.status(200).json({
    success: true,
    data: image.secure_url,
  })
})
