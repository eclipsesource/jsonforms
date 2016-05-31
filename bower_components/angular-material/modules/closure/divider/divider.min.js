/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
function MdDividerDirective(e){return{restrict:"E",link:e}}goog.provide("ng.material.components.divider"),goog.require("ng.material.core"),angular.module("material.components.divider",["material.core"]).directive("mdDivider",MdDividerDirective),MdDividerDirective.$inject=["$mdTheming"],ng.material.components.divider=angular.module("material.components.divider");