require('angular');
var datetime_directive_1 = require('./controls/datetime/datetime-directive');
var boolean_directive_1 = require('./controls/boolean/boolean-directive');
var bootstrap_controls_directive_1 = require('./controls/bootstrap-controls-directive');
var categorization_directive_1 = require('./layouts/categories/categorization-directive');
var vertical_directive_1 = require('./layouts/vertical/vertical-directive');
var horizontal_directive_1 = require('./layouts/horizontal/horizontal-directive');
var masterdetail_directives_1 = require('./layouts/masterdetail/masterdetail-directives');
var group_directive_1 = require('./layouts/group/group-directive');
require('./jsf-bootstrap.css');
require('angular-ui-bootstrap');
require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-bootstrap', [
    'ui.bootstrap',
    datetime_directive_1.default,
    boolean_directive_1.default,
    bootstrap_controls_directive_1.default,
    categorization_directive_1.default,
    vertical_directive_1.default,
    horizontal_directive_1.default,
    group_directive_1.default,
    masterdetail_directives_1.default
]).name;
//# sourceMappingURL=jsonforms_bootstrap.js.map