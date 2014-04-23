/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Famous generator tutorial mechanism', function () {
  beforeEach(function (done) {
    var tutorialName = 'timbre-menu';
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
      'app/styles/app.css',
      'app/content/images/band.png',
      'app/content/images/body.png',
      'app/content/images/favicon.ico',
      'app/content/images/hamburger.png',
      'app/content/images/icon.png',
      'app/content/images/search.png',
      'app/content/images/strip-icons/friends.png',
      'app/content/images/strip-icons/search.png',
      'app/content/images/strip-icons/settings.png',
      'app/content/images/strip-icons/starred.png'
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
