import 'angular';

import datetimeControlDirective from './controls/datetime/datetime-directive';
import booleanControlDirective from './controls/boolean/boolean-directive';
import controlDirective from './controls/bootstrap-controls-directive';
import categorizationDirective from './layouts/categories/categorization-directive';
import verticalLayoutDirective from './layouts/vertical/vertical-directive';
import horizontalLayoutDirective from './layouts/horizontal/horizontal-directive';
import masterDetailDirectives from './layouts/masterdetail/masterdetail-directives';
import groupLayoutDirective from './layouts/group/group-directive';

// FIXME: include default bootstrap for glpyhicons etc as well
require('bootstrap/dist/css/bootstrap.min.css');
require('./jsf-bootstrap.css');
require('./jsonforms-bootstrap.css');
require('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf');
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
