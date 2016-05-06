import 'angular';

import '../../jsf-bootstrap.css';

require('angular-ui-bootstrap');
require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');
require('angular-ui-validate');

angular.module('jsonforms-bootstrap', [
    'ui.bootstrap',
    'jsonforms'
]);
