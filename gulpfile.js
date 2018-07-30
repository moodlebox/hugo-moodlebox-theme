var gulp = require('gulp')
// var concat = require('gulp-concat')
var minify = require('gulp-clean-css')
var uglify = require('gulp-uglify')
var beautify = require('gulp-jsbeautifier')
var replace = require('gulp-replace')
var rename = require('gulp-ext-replace')
var gulpif = require('gulp-if')
var exec = require('child_process').exec
var del = require('del')

gulp.task('reset', function () {
  return del([
    'exampleSite/public',
    'exampleSite/static',
    'exampleSite/resources'
  ])
})

gulp.task('css', function () {
  return gulp.src(['exampleSite/static/css/**/*.css', 'static/css/**/*.css'])
    .pipe(gulpif(file => !(file.path.includes('.min.css')), rename('min.css')))
    // .pipe(concat('main.css'))
    .pipe(minify())
    .pipe(gulp.dest('exampleSite/static/css'))
})

gulp.task('js', function () {
  return gulp.src(['exampleSite/static/js/**/*.js', 'static/js/**/*.js'])
    .pipe(gulpif(file => !(file.path.includes('.min.js')), rename('min.js')))
    // .pipe(concat('main.css'))
    .pipe(uglify())
    .pipe(gulp.dest('exampleSite/static/js'))
})

gulp.task('html', function () {
  return gulp.src(['exampleSite/public/**/*.html', 'exampleSite/public/**/*.xml'])
    .pipe(beautify({indent_char: ' ', indent_size: 2}))
    .pipe(replace(/^\s*\r?\n/gm, ''))
    .pipe(gulp.dest('exampleSite/public'))
})

gulp.task('hugo', gulp.series('reset', 'css', 'js', function (fetch) {
  return exec('/snap/bin/hugo --source exampleSite', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
    fetch(err)
  })
}))

gulp.task('default', gulp.series('hugo', 'html', 'reset'))
