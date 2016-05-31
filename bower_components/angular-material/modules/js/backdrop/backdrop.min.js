/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(t,n,e){"use strict";n.module("material.components.backdrop",["material.core"]).directive("mdBackdrop",["$mdTheming","$mdUtil","$animate","$rootElement","$window","$log","$$rAF","$document",function(t,n,e,i,o,r,a,p){function d(n,d,s){e.pin&&e.pin(d,i),a(function(){var n=o.getComputedStyle(p[0].body);if("fixed"==n.position){var e=parseInt(n.height,10)+Math.abs(parseInt(n.top,10));d.css({height:e+"px"})}var i=d.parent()[0];if(i){"BODY"==i.nodeName&&d.css({position:"fixed"});var a=o.getComputedStyle(i);"static"==a.position&&r.warn(c)}d.parent().length&&t.inherit(d,d.parent())})}var c="<md-backdrop> may not work properly in a scrolled, static-positioned parent container.";return{restrict:"E",link:d}}])}(window,window.angular);