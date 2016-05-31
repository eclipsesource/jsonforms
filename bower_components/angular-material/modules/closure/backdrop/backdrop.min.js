/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
goog.provide("ng.material.components.backdrop"),goog.require("ng.material.core"),angular.module("material.components.backdrop",["material.core"]).directive("mdBackdrop",["$mdTheming","$mdUtil","$animate","$rootElement","$window","$log","$$rAF","$document",function(e,t,o,n,a,r,i,p){function c(t,c,m){o.pin&&o.pin(c,n),i(function(){var t=a.getComputedStyle(p[0].body);if("fixed"==t.position){var o=parseInt(t.height,10)+Math.abs(parseInt(t.top,10));c.css({height:o+"px"})}var n=c.parent()[0];if(n){"BODY"==n.nodeName&&c.css({position:"fixed"});var i=a.getComputedStyle(n);"static"==i.position&&r.warn(d)}c.parent().length&&e.inherit(c,c.parent())})}var d="<md-backdrop> may not work properly in a scrolled, static-positioned parent container.";return{restrict:"E",link:c}}]),ng.material.components.backdrop=angular.module("material.components.backdrop");