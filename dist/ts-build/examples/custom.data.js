"use strict";
function customDirective() {
    return {
        restrict: 'E',
        template: '<jsonforms-control>' +
            '<input type="text" style="background-color: #3278b3; color: #8dd0ff" ' +
            'class="jsf-control-string jsf-control form-control" ' +
            'ng-change="vm.triggerChangeEvent()" ng-model="vm.resolvedData[vm.fragment]" />' +
            '</jsonforms-control>',
        controller: ['BaseController', '$scope', function (BaseController, $scope) {
                return new BaseController($scope);
            }],
        controllerAs: 'vm'
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('jsonforms-examples.custom', [])
    .value('custom.schema', {
    'type': 'object',
    'properties': {
        'firstName': {
            'type': 'string',
            'minLength': 3
        },
        'lastName': { 'type': 'string' },
        'age': {
            'type': 'integer',
            'minimum': 20
        },
        'address': {
            'type': 'object',
            'properties': {
                'street': {
                    'type': 'string'
                }
            }
        }
    },
    'required': ['lastName', 'firstName']
})
    .value('custom.uischema', {
    'type': 'VerticalLayout',
    'elements': [
        {
            'type': 'Control',
            'label': 'First name',
            'scope': { '$ref': '#/properties/firstName' },
            'options': {
                'useCustom': true
            }
        },
        {
            'type': 'Control',
            'label': 'Last name',
            'scope': { '$ref': '#/properties/lastName' }
        },
        {
            'type': 'Control',
            'label': 'Age',
            'scope': { '$ref': '#/properties/age' }
        },
        {
            'type': 'Control',
            'scope': { '$ref': '#/properties/address/properties/street' }
        }
    ]
})
    .value('custom.data', {
    'firstName': 'Gustav',
    'lastName': 'Gans'
})
    .directive('customControl', customDirective)
    .run(['RendererService', 'JSONFormsTesters', function (RendererService, testers) {
        RendererService.register('custom-control', testers.and(testers.uiTypeIs('Control'), testers.schemaPropertyName('firstName'), testers.optionIs('useCustom', true)), 3);
    }])
    .name;
//# sourceMappingURL=custom.data.js.map