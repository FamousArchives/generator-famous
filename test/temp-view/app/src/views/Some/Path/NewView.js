/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name NewView
     * @constructor
     * @description
     */

    function NewView() {
        View.apply(this, arguments);
    }

    NewView.prototype = Object.create(View.prototype);
    NewView.prototype.constructor = NewView;

    NewView.DEFAULT_OPTIONS = {
    };

    module.exports = NewView;
});
