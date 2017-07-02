/**
 * Eric's Gulpfile
 *
 * default theme in this format:
 *
 * ──THEME_NAME
 *      │
 *      ├────src
 *      │     │
 *      │     ├─js
 *      ├─js  └─sass
 *      └─css
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
// const path = require('path')
// const folders = require('gulp-folders')
const babel = require('gulp-babel')
const newer = require('gulp-newer')
// const cached           = require('gulp-cached')
// const newer_sass       = require('gulp-newer-sass')

// const concat           = require('gulp-concat')
let themes = []
themes.push('./')

const config = {
  sourceDir: 'src',
  jsSource: 'js',
  cssSource: 'sass',
  jsDestination: 'public/js',
  cssDestination: 'public/css'
}


const parseError = function () {
  if (this.plugin === 'gulp-sass') {
    this.fileParsed = this.relativePath.split('/').pop()
    this.messageParsed = this.messageOriginal
    this.lineParsed = this.line
    this.columnParsed = this.column

    this.errorParsed = this.messageFormatted
  } else if (this.plugin === 'gulp-babel') {
    // get the filename out of the message:
    this.messageParsed = this.message.replace(new RegExp(this.fileName + ': ', 'i'), '')
    this.messageParsed = this.messageParsed.replace(/.\((\d*:\d*)\)$/gi, '')

    // get the last item:
    this.fileParsed = this.fileName.split('/').pop()

    this.lineParsed = this.loc.line
    this.columnParsed = this.loc.column

    this.errorParsed = this.codeFrame
  }
  return this
}

// this is the error shown using plumber and notify:
const onError = function (err) {
  err = parseError.call(err)
  notify.onError({
    // title:    "Gulp Error",
    // message:  "<%= error.message %>",
    title: '<%= error.fileParsed %> error => line:<%= error.lineParsed %>, col:<%= error.columnParsed %>',
    message: '<%= error.messageParsed %>'

  })(err)

  // this is a good one for the terminal:
  console.log('\n' + err.errorParsed + '\n')

  this.emit('end')
}

// Uglifies / minifies JS
gulp.task('scripts', function () {
  themes.forEach(theme => {
    let source = `${theme}/${config.sourceDir}/${config.jsSource}/*.js*`
    let destination = `${theme}/${config.jsDestination}`
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
        sourceRoot: theme + '/' + config.sourceDir + '/' + config.jsSource,  //
        includeContent: true     // default is true, which includes the entire css in the sourcemap
      }))
      .pipe(gulp.dest(destination))
  })
})

// Styles Task
gulp.task('styles', function () {
  themes.forEach(theme => {
    gulp.src(theme + '/' + config.sourceDir + '/' + config.cssSource + '/' + '*.scss')
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
        sourceRoot: config.sourceDir + '/' + config.cssSource,  //
        includeContent: false     // default is true, which includes the entire css in the sourcemap
      }))
      // commented out below because it wasn't recognizing new files
      // .pipe(cached('sass_compile')) // so it only recompiles the file which changed
      .pipe(gulp.dest(theme + '/' + config.cssDestination))
  })
})

gulp.task('watch', function () {
  themes.map(theme => {
    gulp.watch(theme + '/' + config.sourceDir + '/' + config.jsSource + '/**/*.js', ['scripts'])
    gulp.watch(theme + '/' + config.sourceDir + '/' + config.jsSource + '/**/*.jsx', ['scripts'])
    gulp.watch(theme + '/' + config.sourceDir + '/' + config.cssSource + '/**/*.scss', ['styles'])
    livereload.listen() // start the livereload server
    gulp.watch([
      theme + '/' + '**/*.html',
      theme + '/' + '**/*.php',
      theme + '/' + '**/*.inc',
      theme + '/' + config.cssDestination + '/*.css',
      theme + '/' + config.jsDestination + '/*.js'
    ], event => livereload.changed(event.path)) // run livereload on the file
  })
})

// gulp.task('default', ['scripts', 'styles'])
gulp.task('default', ['scripts', 'styles', 'watch'])
