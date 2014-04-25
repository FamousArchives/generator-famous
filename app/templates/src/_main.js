/*globals define*/
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var StateModifier = require('famous/modifiers/StateModifier');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var logo = new ImageSurface({
        size: [200, 200],
        content: '/content/images/famous_logo.png'
    });

    var logoModifier = new StateModifier({
        origin: [0.5, 0.5]
    });

    mainContext.add(logoModifier).add(logo);
});
