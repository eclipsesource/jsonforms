import 'angular';

require('angular-material');
require('angular-material/angular-material.css');

require('../src/jsonforms.css');
require('./jsonforms-material.css');

import arrayControlDirective from './controls/array/array-directive';
import booleanControlDirective from './controls/boolean/boolean-renderer';
import datetimeControlDirective from './controls/datetime/datetime-renderer';
import enumControlDirective from './controls/enum/enum-renderer';
import integerControlDirective from './controls/integer/integer-renderer';
import numberControlDirective from './controls/number/number-renderer';
import stringControlDirective from './controls/string/string-renderer';
import controlDirective from './controls/controls-directive';
import categorizationDirective from './layouts/categories/categorization-renderer';
import verticalLayoutDirective from './layouts/vertical/vertical-renderer';
import horizontalLayoutDirective from './layouts/horizontal/horizontal-renderer';
import groupLayoutDirective from './layouts/group/group-renderer';
import layoutDirective from './layouts/layouts-directive';


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
