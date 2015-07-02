/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./jsonforms.ts"/>

interface IRenderService {
    hasRendererFor(element: jsonforms.UISchemaElement): boolean
    renderAll(schema: jsonforms.UISchemaElement, uiSchema, instance, dataProvider);
    render(element: jsonforms.UISchemaElement, schema, instance, path, dataProvider);
}

interface IRenderer {
    id: string
    render(element: jsonforms.UISchemaElement, schema, instance, path: String, dataProvider)
}

class RenderService implements ng.IServiceProvider {

    //renderers = { [id: string]: IRenderer } = {};
    private renderers: { [id: string]: IRenderer; } = {};

    public $get(): IRenderService {
        return {
            render: (element: jsonforms.UISchemaElement, schema, instance, path, dataProvider) => {
                var renderer = this.renderers[element.id];
                return renderer.render(element, schema, instance, path, dataProvider);
            },
            hasRendererFor: (element: jsonforms.UISchemaElement) => {
                return this.renderers.hasOwnProperty(element.id);
            },
            renderAll: (schema, uiSchema, instance, dataProvider) => {
                var result = [];

                if (uiSchema.elements === undefined) {
                    return result;
                }

                var uiElements = uiSchema.elements;
                var basePath = "#/elements/";

                for (var i = 0; i < uiElements.length; i++) {

                    var uiElement = uiElements[i];
                    var path = basePath + i;

                    if (this.$get().hasRendererFor(uiElement)) {
                        var renderedElement = this.$get().render(uiElement, schema, instance, path, dataProvider);
                        result.push(renderedElement);
                    }
                }

                return result;
            },
            register: (renderer: IRenderer) => {
                this.renderers[renderer.id] = renderer;
            }
        }
    }

}

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
}).provider('RenderService', RenderService);