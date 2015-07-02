var jsonRefs = require("json-refs");

angular.module('jsonForms.services', []).factory('ReferenceResolver', function () {
        var referenceMap = {};
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
            addToMapping: function (addition) {
                for (var ref in addition) {
                    if (addition.hasOwnProperty(ref)) {
                        referenceMap[ref] = addition[ref];
                    }
                }
            },
            get: function (uiSchemaPath) {
              return referenceMap[uiSchemaPath + "/scope/$ref"];
            },
            normalize: function(path) {
                // TODO: provide filterKeywords function
                return filterNonKeywords(toPropertyFragments(path)).join("/");
            },
            /**
             * Takes an JSON object and a schema path and resolve the schema path against the instance.
             * @param instance a JSON object
             * @param path a valid JSON path expression
             * @returns the dereferenced value
             */
            resolve: function(instance, path) {
                var p = path + "/scope/$ref";
                if (referenceMap !== undefined && referenceMap.hasOwnProperty(p)) {
                    p = referenceMap[p];
                }
                return this.resolveModelPath(instance, p);
            },
            resolveModelPath: function(instance, path) {
                var fragments = toPropertyFragments(this.normalize(path));
                return fragments.reduce(function (currObj, fragment) {
                    if (currObj instanceof Array) {
                        return currObj.map(function(item) {
                            return item[fragment];
                        });
                    }
                    return currObj[fragment];
                }, instance);
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
            // TODO
            //createUiElement: function(displayName, resolvedElement, value, path) {
            //    return {
            //        //displayname: displayName,
            //        //id: path,
            //        type: resolvedElement.scope !== undefined ? resolvedElement.scope.type : "",
            //        value: value,
            //        // FIXME
            //        //options: type.enum,
            //        isOpen: false,
            //        alerts: []
            //    };
            //},
            hasRendererFor: function(element) {
                return renderers.hasOwnProperty(element.type);
            },
            render: function (element, schema, instance, path, dataProvider) {
                var renderer = renderers[element.type];
                return renderer(element, schema, instance, path, dataProvider);
            },
            renderAll: function(schema, uiSchema, instance, dataProvider) {
                var result = [];

                if (uiSchema.elements === undefined) {
                    return result;
                }

                var uiSchemaElements = uiSchema.elements;
                var basePath = "#/elements/";

                for (var i = 0; i < uiSchemaElements.length; i++) {

                    var uiElement = uiSchemaElements[i];
                    var path = basePath + i;

                    if (this.hasRendererFor(uiElement)) {
                        var renderedElement = this.render(uiElement, schema, instance, path, dataProvider);
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
