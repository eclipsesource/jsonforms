/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
goog.provide("ng.material.components.fabActions"),goog.require("ng.material.core"),function(){"use strict";function a(){return{restrict:"E",require:["^?mdFabSpeedDial","^?mdFabToolbar"],compile:function(a,t){var e=a.children(),n=!1;angular.forEach(["","data-","x-"],function(a){n=n||!!e.attr(a+"ng-repeat")}),n?e.addClass("md-fab-action-item"):e.wrap('<div class="md-fab-action-item">')}}}angular.module("material.components.fabActions",["material.core"]).directive("mdFabActions",a)}(),ng.material.components.fabActions=angular.module("material.components.fabActions");