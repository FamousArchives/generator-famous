/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Famous generator view mechanism', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp-view'), function (err) {
      if (err) {
        return done(err);
      }
      done();
    }.bind(this));
  });

  it('a new view is created', function (done) {
    var viewName = 'NewView';
    var expected = [
      'app/src/views/NewView.js'
    ];
    
    this.view = helpers.createGenerator('famous:view', [
      '../../view'
    ], [viewName]);

    this.view.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
  
  it('if given a path, that path should be created', function (done) {
    var viewName = 'Some/Path/NewView';
    var expected = [
      'app/src/views/Some/Path/NewView.js'
    ];
    
    this.view = helpers.createGenerator('famous:view', [
      '../../view'
    ], [viewName]);

    this.view.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
