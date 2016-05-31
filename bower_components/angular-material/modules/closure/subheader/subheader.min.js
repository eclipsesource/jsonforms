/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
function MdSubheaderDirective(e,a,r,n){return{restrict:"E",replace:!0,transclude:!0,template:'<div class="md-subheader _md">  <div class="_md-subheader-inner">    <div class="_md-subheader-content"></div>  </div></div>',link:function(d,i,t,c,o){function s(e){return angular.element(e[0].querySelector("._md-subheader-content"))}r(i),i.addClass("_md");var m=i[0].outerHTML;o(d,function(e){s(i).append(e)}),i.hasClass("md-no-sticky")||o(d,function(r){var t='<div class="_md-subheader-wrapper">'+m+"</div>",c=a(t)(d);e(d,i,c),n.nextTick(function(){s(c).append(r)})})}}}goog.provide("ng.material.components.subheader"),goog.require("ng.material.components.sticky"),goog.require("ng.material.core"),angular.module("material.components.subheader",["material.core","material.components.sticky"]).directive("mdSubheader",MdSubheaderDirective),MdSubheaderDirective.$inject=["$mdSticky","$compile","$mdTheming","$mdUtil"],ng.material.components.subheader=angular.module("material.components.subheader");