/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0-rc4-master-c26842a
 */
!function(e,i,t){"use strict";function n(e){function i(e){function i(i,r,o){var w=e(o[t]);r.on(n,function(e){i.$apply(function(){w(i,{$event:e})})})}return{restrict:"A",link:i}}var t="md"+e,n="$md."+e.toLowerCase();return i.$inject=["$parse"],i}i.module("material.components.swipe",["material.core"]).directive("mdSwipeLeft",n("SwipeLeft")).directive("mdSwipeRight",n("SwipeRight")).directive("mdSwipeUp",n("SwipeUp")).directive("mdSwipeDown",n("SwipeDown"))}(window,window.angular);