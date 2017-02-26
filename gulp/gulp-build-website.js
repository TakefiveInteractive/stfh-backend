'use strict'

const gulp = require('gulp'),
ts = require('gulp-typescript'),
merge = require('merge2'),
newer = require('gulp-newer'),
exec = require('child_process').exec;

const sourcePath = ['stfh-frontend/dist/**/*'];
const sourceDest = 'public';

gulp.task('build-website-exec', [], function(cb) {
  exec('cd stfh-frontend && npm i && npm run build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build-website', ['build-website-exec'], function() {
  return gulp.src(sourcePath).pipe(gulp.dest(sourceDest));
});

