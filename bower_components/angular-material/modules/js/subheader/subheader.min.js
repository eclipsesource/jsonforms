/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(e,n,d){"use strict";function t(e,d,t,i){return{restrict:"E",replace:!0,transclude:!0,template:'<div class="md-subheader _md">  <div class="_md-subheader-inner">    <div class="_md-subheader-content"></div>  </div></div>',link:function(a,r,c,s,m){function u(e){return n.element(e[0].querySelector("._md-subheader-content"))}t(r),r.addClass("_md");var o=r[0].outerHTML;m(a,function(e){u(r).append(e)}),r.hasClass("md-no-sticky")||m(a,function(n){var t='<div class="_md-subheader-wrapper">'+o+"</div>",c=d(t)(a);e(a,r,c),i.nextTick(function(){u(c).append(n)})})}}}n.module("material.components.subheader",["material.core","material.components.sticky"]).directive("mdSubheader",t),t.$inject=["$mdSticky","$compile","$mdTheming","$mdUtil"]}(window,window.angular);