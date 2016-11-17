import 'angular';

require('angular-material');
require('angular-material/angular-material.css');

import arrayControlDirective from './controls/array/md-array.template';
import booleanControlDirective from './controls/boolean/md-boolean.template';
import datetimeControlDirective from './controls/datetime/md-datetime.template';
import enumControlDirective from './controls/enum/md-enum.template';
import integerControlDirective from './controls/integer/md-integer.template';
import numberControlDirective from './controls/number/md-number.template';
import stringControlDirective from './controls/string/md-string.template';
import controlDirective from './controls/md-control.template';
import categorizationDirective from './layouts/categories/md-categorization.template';
import verticalLayoutDirective from './layouts/vertical/md-vertical.template';
import horizontalLayoutDirective from './layouts/horizontal/md-horizontal.template';
import groupLayoutDirective from './layouts/group/md-group.template';
import layoutDirective from './layouts/md-layout.template';


export default angular.module('jsonforms-material', [
    'ngMaterial',
    'ngAnimate',
    arrayControlDirective,
    booleanControlDirective,
    datetimeControlDirective,
    enumControlDirective,
    integerControlDirective,
    numberControlDirective,
    integerControlDirective,
    stringControlDirective,
    controlDirective,

    categorizationDirective,
    verticalLayoutDirective,
    horizontalLayoutDirective,
    groupLayoutDirective,
    layoutDirective
]).name;
