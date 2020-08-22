const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const cookieParser = require('cookie-parser')

const app = express()

// Set view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security http header
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter)

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSql query injection
app.use(mongoSanitize())

// Data sanitization against NoSql query injection
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuality',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// Routes
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)


// Non existing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})


//Global error handler
app.use(globalErrorHandler)

module.exports = app