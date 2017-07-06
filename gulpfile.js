/**
 * Eric's Gulpfile
 *
 * default in this format:
 *
 * ─DOCROOT
 *     │
 *     ├─src
 *     │  ├─js
 *     │  └─sass
 *     │
 *     └─public
 *        ├─js
 *        └─css
 */

// requires:
const gulp = require('gulp')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const livereload = require('gulp-livereload')
const nodemon = require('gulp-nodemon')
// const path = require('path')
// const folders = require('gulp-folders')
const babel = require('gulp-babel')
const newer = require('gulp-newer')
// const cached           = require('gulp-cached')
// const newer_sass       = require('gulp-newer-sass')

// const concat           = require('gulp-concat')

const config = {
  jsSource: './src/js',
  jsDestination: './public/js',
  cssSource: './src/sass',
  cssDestination: './public/css',
  views: './views',
  app: './bin/www'
}

let parseError = (errorObj) => {
  if (errorObj.plugin === 'gulp-sass') {
    // console.log('here I am you great')
    errorObj.fileParsed = errorObj.relativePath.split('/').pop()
    errorObj.messageParsed = errorObj.messageOriginal
    errorObj.lineParsed = errorObj.line
    errorObj.columnParsed = errorObj.column

    errorObj.errorParsed = errorObj.messageFormatted
  } else if (errorObj.plugin === 'gulp-babel') {
    // get the filename out of the message:
    errorObj.messageParsed = errorObj.message.replace(new RegExp(errorObj.fileName + ': ', 'i'), '')
    errorObj.messageParsed = errorObj.messageParsed.replace(/.\((\d*:\d*)\)$/gi, '')

    // get the last item:
    errorObj.fileParsed = errorObj.fileName.split('/').pop()

    errorObj.lineParsed = errorObj.loc.line
    errorObj.columnParsed = errorObj.loc.column

    errorObj.errorParsed = errorObj.codeFrame
  }
  return errorObj
}

// this is the error shown using plumber and notify:
const onError = (errorObj) => {
  let parsedErrorObj = parseError(errorObj)
  notify.onError({
    // title:    "Gulp Error",
    // message:  "<%= error.message %>",
    title: '<%= error.fileParsed %> error => line:<%= error.lineParsed %>, col:<%= error.columnParsed %>',
    message: '<%= error.messageParsed %>'

  })(parsedErrorObj)

  // this is a good one for the terminal:
  console.log('\n' + parsedErrorObj.errorParsed + '\n')

  // errorObj.emit('end')
}

// Uglifies / minifies JS
gulp.task('scripts', () => {
  let source = `${config.jsSource}/*.js*`
  let destination = config.jsDestination
  gulp.src(source)
    .pipe(newer(destination))
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: onError}))
    .pipe(babel({
      presets: ['es2015', 'react']
      // plugins: ['transform-react-jsx']
    }))
    // .pipe(concat(folder + '.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./', {
      sourceRoot: config.jsSource,  //
      includeContent: true     // default is true, which includes the entire css in the sourcemap
    }))
    .pipe(gulp.dest(destination))
})

// Styles Task
gulp.task('styles', () => {
  gulp.src(`${config.cssSource}/*.scss`)
    .pipe(sourcemaps.init())
      .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      })
        .on('error', onError)
      )
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./', {
      sourceRoot: config.cssSource,  //
      includeContent: false     // default is true, which includes the entire css in the sourcemap
    }))
    // commented out below because it wasn't recognizing new files
    // .pipe(cached('sass_compile')) // so it only recompiles the file which changed
    .pipe(gulp.dest(config.cssDestination))
})

gulp.task('ejs', () => {
  return gulp.src(`${config.views}/**/*.ejs`)
    .pipe(livereload())
})

gulp.task('server', () => {
  nodemon({
    'script': config.app,
    'ignore': `${config.jsDestination}/*.js`
  })
})

gulp.task('watch', () => {
  livereload.listen() // start the livereload server
  gulp.watch(`${config.jsSource}/**/*.js`, ['scripts'])
  gulp.watch(`${config.jsSource}/**/*.jsx`, ['scripts'])
  gulp.watch(`${config.cssSource}/**/*.scss`, ['styles'])
  gulp.watch(`${config.views}/**/*.ejs`, ['ejs'])
  gulp.watch([
    './**/*.md',
    `${config.cssDestination}/*.css`,
    `${config.jsDestination}/*.js`
  ], event => livereload.changed(event.path)) // run livereload on the file
})

gulp.task('default', ['scripts', 'styles', 'server', 'watch'])
// gulp.task('default', ['scripts', 'styles', 'watch'])
