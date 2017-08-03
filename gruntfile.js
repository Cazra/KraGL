'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Browserify + Babel transpiles ES6 modules down into ES5 and produces
    // a concatenated file for the KraGL library.
    browserify: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'temp/KraGL.browserify.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [['babelify', {'presets': ['es2015']}]]
        }
      }
    },
    concat: {
      dist: {
        files: {
          'bin/KraGL.cat.js': [
            'lib/*.js',
            'temp/KraGL.browserify.js'
          ]
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'doc'
      }
    },
    jshint: {
      options: {
        maxerr: 50,

        // Enforcing
        bitwise: false,
        camelcase: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: false,
        indent: 2,
        latedef: 'nofunc',
        maxcomplexity: 20,
        maxdepth: 5,
        maxlen: 80,
        newcap: true,
        noarg: true,
        noempty: true,
        nonbsp: true,
        nonew: false,
        notypeof: false,
        plusplus: false,
        quotmark: false,
        shadow: false,
        strict: 'global',
        undef: true,
        unused: true,
        varstmt: false,

        // Environments
        browser: true,
        mocha: true,
        node: false,

        // Relaxing
        asi: false,
        boss: false,
        debug: false,
        eqnull: false,
        esversion: 6,
        evil: false,
        expr: false,
        funcscope: false,
        iterator: false,
        lastsemic: false,
        laxbreak: false,
        laxcomma: false,
        loopfunc: false,
        moz: false,
        multistr: false,
        noyield: false,
        proto: false,
        scripturl: false,
        sub: false,
        supernew: false,
        validthis: false,

        globals: {
          _: false,
          glMatrix: false,
          KraGL: true,
          mat2: false,
          mat2d: false,
          mat3: false,
          mat4: false,
          quat: false,
          vec2: false,
          vec3: false,
          vec4: false
        }
      },
      files: {
        src: [ 'src/**/*.js' ]
      }
    },
    'string-replace': {
      dist: {
        files: {
          'bin/KraGL.cat.js': ['bin/KraGL.cat.js']
        }
      },
      options: {
        replacements: [
          {
            pattern: 'KRAGL_VERSION',
            replacement: '<%= pkg.version %>'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'bin/KraGL.min.js': ['bin/KraGL.cat.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-string-replace');

  // Grunt task(s).
  grunt.registerTask('default', ['jshint', 'browserify', 'concat', 'string-replace', 'jsdoc']);
};
