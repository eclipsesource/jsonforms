var jsonRefs = require("json-refs");

angular.module('jsonForms.services', []).provider('BindingService', function() {

    var bindings = {};

    this.addBinding = function(id, element) {
        bindings[id] = element;
    };

    this.binding = function(id) {
        return bindings[id];
    };

    this.all = function(ignoreUndefined) {
        var data = {};
        for (var key in bindings) {
            var value = bindings[key];
            if (value != null || (value == null && !ignoreUndefined)) {
                data[key] = value;
            }
        }
        return data;
    };

    this.$get = function() {
        var that = this;
        return {
            add: that.addBinding,
            binding: that.binding,
            all: that.all
        }
    };
}).factory('ReferenceResolver', function () {
        var referenceMap;
        var keywords = ["items", "properties", "#"];

        function toPropertyFragments(path) {
            return path.split('/').filter(function(fragment) {
                return fragment.length > 0;
            })
        }

        function filterNonKeywords(fragments) {
            return fragments.filter(function (fragment) {
                return !(keywords.indexOf(fragment) !== -1);
            });
        }

        return {
            set: function (referenceMapping) {
                referenceMap = referenceMapping;
            },
            normalize: function(path) {
                // TODO: provide filterKeywords function
                return filterNonKeywords(toPropertyFragments(path)).join("/");
            },
            resolve: function(instance, path) {
                var p = path + "/scope/$ref";
                if (referenceMap.hasOwnProperty(p)) {
                    p = referenceMap[p];
                }
                var fragments = toPropertyFragments(this.normalize(p));
                var data = fragments.reduce(function(currObj, fragment) {
                   return currObj[fragment];
                }, instance);
                return data;
            }
        };
}).provider('RenderService', function() {

    /**
     * Maps viewmodel types to renderers
     */
    var renderers = {};

    this.addRenderer = function(renderer) {
        renderers[renderer.id] = renderer.render;
    };

    this.$get = function() {
        var that = this;
        return {
            // can be made private?
            createUiElement: function(displayName, resolvedElement, value) {
                return {
                    displayname: displayName,
                    id: resolvedElement.id,
                    type: resolvedElement.scope !== undefined ? resolvedElement.scope.type : "",
                    value: value,
                    // FIXME
                    //options: type.enum,
                    isOpen: false,
                    alerts: []
                };
            },
            hasRendererFor: function(element) {
                return renderers.hasOwnProperty(element.type);
            },
            render: function (element, schema, instance, path) {
                var renderer = renderers[element.type];
                return renderer(element, schema, instance, path);
            },
            renderAll: function(schema, uiSchema, instance) {
                var result = [];

                if (uiSchema.elements === undefined) {
                    return result;
                }

                var uiElements = uiSchema.elements;
                var basePath = "#/elements/";

                for (var i = 0; i < uiElements.length; i++) {

                    var uiElement = uiElements[i];
                    var path = basePath + i;

                    if (this.hasRendererFor(uiElement)) {
                        var renderedElement = this.render(uiElement, schema, instance, path);
                        result.push(renderedElement);
                    }
                }

                return result;
            },
            register: function (renderer) {
                that.addRenderer(renderer);
            }
        }
    };
});
