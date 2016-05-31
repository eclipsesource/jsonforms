/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
function mdContentDirective(e){function o(e,o){this.$scope=e,this.$element=o}return{restrict:"E",controller:["$scope","$element",o],link:function(o,t){t.addClass("_md"),e(t),o.$broadcast("$mdContentLoaded",t),iosScrollFix(t[0])}}}function iosScrollFix(e){angular.element(e).on("$md.pressdown",function(o){"t"===o.pointer.type&&(o.$materialScrollFixed||(o.$materialScrollFixed=!0,0===e.scrollTop?e.scrollTop=1:e.scrollHeight===e.scrollTop+e.offsetHeight&&(e.scrollTop-=1)))})}goog.provide("ng.material.components.content"),goog.require("ng.material.core"),angular.module("material.components.content",["material.core"]).directive("mdContent",mdContentDirective),mdContentDirective.$inject=["$mdTheming"],ng.material.components.content=angular.module("material.components.content");