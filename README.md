# Webic

<p>
Create your app <strong>blazingly fast</strong> with most lightweight, and configurable boilerplate template.
</p>

## Quick start

**Note:**
Be sure to have [Node.js](https://nodejs.org/) installed before proceeding.

Use the create-webic-app script, instantly fetch the latest npm published package:

```shell
npx create-webic-app
```

Then, answer the questions:

```shell
? App name: # foo-app
? App description: # awesome description
```

that's it! Webic will set it up for you, and you're done.

## Features

- ### Robust base
Built on top of most crucially organized SASS partials, to ensure all basic styles are set, clean, scalable and easily maintainable.


- ### Modules based
Require any module you want, the `index.js` file will be bundling up and works in the browser perfectly.

- ### Automated Workflow
Includes `gulpfile` configurations to initialize a development environment that automates your workflow, debugging, starting a local server.

- ### Environment scripts
Start your app right away, with series of npm scripts that can perform all tasks in a single action, easily and quickly.

## Scripts

Inside the newly created app, you can run the following built-in commands:

### ` npm start `
Starts the development server.

### ` npm run build `
Optmizes and bundles the app for production.

### ` npm run clean:dev `
Removes the development environment.

### ` npm run clean:build `
Removes the production build.


## What's included

### Basic structure
A basic webic initial starter structure looks like this:

```
├── app/
│   ├── js/
│   ├── media/
│   ├── scss/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── gulpfile.babel.js
├── package.json
├── README.md
```
### Files

- `app/index.html`: The main HTML file of your app.

- `app/manifest.json` file, contains startup parameters and app defaults. [more](https://developer.mozilla.org/en-US/docs/Web/Manifest)

- `app/robots.txt` file, for indexing your app content by search engines. [more](https://developer.mozilla.org/en-US/docs/Glossary/Robots.txt)

- `media/` includes all app assets, icons, images, etc.

- `scss/` contains SCSS base styles and all functions and mixins.

-  `js/` contains all app scripts, with cabablity to use `require()`.

## SCSS

Webic uses [Dart Sass](https://sass-lang.com/dart-sass) new modules rules: `@use` and `@forward` to import partials. (more like `import` and `export` in JavaScript)

- The `@use` rule (which represents import) loads mixins, functions, and variables from other Sass stylesheets. [more](https://sass-lang.com/documentation/at-rules/use)

- The `@forward` loads a Sass stylesheet and makes its mixins, functions, and variables available when your stylesheet is loaded in other Sass stylesheets. [more](https://sass-lang.com/documentation/at-rules/forward)

More about [sass module system](https://css-tricks.com/introducing-sass-modules/)
### For reset style:
webic uses necolas's [Normalize.css](https://necolas.github.io/normalize.css/) in order to make browsers render all elements more consistently and in line with modern standards.

### Media queries:
webic uses Akram Khalid's sass-mediaqueries [SCSS breakpoints library](https://github.com/wrongakram/sass-mediaqueries/blob/master/src/breakpoints/breakpoints.scss).

example:

```scss
.foo {
 @include media(">phone", "<=tablet") {
   // your style here...
 }
}
```

## JavaScript

Webic uses [Babel](https://babeljs.io/) to transpile ES6 code to make it compatible with older browsers.

Webic uses [browserify]( https://browserify.org/) to bundle all scripts together, by using ` require()` to load dependencies in `index.js`, which the browser will execute.

## License

Webic is open source project. [licensed as MIT](https://github.com/KareemAbo3id/webic/blob/master/LICENSE).

## Credits
- Thanks to [Nicolas Gallagher](https://github.com/necolas/) for [Normalize.css](https://github.com/necolas/normalize.css).
- Thanks to [Akram Khalid](http://github.com/wrongakram) for [sass-mediaqueries](http://github.com/wrongakram/sass-mediaqueries/blob/master/src/breakpoints/breakpoints.scss).
- Thanks to [Kitty Giraudel](https://github.com/KittyGiraudel) for [Sass Guidelines](https://sass-guidelin.es/).

## Copyright
&copy; Built by [Kareem Aboueid](https://github.com/KareemAbo3id) - 2022.

