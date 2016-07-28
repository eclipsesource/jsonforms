'use strict';

var app = angular.module('makeithappen');

angular.module('makeithappen').controller('PersonController', function() {
    var vm = this;
    vm.schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3
            },
            "age": {
                "type": "integer",
                "minimum": 0
            }
        }
    };
    vm.uiSchema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/name" }
            },
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/name" }
            }
        ]
    };
});

function tabbedDirective() {
    return {
        restrict : "E",
        template : '<jsonforms data="vm.schema" uischema="vm.uischema" schema="vm.schema"></jsonforms>'
        controller : ['BaseController', '$scope', function(BaseController, $scope) {
            BaseController.call( this, $scope );
        }],
        controllerAs : 'vm'
    };
}

angular.module('makeithappen')
    .directive('tabbedDirective', tabbedDirective)
    .run(['RendererService', 'JSONFormsTesters', function(RendererService, testers) {
        RendererService.register('tabbed-directive', JSONFormsTesters)
    });