var app = angular.module('listing', []);

function prettyPrintJson(json) {
    return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
}

app.provider('runtimeStates', function() {
    var stateToCounter = {};
    this.$get = function() {
        return {
            addState: function(name, idx) {
                stateToCounter[name] = idx;
            },
            getCount: function(state) {
                var cnt = stateToCounter[state];
                return cnt === undefined ? 0 : cnt;
            }

        }
    }
}).filter('prettyJSON', function () {
    return prettyPrintJson;
}).directive('nagPrism', [function() {
    return {
        restrict: 'A',
        scope: {
            source: '@'
        },
        link: function(scope, element, attrs) {
            scope.$watch('source', function(v) {
                if(v) {
                    Prism.highlightElement(element.find("code")[0]);
                }
            });
        },
        template: "<code ng-bind='source'></code>"
    };
}]);


function listingDirective() {
    return {
        restrict : "E",
        scope: true,
        bindToController: {
            schema: "=",
            uischema: "=",
            data: "=",
            text: '='
        },
        templateUrl: 'js/listing/listing.template.html',
        link: function(scope, el, attr, ctrl, transclude) {
            ctrl.registerStates();
            Prism.highlightAll(); // Only this that you need do!
        },
        controller : ['runtimeStates', function(runtimeStates) {
            var vm = this;
            vm.getSchema = function() {
                return vm.schema;
            };
            vm.getUiSchema=  function () {
                return vm.uischema;
            };
            vm.getData = function() {
                return vm.data;
            };
            vm.stringifiedUiSchema = prettyPrintJson(vm.uischema);
            vm.registerStates = function() {
                if (vm.didRegisterStates == true) {
                    return;
                }
                var currentState = '';

                vm.formState = currentState + '.form';
                vm.schemaState = currentState + '.schema';
                vm.uiSchemaState = currentState + '.uischema';

                var nth = runtimeStates.getCount(vm.formState) + 1;

                vm.nth = nth;
                vm.nthForm = vm.formState + "-" + nth;
                vm.nthSchema = vm.schemaState + "-" + nth;
                vm.nthUiSchema = vm.uiSchemaState + "-" + nth;

                vm.selectUiSchema = function() {
                    $('#myTab-' + nth + ' a:last').tab('show')
                };

                vm.selectForm = function() {
                    $('#myTab-' + nth + ' a:first').tab('show')
                };

                vm.selectSchema = function() {
                    $('#myTab-' + nth + ' li:eq(1) a').tab('show')
                };

                runtimeStates.addState(vm.formState, nth);
                runtimeStates.addState(vm.schemaState, nth);
                runtimeStates.addState(vm.uiSchemaState, nth);
                console.log('registered states!');
                vm.didRegisterStates = true;
            }
        }],
        controllerAs : 'vm'
    };
}

app.directive('listingControl', listingDirective);

