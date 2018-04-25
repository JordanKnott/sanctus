// paths.js file

var paths = {};

// Directory locations.
paths.assetsDir = 'assets/';      // The files Gulp will handle.
paths.siteDir = 'public/';
paths.siteAssetsDir = 'public/assets/'; // The resulting static site's assets.

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
paths.siteCssFiles = paths.assetsDir + paths.siteStylesFolderName;
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

module.exports = paths;
