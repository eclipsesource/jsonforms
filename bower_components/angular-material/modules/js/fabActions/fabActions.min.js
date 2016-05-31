/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(a,i,t){"use strict";!function(){function a(){return{restrict:"E",require:["^?mdFabSpeedDial","^?mdFabToolbar"],compile:function(a,t){var n=a.children(),e=!1;i.forEach(["","data-","x-"],function(a){e=e||!!n.attr(a+"ng-repeat")}),e?n.addClass("md-fab-action-item"):n.wrap('<div class="md-fab-action-item">')}}}i.module("material.components.fabActions",["material.core"]).directive("mdFabActions",a)}()}(window,window.angular);