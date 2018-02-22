# KraGL

KraGL is an ES-Next WebGL game engine library. It is designed to make implementing
2D and 3D browser-based games easy and fun, with a simple, well-documented interface
and lots of examples.

Currently, this project is still under development and is not yet ready to
be used in real applications.

This project is the spiritual successor to
[TentaGL](https://github.com/Cazra/TentaGL)

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

## Building KraGL

To build the distributable for the KraGL game engine library, run ```grunt```
from a terminal at the project's root. As part of the process of building
the distributable, the project will be linted, concatenated, and minified.

This process will create the concatenated KraGL library file ```bin/KraGL.cat.js```
and the minified library file ```bin/KraGL.min.js```. Additionally, documentation
for the library will be generated in ```doc/```.

## Unit Tests

The Mocha unit tests for this project are browser-based. To run the tests,
first build KraGL if you haven't already. Then run a simple http server at the
project's root directory, and navigate to ```localhost:{PORT}/tests/index.html```
in your browser.

The project is primarily tested in Windows with Chrome, but I will try to
support all ES-Next-compliant browsers.

## Example Applications

The /examples directory contains web page examples of KraGL in action.

Before viewing an example application, you must build it by running ```grunt``` in the
example's root directory.

To allow cross-origin resource sharing to work to properly load the examples'
resources, run a simple http server in the project's directory. With the
simple HTTP server running, then just navigate to the examples in your
web browser.
