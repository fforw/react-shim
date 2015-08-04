# Shimed React Example #

React example project using gulp and browserify as build-system. The JSX transformations (and others) are done with
Babel.js / babelify.
 
This also shows how to use browserify-shim to replace all requires to react with the global "React" which is exported
by the react distribution bundles.

## Directories / Files ##

JS source code is in src/.

The web directory contains a very simple HTML scaffold that loads one of the react distribution bundles and the 
compiled source bundle.

## Usage ##

Use just "gulp" to build the web/js/main.js file and source map. 
  
Use "gulp watch" to enter a watchify based watch mode that will keep compiling the sources while you edit.

Load web/index.html in your browser.