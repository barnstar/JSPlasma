const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
const del = require('del');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const streamify = require('gulp-streamify');

function clean(cb) {
    console.log("Cleaning");
    del(['app/dist/**/*','app/build/**/*']);
    cb();
};

function packagejs(cb) {
  console.log("Packaging JS");
  let bundle = browserify('src/js/main.js').bundle();

  return bundle.pipe(source('main.js'))
  //.pipe( streamify(terser({keep_fnames: true})) )
  .pipe(gulp.dest('./app/build/'));
};

function copycss(sb) {
    return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./app/build/'));
}

function copyhtml(sb) {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./app/build/'));
}



exports.build = gulp.series(clean, packagejs, copycss, copyhtml);
exports.clean = gulp.series(clean);
exports.default = exports.build;
