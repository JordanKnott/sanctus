var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  requireDir = require('require-dir'),
  bs = require('browser-sync'),
  rsync = require("gulp-rsync"),
  htmlmin = require('gulp-htmlmin'),
  run = require('gulp-run'),
  concat = require('gulp-concat'),
del = require('del'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  cleancss = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  del = require('del'),
  rename = require('gulp-rename'),
  run = require('gulp-run'),
  sass = require('gulp-ruby-sass'),
  htmlmin = require('gulp-htmlmin'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('autoprefixer'),
  postcss = require('gulp-postcss'),
  bs = require('browser-sync');



var paths = {};

// Directory locations.
paths.staticDir = 'static/';
paths.assetsDir = 'assets/';
paths.siteDir = 'public/';
paths.siteAssetsDir = 'public/assets/';
paths.criticalDir = 'assets/critical';

paths.fontFolderName = 'font';
paths.imageFolderName = 'img';
paths.scriptFolderName = 'js';
paths.stylesFolderName = 'sass';
paths.siteStylesFolderName = 'css';

// Asset files locations.
paths.sassFiles = paths.assetsDir + paths.stylesFolderName;
paths.jsFiles = paths.assetsDir + paths.scriptFolderName;
paths.imageFiles = paths.assetsDir + paths.imageFolderName;
paths.fontFiles = paths.assetsDir + paths.fontFolderName;

// Site files locations.
paths.siteCssFiles = paths.siteAssetsDir + paths.siteStylesFolderName;
paths.siteJsFiles = paths.siteAssetsDir + paths.scriptFolderName;
paths.siteImageFiles = paths.siteAssetsDir + paths.imageFolderName;
paths.siteFontFiles = paths.siteAssetsDir + paths.fontFolderName;

// Glob patterns by file type.
paths.sassPattern = '/**/*.scss';
paths.jsPattern = '/**/*.js';
paths.imagePattern = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
paths.markdownPattern = '/**/*.+(md|MD|markdown|MARKDOWN)';
paths.htmlPattern = '/**/*.html';
paths.xmlPattern = '/**/*.xml';

// Asset files globs
paths.sassFilesGlob = paths.sassFiles + paths.sassPattern;
paths.jsFilesGlob = paths.jsFiles + paths.jsPattern;
paths.imageFilesGlob = paths.imageFiles + paths.imagePattern;

// Site files globs
paths.siteHtmlFilesGlob = paths.siteDir + paths.htmlPattern;

// ==========[ Main Tasks ]============


gulp.task('build:hugo:watch', ['build:hugo'], function(callback) {
  bs.reload();
  callback();
});

gulp.task('build:scripts:watch', ['build:scripts'], function(callback) {
  bs.reload();
  callback();
});


// Build the site
gulp.task('build', function (callback) {
  runSequence(['build:styles:critical', 'build:scripts:critical'],
    ['build:styles:main', 'build:fonts', 'build:scripts', 'build:html', 'build:images'],
    callback);
});

gulp.task('serve', ['build'], function() {
  bs.init({
    server: '_site',
    ghostMode: false,
    logFileChanges: true,
    logLevel: 'debug',
    open: true
  });

  gulp.watch(['_config.yml'], ['build:hugo:watch']);

  gulp.watch('assets/sass/**/*.scss', ['build:styles:main', 'build:styles:critical']);

  gulp.watch('assets/js/**/*.js', ['build:scripts:watch']);

  gulp.watch(['**/*.+(html|md|markdown|MD)', '!_site/**/*.*'], ['build']);

});

// Set default task to build
gulp.task('default', ['build']);


// ==========[ Fonts ]============

// Copies fonts from assets to to site assets folder
gulp.task('build:fonts', function () {
  return gulp.src([paths.fontFiles + '**/*'])
    .pipe(gulp.dest(paths.siteAssetsDir));
});

// ==========[ Images ]============

// Optimizes and copies images
gulp.task('build:images', function () {
  return gulp.src(paths.imageFilesGlob)
    .pipe(gulp.dest(paths.siteImageFiles));
});

gulp.task("deploy", ['build'], function() {
    rsyncPaths = "_site/**/*";
    rsyncConf = {
        root: "_site/",
        progress: true,
        incremental: true,
        relative: true,
        emptyDirectories: true,
        recursive: true,
        clean: true,
        hostname: "jordanthedev.com",
        username: "root",
        destination: "/var/www/html/"
    };
    return gulp.src(rsyncPaths)
        .pipe(rsync(rsyncConf));
});


// ==========[ HTML ]============


gulp.task('build:html', function () {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('_site'));
});


// ==========[ Hugo ]============

// Runs the jekyll build command
gulp.task('build:hugo', function () {
  var shellCommand = 'hugo';
  return gulp.src('')
    .pipe(run(shellCommand));
});

// ==========[ Scripts ]============

// Minifies and concatenates vendor files. Should be loaded before custom styles
gulp.task('build:scripts:vendor', function () {
  return gulp.src([paths.jsFiles + '/vendor/**/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.siteJsFiles))
});

// Minifies and concatenates custom files. Should be loaded after vendor styles
gulp.task('build:scripts:main', function () {
  return gulp.src([paths.jsFiles + '/main/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.siteJsFiles))
});

// Minifies and concats critical JS code. Loaded in header.
gulp.task('build:scripts:critical', function () {
  return gulp.src([paths.jsFiles + '/critical/**/*.js'])
    .pipe(concat('critical.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.criticalDir))
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
    .pipe(gulp.dest(paths.siteCssFiles))
    .pipe(bs.stream());
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
    .pipe(gulp.dest(paths.criticalDir));
});
