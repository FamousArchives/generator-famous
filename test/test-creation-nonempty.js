/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('famous generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp-not-empty'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('famous:app', [
        '../../app'
      ]);
      
      helpers.gruntfile({}, done);
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'README.md',
      'package.json',
      'bower.json',
      'grunt/aliases.js',
      'grunt/eslint.js',
      'grunt/jscs.js',
      'grunt/watch.js',
      'grunt/connect.js',
      'grunt/clean.js',
      'grunt/bower.js',
      'grunt/rev.js',
      'grunt/processhtml.js',
      'grunt/useminPrepare.js',
      'grunt/usemin.js',
      'grunt/htmlmin.js',
      'grunt/copy.js',
      'grunt/requirejs.js',
      'Gruntfile.js',
      'app/index.html',
      'app/content/images/famous_logo.png',
      'app/styles/app.css',
      'app/src/requireConfig.js',
      'app/src/main.js',
      '.editorconfig',
      '.bowerrc',
      '.eslintrc',
      '.jscsrc',
      '.gitignore',
      '.travis.yml'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'Test Project'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
