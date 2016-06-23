'use strict';

var app = angular.module('makeithappen', [
    'ngRoute',
    'jsonforms'
]);

try {
  // check whether jsonforms-bootstrap is available
  angular.module('jsonforms-bootstrap')
  app.requires.push('jsonforms-bootstrap');
} catch(ignored) {
  app.requires.push('jsonforms');
}
