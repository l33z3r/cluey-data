var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

gulp.task('development', function() {
  gulp.src(['src/main.js'])
    .pipe(browserify())
    .pipe(concat('cluey-data.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('production', function() {
  gulp.run('lint');
  gulp.src(['src/main.js'])
    .pipe(browserify())
    .pipe(concat('cluey-data.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
  gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', function() {
  gulp.run('development');

  gulp.watch('src/**/*.js', function(event) {
    gulp.run('development');
  });
});
