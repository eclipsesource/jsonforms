var groupTemplate = "<jsonforms-layout>\n    <div class=\"jsf-group\">\n        \n          <fieldset>\n              <legend ng-if=\"vm.label\">{{vm.label}}</legend>\n              <jsonforms-inner ng-repeat=\"child in vm.uiSchema.elements\"\n                             uischema=\"child\"\n                             class=\"col-sm-100\">\n              </jsonforms-inner>\n          </fieldset>      \n        \n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.layouts.group', ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;
//# sourceMappingURL=group-directive.js.map