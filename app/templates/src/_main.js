/*globals define*/
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var logo = new Surface({
        size: [200, 200],
        content: '<img width="200" src="content/images/famous_symbol_transparent.png"/>',
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });

    var logoModifier = new StateModifier({
        origin: [0.5, 0.5]
    });

    mainContext.add(logoModifier).add(logo);

});
