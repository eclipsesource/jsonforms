import 'angular';

import '../../jsf-bootstrap.css';
import datetimeControlDirective from './controls/datetime/datetime-directive';
import booleanControlDirective from './controls/boolean/boolean-directive';
import controlDirective from './controls/bootstrap-controls-directive';
import categorizationDirective from './layouts/categories/categorization-directive';
import verticalLayoutDirective from './layouts/vertical/vertical-directive';
import horizontalLayoutDirective from './layouts/horizontal/horizontal-directive';
import masterDetailDirectives from './layouts/masterdetail/masterdetail-directives';
import groupLayoutDirective from './layouts/group/group-directive';

import form from '../components/form/form';
import capitalize from '../components/ng-services/capitalize/capitalize.filter';
import pathResolver from '../components/ng-services/pathresolver/pathresolver-service';

require('angular-ui-bootstrap');
require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');
require('angular-ui-validate');

angular.module('jsonforms-bootstrap', [
    'ui.validate',
    'ui.bootstrap',
    form,
    capitalize,
    pathResolver,
    datetimeControlDirective,
    booleanControlDirective,
    controlDirective,
    categorizationDirective,
    verticalLayoutDirective,
    horizontalLayoutDirective,
    groupLayoutDirective,
    masterDetailDirectives
]);
