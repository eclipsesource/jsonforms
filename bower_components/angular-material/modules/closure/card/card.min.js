/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
function mdCardDirective(e){return{restrict:"E",link:function(r,a,i){a.addClass("_md"),e(a)}}}goog.provide("ng.material.components.card"),goog.require("ng.material.core"),angular.module("material.components.card",["material.core"]).directive("mdCard",mdCardDirective),mdCardDirective.$inject=["$mdTheming"],ng.material.components.card=angular.module("material.components.card");