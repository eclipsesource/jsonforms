var angular = require('angular');
var renderer_service_1 = require('../renderers/renderer-service');
var pathresolver_service_1 = require('../ng-services/pathresolver/pathresolver-service');
var uischemaregistry_service_1 = require('../ng-services/uischemaregistry/uischemaregistry-service');
var data_service_1 = require('../ng-services/data/data-service');
var generators_1 = require('../generators/generators');
var jsonforms_uischemagenerator_1 = require('../generators/jsonforms-uischemagenerator');
var jsonforms_schemagenerator_1 = require('../generators/jsonforms-schemagenerator');
var layout_directive_1 = require('../renderers/layouts/layout-directive');
var controls_directive_1 = require('../renderers/controls/controls-directive');
var categorization_directive_1 = require('../renderers/layouts/categories/categorization-directive');
var vertical_directive_1 = require('../renderers/layouts/vertical/vertical-directive');
var horizontal_directive_1 = require('../renderers/layouts/horizontal/horizontal-directive');
var masterdetail_directives_1 = require('../renderers/layouts/masterdetail/masterdetail-directives');
var group_directive_1 = require('../renderers/layouts/group/group-directive');
var label_directive_1 = require('../renderers/extras/label/label-directive');
var string_directive_1 = require('../renderers/controls/string/string-directive');
var integer_directive_1 = require('../renderers/controls/integer/integer-directive');
var number_directive_1 = require('../renderers/controls/number/number-directive');
var boolean_directive_1 = require('../renderers/controls/boolean/boolean-directive');
var array_directive_1 = require('../renderers/controls/array/array-directive');
var reference_directive_1 = require('../renderers/controls/reference/reference-directive');
var datetime_directive_1 = require('../renderers/controls/datetime/datetime-directive');
var enum_directive_1 = require('../renderers/controls/enum/enum-directive');
var form_directive_1 = require('../form/form-directive');
var abstract_control_1 = require('../renderers/controls/abstract-control');
var testers_1 = require('../renderers/testers');
var norenderer_directive_1 = require('../renderers/norenderer-directive');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.form', [
    renderer_service_1.default,
    pathresolver_service_1.default,
    uischemaregistry_service_1.default,
    data_service_1.default,
    generators_1.default,
    jsonforms_uischemagenerator_1.default,
    jsonforms_schemagenerator_1.default,
    form_directive_1.default,
    controls_directive_1.default,
    layout_directive_1.default,
    norenderer_directive_1.default,
    array_directive_1.default,
    string_directive_1.default,
    integer_directive_1.default,
    number_directive_1.default,
    boolean_directive_1.default,
    enum_directive_1.default,
    reference_directive_1.default,
    datetime_directive_1.default,
    label_directive_1.default,
    group_directive_1.default,
    vertical_directive_1.default,
    horizontal_directive_1.default,
    categorization_directive_1.default,
    masterdetail_directives_1.default,
    abstract_control_1.default,
    testers_1.default
])
    .name;
//# sourceMappingURL=form.js.map