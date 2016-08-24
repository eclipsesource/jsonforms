require('angular');
require('angular-material');
require('angular-material/angular-material.css');
require('../src/jsonforms.css');
require('./jsonforms-material.css');
var array_directive_1 = require('./controls/array/array-directive');
var boolean_renderer_1 = require('./controls/boolean/boolean-renderer');
var datetime_renderer_1 = require('./controls/datetime/datetime-renderer');
var enum_renderer_1 = require('./controls/enum/enum-renderer');
var integer_renderer_1 = require('./controls/integer/integer-renderer');
var number_renderer_1 = require('./controls/number/number-renderer');
var string_renderer_1 = require('./controls/string/string-renderer');
var controls_directive_1 = require('./controls/controls-directive');
var categorization_renderer_1 = require('./layouts/categories/categorization-renderer');
var vertical_renderer_1 = require('./layouts/vertical/vertical-renderer');
var horizontal_renderer_1 = require('./layouts/horizontal/horizontal-renderer');
var group_renderer_1 = require('./layouts/group/group-renderer');
var layouts_directive_1 = require('./layouts/layouts-directive');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-material', [
    'ngMaterial',
    'ngAnimate',
    array_directive_1.default,
    boolean_renderer_1.default,
    datetime_renderer_1.default,
    enum_renderer_1.default,
    integer_renderer_1.default,
    number_renderer_1.default,
    integer_renderer_1.default,
    string_renderer_1.default,
    controls_directive_1.default,
    categorization_renderer_1.default,
    vertical_renderer_1.default,
    horizontal_renderer_1.default,
    group_renderer_1.default,
    layouts_directive_1.default
]).name;
//# sourceMappingURL=jsonforms-material.js.map