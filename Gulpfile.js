/*
    Runs the node process and automatically restart it after a change has been
    detected in the files within this project.
*/
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    spawn = require('child_process').spawn,
    node;

gulp.task('clear-cache', function() {
    return del(['cache/*']);
});

gulp.task('lint', function() {
  return gulp.src(['./*.js', './routes/*.js', './services/*.js', './test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('serve', function() {
  if (node) {
      node.kill();
  }
  node = spawn('node', ['index.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gutil.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', function() {
    gulp.watch(['./index.js', './routes/*.js', './services/*.js'], ['serve']);
});

gulp.task('default', gulp.series('lint', 'serve', 'watch'));

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) {
        node.kill();
    }
});
