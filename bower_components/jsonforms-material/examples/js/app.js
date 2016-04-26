'use strict';

angular.module('makeithappen', [
    'ngResource',
    'jsonforms-material',
    'ngMaterial',
    'ngAnimate',
    <!-- eval-->
    ,'ui.bootstrap'
    ,'ui.grid'
])
/* activate for demo */
.config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('light-blue')
      .accentPalette('blue')
      .backgroundPalette('indigo').dark();
  })
;
