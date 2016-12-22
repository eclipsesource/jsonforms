"use strict";
var angular = require('angular');
var renderer_service_1 = require('../renderers/renderer.service');
var path_resolver_service_1 = require('../ng-services/path-resolver/path-resolver.service');
var ui_schema_registry_service_1 = require('../ng-services/ui-schema-registry/ui-schema-registry.service');
var data_service_1 = require('../ng-services/data/data.service');
var generators_1 = require('../generators/generators');
var ui_schema_gen_service_1 = require('../generators/ui-schema-gen.service');
var schema_gen_service_1 = require('../generators/schema-gen.service');
var layout_directive_1 = require('../renderers/layouts/layout.directive');
var control_directive_1 = require('../renderers/controls/control.directive');
var categorization_directive_1 = require('../renderers/layouts/categories/categorization.directive');
var vertical_directive_1 = require('../renderers/layouts/vertical/vertical.directive');
var horizontal_directive_1 = require('../renderers/layouts/horizontal/horizontal.directive');
var masterdetail_directives_1 = require('../renderers/layouts/masterdetail/masterdetail.directives');
var group_directive_1 = require('../renderers/layouts/group/group.directive');
var label_directive_1 = require('../renderers/extras/label/label.directive');
var string_directive_1 = require('../renderers/controls/string/string.directive');
var integer_directive_1 = require('../renderers/controls/integer/integer.directive');
var number_directive_1 = require('../renderers/controls/number/number.directive');
var boolean_directive_1 = require('../renderers/controls/boolean/boolean.directive');
var array_directive_1 = require('../renderers/controls/array/array.directive');
var reference_directive_1 = require('../renderers/controls/reference/reference.directive');
var datetime_directive_1 = require('../renderers/controls/datetime/datetime.directive');
var enum_directive_1 = require('../renderers/controls/enum/enum.directive');
var form_directive_1 = require('../form/form.directive');
var abstract_control_1 = require('../renderers/controls/abstract-control');
var testers_1 = require('../renderers/testers');
var norenderer_directive_1 = require('../renderers/norenderer-directive');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.form', [
    renderer_service_1.default,
    path_resolver_service_1.default,
    ui_schema_registry_service_1.default,
    data_service_1.default,
    generators_1.default,
    ui_schema_gen_service_1.default,
    schema_gen_service_1.default,
    form_directive_1.default,
    control_directive_1.default,
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