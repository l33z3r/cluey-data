var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  gulp.src(['src/main.js'])
      .pipe(browserify())
      .pipe(concat('cluey-data.js'))
      .pipe(gulp.dest('build'));
})

gulp.task('default', function() {
  gulp.run('scripts');

  gulp.watch('src/**', function(event) {
    gulp.run('scripts');
  });
});
