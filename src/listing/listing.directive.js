'use strict';

var app = angular.module('listing.listingdirective', []);

app.provider('listingsCounter', function() {
    var counter = 0;
    this.$get = function() {
        return {
            increment: function() {
                counter += 1;
            },
            value: function() {
                return counter;
            }
        }
    }
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
        template: require('./listing.template.html'),
        link: function(scope, el, attr, ctrl, transclude) {
            ctrl.registerStates();
            Prism.highlightAll(); // Only this that you need do!
        },
        controller : ['listingsCounter', function(listingsCounter) {
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
            vm.registerStates = function() {
                if (vm.didRegisterStates == true) {
                    return;
                }

                vm.formState = '.form';
                vm.schemaState = '.schema';
                vm.uiSchemaState = '.uischema';

                var nth = listingsCounter.value();

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

                listingsCounter.increment();
                // runtimeStates.addState(vm.formState, nth);
                // runtimeStates.addState(vm.schemaState, nth);
                // runtimeStates.addState(vm.uiSchemaState, nth);
                vm.didRegisterStates = true;
            }
        }],
        controllerAs : 'vm'
    };
}

app.directive('listingControl', listingDirective);

