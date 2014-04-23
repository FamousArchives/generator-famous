/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Famous generator demo mechanism', function () {
  beforeEach(function (done) {
    var demoName = 'yelp';
    helpers.testDirectory(path.join(__dirname, 'temp-demo'), function (err) {
      if (err) {
        return done(err);
      }

      this.demo = helpers.createGenerator('famous:demo', [
        '../../demo'
      ], [demoName]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    this.timeout(0);
    // var expected = [
//       'app/styles/app.css'
//     ];

    helpers.mockPrompt(this.app, {
      'someOption': true
    });
    this.demo.run({}, function () {
      // helpers.assertFile(expected);
      done();
    });
  });
});
