/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name <%= filename  %>
     * @constructor
     * @description
     */

    function <%= filename  %>() {
        View.apply(this, arguments);
    }

    <%= filename  %>.prototype = Object.create(View.prototype);
    <%= filename  %>.prototype.constructor = <%= filename  %>;

    <%= filename  %>.DEFAULT_OPTIONS = {
    };

    module.exports = <%= filename  %>;
});
