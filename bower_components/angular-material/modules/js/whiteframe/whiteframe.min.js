/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(e,t,a){"use strict";function i(e){function t(t,n,d){var m=parseInt(d.mdWhiteframe,10)||r;(m>i||a>m)&&(e.warn("md-whiteframe attribute value is invalid. It should be a number between "+a+" and "+i,n[0]),m=r),n.addClass("md-whiteframe-"+m+"dp")}var a=1,i=24,r=4;return{restrict:"A",link:t}}t.module("material.components.whiteframe",["material.core"]).directive("mdWhiteframe",i),i.$inject=["$log"]}(window,window.angular);