/**
 * Created by Edgar on 28.02.2015.
 */

'use strict';

var app = angular.module('jsonForms.renderService', []);

app.provider('RenderService', function() {

    /**
     * Maps viewmodel types to renderers
     */
    var renderers = {};

    this.addRenderer = function(renderer) {
        renderers[renderer.id] = renderer.render;
    };

    this.$get = ['DataCommon', 'EndpointMapping', function(Data, EndpointMapping) {
        var that = this;
        return {
            // can be made private?
            createUiElement: function(displayName, path, type, value) {
                return {
                    displayname: displayName,
                    id: path,
                    value: value,
                    type: type.type,
                    options: type.enum,
                    isOpen: false,
                    alerts: []
                };
            },
            hasRendererFor: function(element) {
                return renderers.hasOwnProperty(element.type);
            },
            render: function (element, model, instance, $scope) {
                console.log("Fetching renderer for type " + element.type);
                var renderer = renderers[element.type];
                console.log(JSON.stringify(renderers));
                return renderer(element, model, instance, $scope);
            },
            renderAll: function(schema, viewModel, instance, $scope) {
                var result = [];

                if (viewModel.elements === undefined) {
                    return result;
                }

                var elements = viewModel.elements;

                for (var i = 0; i < elements.length; i++) {

                    var element = elements[i];

                    if (this.hasRendererFor(element)) {
                        var renderedElement = this.render(element, schema, instance, $scope);
                        result.push(renderedElement);
                    }
                }

                return result;
            },
            register: function (renderer) {
                that.addRenderer(renderer);
            },
            unregister: function () {

            }
        }
    }];

    //return service;
});

//var myApp = angular.module('jsonForms', []);
//
//// Create a map-based configuration service
//myApp.provider('RenderService', function () {
//    var service = {};
//    service.configureSomething = function () {
//        return 461;
//    };
//    service.$get = function () {
//        return {};
//    };
//    return service;
//});