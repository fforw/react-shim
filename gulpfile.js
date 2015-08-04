"use strict";

var path = require("path");

var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var chalk = require("chalk");
var extend = require("extend");
var gulpIf = require("gulp-if");
var gulp = require("gulp");
var gutil = require("gulp-util");
var notifier = require("node-notifier");
var streamify = require("gulp-streamify");
var uglify = require("gulp-uglify");
var watchify = require("watchify");

var MAIN_FILE = "./src/main.js";

// Basic usage
function handleCompileError(err)
{
    gutil.log(chalk.red("\nError in browserify build:\n") + err.stack);
    notifier.notify({
        title: "Error",
        message: err.message.substring(0,100)
    });
}

var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var babelify = require("babelify");

gulp.task("build", function(cb) {
    bundle(false, cb);
});

gulp.task("watch", function(cb) {
    bundle(true, cb);
});

function bundle(watch, cb) {
    var bro;

    var compress = !process.env.NO_UGLIFY;

    if (watch) {
        bro = watchify(browserify(MAIN_FILE,
            // Assigning debug to have sourcemaps
            extend(watchify.args, {
                debug: true
            })));
        bro.on("update", function() {
            rebundle(bro);
        });
        bro.on("log", function() {
            gutil.log.apply(gutil, arguments);
        });
    } else {
        bro = browserify(MAIN_FILE, {
            debug: true,
            fullPaths: true
        });
    }

    bro.transform(
        // Babel js transpiler
        babelify.configure({
            sourceRoot: path.resolve("./src"),

            whitelist: [

                // SUPPORTED TRANSFORMS / JS EXTENSIONS:

                // JSX support
                "react", "react.displayName",

                // var obj = { [computed] : true }
                "es6.properties.computed",

                // const MY_CONSTANT = 1 ( const -> let -> var )
                "es6.constants", "es6.blockScoping",

                // if (process.env.NODE_ENV !== "production")
                "utility.inlineEnvironmentVariables"]
        }))
        .transform("browserify-shim");

    function rebundle(bundler) {
        return bundler.bundle()
            .on("error", handleCompileError)
            .pipe(source("main.js"))
            .pipe(buffer())
            // loads map from browserify file
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(gulpIf(compress, streamify(uglify())))
            .pipe(sourcemaps.write(".")) // writes .map file
            .pipe(gulp.dest("./web/js"))
    }

    return rebundle(bro);
}

gulp.task("default", ["build"]);
