/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
function MdWhiteframeDirective(e){function a(a,m,n){var o=parseInt(n.mdWhiteframe,10)||i;(o>t||r>o)&&(e.warn("md-whiteframe attribute value is invalid. It should be a number between "+r+" and "+t,m[0]),o=i),m.addClass("md-whiteframe-"+o+"dp")}var r=1,t=24,i=4;return{restrict:"A",link:a}}goog.provide("ng.material.components.whiteframe"),goog.require("ng.material.core"),angular.module("material.components.whiteframe",["material.core"]).directive("mdWhiteframe",MdWhiteframeDirective),MdWhiteframeDirective.$inject=["$log"],ng.material.components.whiteframe=angular.module("material.components.whiteframe");