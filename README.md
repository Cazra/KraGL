# KraGL

An ECMAScript 6 WebGL game engine. This engine is the spiritual successor to
[TentaGL](https://github.com/Cazra/TentaGL)

The project is primarily tested in Windows with Chrome, but I will try to
support all browsers that implement ECMAScript 6 for their Javascript.

The mission of this engine is to make it easy to create browser-based 2D or 3D
games, take advantage of the resources provided in ECMAScript 6, and provide
superb documentation for its API.

## Dependencies

KraGL uses [Grunt](http://gruntjs.com/) and [NPM](https://www.npmjs.com/) to
automate the building process for generating the distributable, rendering
documentation pages, and running unit tests.

If you don't have Node JS and NPM installed,
[Go install it now](https://nodejs.org/en/).

Once NPM is installed, you can automatically install all the project's
dependencies by opening a terminal in the project's root folder and entering
the command

```
npm install
```

Grunt and all the other Node JS dependencies for this project will be installed!
Now you can run any of the project's Grunt tasks.

KraGL uses Mocha for its unit tests. All tests are located in the /tests
directory.

KragL uses JSDoc for to annotate the source code and generate documentation
web pages. The rendered documentation web pages are put in the docs/html
directory.

## building

To build the distributable for the KraGL game engine library, run

```
grunt
```

from the terminal at the project's root. As part of the process of building
the distributable, the project will be linted, unit tested, and minified.

## testing

To run the Mocha unit tests for the library, run

```
grunt test
```

from the terminal at the project's root. Mocha will show how many tests
passed, how many failed (any details about why the tests failed), and
any tests that are pending implementation.

All unit tests are located in the /test directory.

## Generating documentation

To generate the documentation HTML pages for the project, run

```
grunt docs
```

from the terminal at the project's root. The rendered web pages will be placed
in /docs/html.

## Viewing examples

The /examples directory contains web page examples of KraGL in action.
To allow cross-origin resource sharing to work to properly load the examples'
resources, run a simple http server in the project's directory. With the
simple HTTP server running, then just navigate to the examples in your
web browser.
