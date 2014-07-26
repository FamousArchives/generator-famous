/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var spawn = require('child_process').spawn;

describe('famous generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp-end2end'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('famous:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('works END TO END', function (done) {
    helpers.mockPrompt(this.app, {
      'someOption': true
    });
    this.app.run({}, function () {
      var gruntSpawn = spawn('grunt', []);
      gruntSpawn.on('clone', done);
    });
  });
});
