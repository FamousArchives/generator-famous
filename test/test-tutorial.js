/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Famous generator tutorial mechanism', function () {
  beforeEach(function (done) {
    var tutorialName = 'test';
    helpers.testDirectory(path.join(__dirname, 'temp-tutorial'), function (err) {
      if (err) {
        return done(err);
      }

      this.tutorial = helpers.createGenerator('famous:tutorial', [
        '../../tutorial'
      ], [tutorialName]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    this.timeout(0);
    var expected = [
      'app/test'
    ];

    helpers.mockPrompt(this.app, {
      'someOption': true
    });
    this.tutorial.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
