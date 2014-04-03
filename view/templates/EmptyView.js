/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var Engine = require('famous/core/Engine');

    /*
     * @name <%= name  %>
     * @constructor
     * @description
     */
    
    function <%= name  %>() {
        View.apply(this, arguments);
    }

    <%= name  %>.prototype = Object.create( View.prototype );
    <%= name  %>.prototype.constructor = <%= name  %>;

    <%= name  %>.DEFAULT_OPTIONS = {
    }

    module.exports = <%= name  %>;
})