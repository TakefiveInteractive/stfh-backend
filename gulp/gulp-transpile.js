'use strict'

const gulp = require('gulp'),
ts = require('gulp-typescript'),
merge = require('merge2'),
newer = require('gulp-newer');

const sourcePath = ['src/**/*.ts'];
const sourceDest = 'dist';

gulp.task('default', ['build-website'], function() {

  const tsProject = ts.createProject({
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    moduleResolution: "node",
    module: "commonjs",
    target: "ES6",
    noResolve: false
  });

  // transpile typescript
  return merge(
      gulp.src(sourcePath)
      .pipe(newer({
        dest: sourceDest,
        map: x => x.substring(0, x.length - 2) + 'js'   // 'ts' => 'js'
      })),
      gulp.src(['typings/main.d.ts'])
    )
    .pipe(tsProject())
    .pipe(gulp.dest(sourceDest));
});

gulp.task('build', ['clean', 'default']);
