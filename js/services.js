/// <reference path="../typings/angularjs/angular.d.ts"/>
var jsonforms;
(function (jsonforms) {
    var services;
    (function (services) {
        var UISchemaElement = (function () {
            function UISchemaElement(json) {
                this.json = json;
                this.type = json['type'];
                this.elements = json['elements'];
            }
            return UISchemaElement;
        })();
        services.UISchemaElement = UISchemaElement;
        // TODO: EXPORT
        var RenderService = (function () {
            // $compile can then be used as this.$compile
            function RenderService($compile) {
                var _this = this;
                this.$compile = $compile;
                this.renderers = [];
                this.render = function (element, schema, instance, path, dataProvider) {
                    var foundRenderer;
                    for (var i = 0; i < _this.renderers.length; i++) {
                        if (_this.renderers[i].isApplicable(element)) {
                            if (foundRenderer == undefined || _this.renderers[i].priority > foundRenderer.priority) {
                                foundRenderer = _this.renderers[i];
                            }
                        }
                    }
                    if (foundRenderer === undefined) {
                        throw new Error("No applicable renderer found for element " + JSON.stringify(element));
                    }
                    return foundRenderer.render(element, schema, instance, path, dataProvider);
                };
                this.register = function (renderer) {
                    _this.renderers.push(renderer);
                };
            }
            RenderService.$inject = ["$compile"];
            return RenderService;
        })();
        services.RenderService = RenderService;
        var ReferenceResolver = (function () {
            // $compile can then be used as this.$compile
            function ReferenceResolver($compile) {
                var _this = this;
                this.$compile = $compile;
                this.pathMapping = {};
                this.Keywords = ["items", "properties", "#"];
                this.addToMapping = function (addition) {
                    for (var ref in addition) {
                        if (addition.hasOwnProperty(ref)) {
                            _this.pathMapping[ref] = addition[ref];
                        }
                    }
                };
                this.get = function (uiSchemaPath) {
                    return _this.pathMapping[uiSchemaPath + "/scope/$ref"];
                };
                this.normalize = function (path) {
                    return _this.filterNonKeywords(_this.toPropertyFragments(path)).join("/");
                };
                this.resolve = function (instance, path) {
                    var p = path + "/scope/$ref";
                    if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                        p = _this.pathMapping[p];
                    }
                    return _this.resolveModelPath(instance, p);
                };
                this.resolveModelPath = function (instance, path) {
                    var fragments = _this.toPropertyFragments(_this.normalize(path));
                    return fragments.reduce(function (currObj, fragment) {
                        if (currObj instanceof Array) {
                            return currObj.map(function (item) {
                                return item[fragment];
                            });
                        }
                        return currObj[fragment];
                    }, instance);
                };
                this.toPropertyFragments = function (path) {
                    return path.split('/').filter(function (fragment) {
                        return fragment.length > 0;
                    });
                };
                this.filterNonKeywords = function (fragments) {
                    var that = _this;
                    return fragments.filter(function (fragment) {
                        return !(that.Keywords.indexOf(fragment) !== -1);
                    });
                };
            }
            ReferenceResolver.$inject = ["$compile"];
            return ReferenceResolver;
        })();
        services.ReferenceResolver = ReferenceResolver;
        var RecursionHelper = (function () {
            // $compile can then be used as this.$compile
            function RecursionHelper($compile) {
                var _this = this;
                this.$compile = $compile;
                this.compile = function (element, link) {
                    // Normalize the link parameter
                    if (angular.isFunction(link)) {
                        link = { post: link };
                    }
                    // Break the recursion loop by removing the contents
                    var contents = element.contents().remove();
                    var compiledContents;
                    var that = _this;
                    return {
                        pre: (link && link.pre) ? link.pre : null,
                        /**
                         * Compiles and re-adds the contents
                         */
                        post: function (scope, element) {
                            // Compile the contents
                            if (!compiledContents) {
                                compiledContents = that.$compile(contents);
                            }
                            // Re-add the compiled contents to the element
                            compiledContents(scope, function (clone) {
                                element.append(clone);
                            });
                            // Call the post-linking function, if any
                            if (link && link.post) {
                                link.post.apply(null, arguments);
                            }
                        }
                    };
                };
            }
            RecursionHelper.$inject = ["$compile"];
            return RecursionHelper;
        })();
        services.RecursionHelper = RecursionHelper;
    })(services = jsonforms.services || (jsonforms.services = {}));
})(jsonforms || (jsonforms = {}));
angular.module('jsonForms.services', []).service('RecursionHelper', jsonforms.services.RecursionHelper).service('ReferenceResolver', jsonforms.services.ReferenceResolver).service('RenderService', jsonforms.services.RenderService);
//# sourceMappingURL=services.js.map