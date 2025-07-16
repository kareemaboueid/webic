"use strict";

/// ******************************************
/// Copyright (c) 2022-present, Webic, @kareemaboueid
/// ******************************************
///
/// This source code is licensed under the MIT license found in the
/// LICENSE file in the root directory.
/// ******************************************
///
/// webic
/// Automating web apps workflow with Gulp.js
/// @Author: Kareem Aboueid
/// ******************************************
///
/// This file is complately configurable, feel free to edit it to your needs.
/// ******************************************

// INITIALIZE MODULES:
const { src, dest, watch, series, task } = require("gulp");
const fs = require("fs");
const chalk = require("chalk");
const del = require("del");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserify = require("gulp-browserify");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const changed = require("gulp-changed").default;
const imagemin = require("gulp-imagemin");
const pachageJson = require("./package.json");
const browserSync = require("browser-sync");
const server = browserSync.create();

// SETUP APP PATHS, HELPER FUNCTIONS AND ENVIRONMENT VARIABLE:
const App = {
    name: "",
    version: "",
    env: "",
    port: "",
    src: {
        root: `app`,
        html: `app/*.html`,
        scss: `app/scss/index.scss`,
        js: `app/js/index.js`,
        media: `app/media/**/*`,
        misc: `app/*.{xml,txt,json}`,
    },
    dev: {
        root: `.dev`,
        css: `.dev/css`,
        js: `.dev/js`,
        media: `.dev/media`,
    },
    dest: {
        root: `build`,
        css: `build/css`,
        js: `build/js`,
        media: `build/media`,
    },
    // setters
    setName(name) {
        return (this.name = name);
    },
    setVersion(version) {
        return (this.version = version);
    },
    setEnv(env) {
        return (this.env = env);
    },
    setPort(port) {
        return (this.port = port);
    },
    // getters
    getName() {
        return this.name;
    },
    getVersion() {
        return this.version;
    },
    getEnv() {
        return this.env;
    },
    getPort() {
        return this.port;
    },
    // checkers
    isEnv(env) {
        return this.env === env;
    },
};

// SET APP CONFIGURATION:
App.setName(pachageJson.name);
App.setVersion(pachageJson.version);
App.setEnv("development");
App.setPort(8888);

// FUNCTION: RENAME FILES, CLEAR LOG:
const renameFile = (file, ext) => rename({ basename: file, extname: ext });

// FUNCTION: ERROR HANDLER:
const errorHandler = error => {
    console.error("hello Error" + error);
    this.emit("end");
};

// FUNCTION: CHECK IF `dev` FOLDER EXISTS:
if (fs.existsSync(App.dev.root)) {
    fs.rmSync(App.dev.root, { recursive: true });
}

// ALL TASKS:
const compileHTML = () => {
    return App.isEnv("development")
        ? // development:
          src(App.src.html)
              .pipe(htmlmin({ collapseWhitespace: false }))
              .pipe(dest(App.dev.root))
        : // production:
          src(App.src.html)
              .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
              .pipe(dest(App.dest.root));
};

const compileSCSS = () => {
    return App.isEnv("development")
        ? // development:
          src(App.src.scss, { sourcemaps: true })
              .pipe(sass({ outputStyle: "expanded" }))
              .pipe(renameFile("main.bundled", ".css"))
              .on("error", errorHandler)
              .pipe(dest(App.dev.css, { sourcemaps: "." }))
        : // production:
          src(App.src.scss)
              .pipe(sass({ outputStyle: "compressed" }))
              .pipe(
                  postcss([
                      autoprefixer({
                          overrideBrowserslist: [
                              "> 1%",
                              "last 2 versions",
                              "ie >= 11",
                          ],
                      }),
                      cssnano(),
                  ])
              )
              .pipe(renameFile("main.bundled", ".css"))
              .pipe(dest(App.dest.css));
};

const compileJS = () => {
    return App.isEnv("development")
        ? // development:
          src(App.src.js)
              .pipe(browserify({ debug: false }))
              .pipe(renameFile("main.bundled", ".js"))
              .on("error", errorHandler)
              .pipe(dest(App.dev.js))
        : // production:
          src(App.src.js)
              .pipe(browserify())
              .pipe(babel({ presets: ["@babel/preset-env"] }))
              .pipe(terser())
              .pipe(renameFile("main.bundled", ".js"))
              .pipe(dest(App.dest.js));
};

const compileMedia = () => {
    return App.isEnv("development")
        ? // development:
          src(App.src.media)
              .pipe(changed(App.dev.media))
              .on("error", errorHandler)
              .pipe(dest(App.dev.media))
        : // production:
          src(App.src.media)
              .pipe(changed(App.dest.media))
              .pipe(imagemin())
              .pipe(dest(App.dest.media));
};

const compileMisc = () => {
    return App.isEnv("development")
        ? // development:
          src(App.src.misc).on("error", errorHandler).pipe(dest(App.dev.root))
        : // production:
          src(App.src.misc).pipe(dest(App.dest.root));
};

const clean = () => {
    return App.isEnv("development")
        ? del([App.dev.root])
        : del([App.dest.root]);
};

// ACTION: OPEN SERVER:
const open_server = done => {
    server.init({
        server: { baseDir: App.dev.root },
        port: App.getPort(),
        open: true,
        notify: false,
    });
    done();
};

// ACTION: RELOAD SERVER:
const reload_server = done => {
    server.reload();
    done();
};

// ACTION: WATCH FILES:
const watch_server = done => {
    watch(
        `${App.src.root}/**/*`,
        series(
            function compiling(cb) {
                process.stdout.write("\x1Bc");
                console.log(chalk.blue(`\nCompiling your app...\n`));
                cb();
            },
            compileHTML,
            compileSCSS,
            compileJS,
            compileMedia,
            compileMisc,
            reload_server,
            function done(cb) {
                cb();
                console.log(chalk.blue(`\nSuccessfully compiled.\n`));
            }
        )
    );
    done();
};

// RUN: npm start:
process.stdout.write("\x1Bc");
console.log("Starting " + chalk.yellow(App.getName()));
console.log(`Version: ${App.getVersion()}`);
console.log(`Mode: ${App.getEnv()}`);
console.log();
task(
    "dev",
    series(
        compileHTML,
        compileSCSS,
        compileJS,
        compileMedia,
        compileMisc,
        open_server,
        watch_server,
        function done(cb) {
            cb();
            console.log();
            console.log(
                chalk.green("Success!") + " Your code Successfully compiled."
            );
            console.log();
            console.log(
                "You can view " +
                    chalk.yellow(App.getName()) +
                    " in your browser: " +
                    chalk.yellow(`http://localhost:${App.getPort()}`)
            );
            console.log();
            console.log(
                "Get started in " + chalk.yellow(App.src.root) + " directory."
            );
            console.log();
            console.log(
                `Note that you're in development mode, your app is not optimized.`
            );
            console.log(
                "To create a production build, use: " +
                    chalk.cyan("npm run build")
            );
            console.log();
        }
    )
);

// 2. RUN: npm run build:
task(
    "build",
    series(
        function compiling(cb) {
            App.setEnv("production");
            console.log();
            console.log("Optimizing your app " + chalk.yellow(App.getName()));
            console.log(`Version: ${App.getVersion()}`);
            console.log(`Mode: ${App.getEnv()}`);
            console.log();
            cb();
        },
        compileHTML,
        compileSCSS,
        compileJS,
        compileMedia,
        compileMisc,
        function done(cb) {
            cb();
            process.stdout.write("\x1Bc");
            console.log(
                chalk.blue(`\nAll done!`) +
                    " your app " +
                    chalk.yellow(App.getName() + "/") +
                    " Successfully optimized.\n\nYour build folder is ready to be deployed."
            );
            process.exit();
        }
    )
);

// 3. RUN: npm run clean:dev:
task(
    "clean-dev",
    series(
        function start(cb) {
            console.log(chalk.blue(`\nCleaning your development...\n`));
            cb();
        },
        clean,
        function finished(cb) {
            cb();
            console.log(chalk.blue(`\nDone.\n`));
        }
    )
);

// 4. RUN: npm run clean:build:
task(
    "clean-build",
    series(
        function start(cb) {
            App.setEnv("production");
            console.log(chalk.blue(`\nCleaning your production...\n`));
            cb();
        },
        clean,
        function finished(cb) {
            cb();
            console.log(chalk.blue(`\nDone.\n`));
        }
    )
);
