const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const marked = require('marked')
const fs = require('fs')

const app = express()

const siteMeta = require('./content/site-meta.config.js')
const index = require('./routes/index')

fs.readFile('./content/about.md', 'utf8', (err, aboutContent) => {
  if (err) throw err
  app.locals.about = marked(aboutContent)
})

// add the siteMeta to the app.locals variable:
app.locals.siteMeta = siteMeta

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  if (err.status === 404) {
    res.render('404')
  } else {
    res.render('error')
  }
})

module.exports = app
