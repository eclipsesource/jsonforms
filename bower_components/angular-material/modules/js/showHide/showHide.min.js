/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(n,i,t){"use strict";function e(n,i){return["$mdUtil",function(t){return{restrict:"A",multiElement:!0,link:function(e,o,r){var c=e.$on("$md-resize-enable",function(){c(),e.$watch(r[n],function(n){!!n===i&&(t.nextTick(function(){e.$broadcast("$md-resize")}),t.dom.animator.waitTransitionEnd(o).then(function(){e.$broadcast("$md-resize")}))})})}}}]}i.module("material.components.showHide",["material.core"]).directive("ngShow",e("ngShow",!0)).directive("ngHide",e("ngHide",!1))}(window,window.angular);