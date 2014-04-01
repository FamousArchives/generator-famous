/*globals define*/
'use strict';
define(function (require, exports, module) {
  // import dependencies
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  // create the main context
  var mainContext = Engine.createContext();
  
  
  // your app here
  var surface = new Surface({
    size: [200, 200],
    content: 'Welcome to Famo.us',
    classes: ['red-bg'],
    properties: {
      lineHeight: '200px',
      textAlign: 'center'
    }
  });

  var modifier = new Modifier({
    origin: [0.5, 0.5]
  });

  mainContext.add(modifier).add(surface);

});
