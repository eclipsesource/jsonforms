/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(e,t,o){"use strict";function n(e){function t(e,t){this.$scope=e,this.$element=t}return{restrict:"E",controller:["$scope","$element",t],link:function(t,o){o.addClass("_md"),e(o),t.$broadcast("$mdContentLoaded",o),l(o[0])}}}function l(e){t.element(e).on("$md.pressdown",function(t){"t"===t.pointer.type&&(t.$materialScrollFixed||(t.$materialScrollFixed=!0,0===e.scrollTop?e.scrollTop=1:e.scrollHeight===e.scrollTop+e.offsetHeight&&(e.scrollTop-=1)))})}t.module("material.components.content",["material.core"]).directive("mdContent",n),n.$inject=["$mdTheming"]}(window,window.angular);