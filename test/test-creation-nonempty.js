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
      'test-project/README.md',
      'test-project/package.json',
      'test-project/bower.json',
      'test-project/grunt/aliases.js',
      'test-project/grunt/eslint.js',
      'test-project/grunt/jscs.js',
      'test-project/grunt/watch.js',
      'test-project/grunt/connect.js',
      'test-project/grunt/clean.js',
      'test-project/grunt/bower.js',
      'test-project/grunt/rev.js',
      'test-project/grunt/processhtml.js',
      'test-project/grunt/useminPrepare.js',
      'test-project/grunt/usemin.js',
      'test-project/grunt/htmlmin.js',
      'test-project/grunt/copy.js',
      'test-project/grunt/requirejs.js',
      'test-project/Gruntfile.js',
      'test-project/app/index.html',
      'test-project/app/content/images/famous_logo.png',
      'test-project/app/styles/app.css',
      'test-project/app/src/requireConfig.js',
      'test-project/app/src/main.js',
      'test-project/.editorconfig',
      'test-project/.bowerrc',
      'test-project/.eslintrc',
      'test-project/.jscsrc',
      'test-project/.gitignore',
      'test-project/.travis.yml'
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
