import 'angular';

import datetimeControlDirective from './controls/datetime/datetime-directive';
import booleanControlDirective from './controls/boolean/boolean-directive';
import controlDirective from './controls/bootstrap-controls-directive';
import categorizationDirective from './layouts/categories/categorization-directive';
import verticalLayoutDirective from './layouts/vertical/vertical-directive';
import horizontalLayoutDirective from './layouts/horizontal/horizontal-directive';
import masterDetailDirectives from './layouts/masterdetail/masterdetail-directives';
import groupLayoutDirective from './layouts/group/group-directive';

require('./jsf-bootstrap.css');
require('angular-ui-bootstrap');
require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');

export default angular.module('jsonforms-bootstrap', [
    'ui.bootstrap',
    datetimeControlDirective,
    booleanControlDirective,
    controlDirective,
    categorizationDirective,
    verticalLayoutDirective,
    horizontalLayoutDirective,
    groupLayoutDirective,
    masterDetailDirectives
]).name;
