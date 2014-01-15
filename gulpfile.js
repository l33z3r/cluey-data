var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

gulp.task('scripts', function() {
  gulp.src(['src/main.js'])
      // .pipe(jshint())
      // .pipe(jshint.reporter('default'))
      .pipe(browserify())
      .pipe(concat('cluey-data.js'))
      // .pipe(uglify())
      .pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
  gulp.src(['src/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('default', function() {
  gulp.run('scripts');

  gulp.watch('src/**', function(event) {
    gulp.run(['lint', 'scripts']);
  });
});
