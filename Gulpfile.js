var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  requireDir = require('require-dir'),
  rsync = require("gulp-rsync"),
  uglify = require('gulp-uglify'),
  cleancss = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  del = require('del'),
  rename = require('gulp-rename'),
  run = require('gulp-run'),
  sass = require('gulp-ruby-sass'),
  htmlmin = require('gulp-htmlmin'),
  autoprefixer = require('autoprefixer'),
  postcss = require('gulp-postcss');

var paths = {};

// Directory locations.
paths.staticDir = 'static/';
paths.assetsDir = 'assets/';
paths.genAssetsDir = 'static/gen/';
paths.criticalJsDir = 'static/gen/js/';
paths.criticalCssDir = 'static/gen/css/';

paths.scriptFolderName = 'js';
paths.stylesFolderName = 'sass';
paths.siteStylesFolderName = 'css';

// Asset files locations.
paths.sassFiles = paths.assetsDir + paths.stylesFolderName;
paths.jsFiles = paths.assetsDir + paths.scriptFolderName;
paths.imageFiles = paths.assetsDir + paths.imageFolderName;
paths.fontFiles = paths.assetsDir + paths.fontFolderName;

// Site files locations.
paths.genCssFiles = paths.genAssetsDir + paths.siteStylesFolderName;
paths.genJsFiles = paths.genAssetsDir + paths.scriptFolderName;


// ==========[ Main Tasks ]============

// Build the site
gulp.task('build', function (callback) {
  runSequence(['build:styles:critical', 'build:scripts:critical'],
    ['build:styles:main', 'build:scripts'],
    callback);
});

// Set default task to build
gulp.task('default', ['build']);

// ==========[ Scripts ]============

// Minifies and concatenates vendor files. Should be loaded before custom styles
gulp.task('build:scripts:vendor', function () {
  return gulp.src([paths.jsFiles + '/vendor/**/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.genJsFiles))
});

// Minifies and concatenates custom files. Should be loaded after vendor styles
gulp.task('build:scripts:main', function () {
  return gulp.src([paths.jsFiles + '/main/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.genJsFiles))
});

// Minifies and concats critical JS code. Loaded in header.
gulp.task('build:scripts:critical', function () {
  return gulp.src([paths.jsFiles + '/critical/**/*.js'])
    .pipe(concat('critical.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.criticalJsDir))
});

gulp.task('build:scripts', ['build:scripts:vendor', 'build:scripts:main']);

// ==========[ Styles ]============

// Compiles main sass file, adds vendor prefixes, minifies, then outputs to _site folder
gulp.task('build:styles:main', function () {
  return sass(paths.sassFiles + '/main.scss', {
    style: 'compressed',
    trace: true,
    loadPath: [paths.sassFiles]
  }).pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.genCssFiles));
});

// Compiles critical sass file, adds vendor prefixes, minifies, then outputs to include folder.
// Must be run before jekyll builds
gulp.task('build:styles:critical', function () {
  return sass(paths.sassFiles + '/critical.scss', {
    style: 'compressed',
    trace: true,
    loadPath: [paths.sassFiles]
  }).pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.criticalCssDir));
});
