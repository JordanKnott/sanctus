# Sanctus #

> A modern theme for Hugo built with speed in mind

Sanctus is a theme that I created for my [personal site](https://jordanthedev.com). As such, it is built based on my needs but I have tried to make
sure that it is easily customizable.

## Installation and Setup ##

TODO


## Directory Structure ##

### `assets` ###

Contains all files that need to be preproccessed by Gulp, namely JavaScript and SASS.

### `assets/js` ###

Contains all JavaScript files.

Any JavaScript found in the `vendor` directory will be loaded before any JavaScript found in the `main` directory.

Any JavaScript fiund in the `critical` directory will be injected directly into the head of every page. This is the only folder that is currently in use at
the moment. It is used for the loadCSS and Prism library.

### `assets/sass` ###

Contains all SASS files.

The `main.sass` file is generated to __static/gen/css/main.css__ and is loaded using the `loadCSS` library.

`critical.sass` is generated to __static/gen/css/critical.css__ and is directly injected into the head of every page. Should just contain styles needed for the stucture of the page.

### `static` ###

Contains all static files (e.g files that don't need any processing).

Images are stored in __static/images__ and fonts are stored in __static/fonts__. Generated JavaScript and CSS files are found in __static/gen__ (this folder is kept out of version control).


## Configuration ##

## Shortcodes ##
