import 'angular';

import datetimeControlDirective from './controls/datetime/bootstrap-datetime.template';
import booleanControlDirective from './controls/boolean/bootstrap-boolean.template';
import arrayControlDirective from './controls/array/bootstrap-array.template';
import controlDirective from './controls/bootstrap-control.template';
import categorizationDirective from './layouts/categories/bootstrap-categorization.template';
import categorizationExpandbarDirective
  from './layouts/categories/categorization-expandbar.directive';
import verticalLayoutDirective from './layouts/vertical/bootstrap-vertical.template';
import horizontalLayoutDirective from './layouts/horizontal/bootstrap-horizontal.template';
import masterDetailDirectives from './layouts/masterdetail/bootstrap-masterdetail.template';
import groupLayoutDirective from './layouts/group/bootstrap-group.template';

// FIXME: include default bootstrap for glpyhicons etc as well
require('bootstrap/dist/css/bootstrap.min.css');
require('./jsf-bootstrap.css');
require('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf');
require('angular-ui-bootstrap');
require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');

export default angular.module('jsonforms-bootstrap', [
    'ui.bootstrap',
    datetimeControlDirective,
    booleanControlDirective,
    arrayControlDirective,
    controlDirective,
    categorizationDirective,
    categorizationExpandbarDirective,
    verticalLayoutDirective,
    horizontalLayoutDirective,
    groupLayoutDirective,
    masterDetailDirectives
]).name;
