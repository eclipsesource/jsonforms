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
}).factory('DataCommon', ['$http', '$q', function($http, $q) {

    function getType(elementName, schema) {
        var properties = schema.properties;
        var propertiesKeys = Object.keys(properties);

        var result = {
            "type": "",
            "enum": []
        };

        for (var i = 0; i < propertiesKeys.length; i++) {
            var key = propertiesKeys[i];
            if (key === elementName) {
                var type = properties[key].type;
                //string can be "more" than string
                if (type === "string") {
                    if (properties[key].format !== undefined) {
                        var format = properties[key].format;
                        if (format === "date-time") {
                            result.type = "date-time";
                            return result;
                        }
                    }

                    if (properties[key].enum !== undefined) {
                        result.type = "enum";
                        result.enum = properties[key].enum;
                        return result;
                    }
                } else if (type === "array") {
                    result.items = properties[key].items;
                }

                result.type = type;
                return result;
            }
        }

        return result;
    }

    function getValue(elementName, instanceData) {
        if (instanceData === undefined) {
            return null;
        }

        var path = elementName;
        var isArray = false;
        var index = -1;
        var bracketIdx = elementName.indexOf("[")

        // TODO: urghs
        if (bracketIdx > -1) {
            path = elementName.substring(0, bracketIdx);
            isArray = true;
            index = elementName[bracketIdx + 1];
            var property = elementName.substr(bracketIdx + 4);
        }

        if (isArray) {
            return instanceData[path][index][property];
        } else {
            // TODO: why not just call instanceData[key]?
            var keys = Object.keys(instanceData);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key === elementName) {
                    return instanceData[key];
                }
            }
        }

        return null;
    }

    var getInstanceWithID = function (instanceData, id) {
        if (id === "Create") {
            return undefined;
        }
        for (var i = 0; i < instanceData.length; i++) {
            var instance = instanceData[i];
            if (id === instance.id) {
                return instance;
            }
        }
        return undefined;
    };

    var createInstanceUrl = function(url, type, id) {
        return url + "/" + type + (id !== undefined ? "/" + id : "");
    };

    var createViewUrl = function(url, type, id) {
        return url + "/" + type + "/view" + (id !== undefined ? "/" + id : "")
    };

    var createSchemaUrl = function(url, type) {
        return url + "/" + type + "/model"
    };

    return {
        getValue: getValue,
        getType: getType,
        getFormData: function(url, type, id) {

            var defer = $q.defer();

            var viewUrl = createViewUrl(url, type, id);
            var instanceUrl = createInstanceUrl(url, type, id);
            var schemaUrl = createSchemaUrl(url, type);

            var viewPromise = $http.get(viewUrl);
            var modelPromise = $http.get(schemaUrl);
            var dataPromise = $http.get(instanceUrl);

            $q.all([viewPromise, modelPromise, dataPromise]).then(function(values) {
                var viewModelData = values[0].data;
                var ecoreModelData = values[1].data;
                var rawInstanceData = values[2].data;
                //var instanceData = getInstanceWithID(rawInstanceData, id);

                //var result = handleRawData($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap, RenderService);
                defer.resolve({
                    viewModelData: viewModelData,
                    ecoreModelData: ecoreModelData,
                    rawInstanceData: rawInstanceData
                });
            });

            return defer.promise;
        },
        handleRawData: function ($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap){
            var result = {
                "id": "",
                "layoutTree": [],
                "bindings": {}
            };

            var layoutTree = buildLayoutTree($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap);

            //check for id in instanceData
            if (instanceData !== undefined && instanceData.id !== undefined) {
                result.id = instanceData.id;
            }

            result.layoutTree = layoutTree;
            // TODO: bindings
            //result.bindings = bindings;
            return result;
        }
    }
}]).factory('EndpointMapping', function() {

        var mapping = {};

        var mergeObjects = function(obj1, obj2) {
            var obj3 = {};
            for (var attr1 in obj1) { obj3[attr1] = obj1[attr1] }
            for (var attr2 in obj2) { obj3[attr2] = obj2[attr2] }
            return obj3;
        };

        return {
            register: function(schemaType, schemaMapping) {
                mapping[schemaType] = schemaMapping;
            },
            map: function(schemaType) {

                var m = mapping[schemaType];

                return mergeObjects(m, {
                    isPaginationEnabled: function() {
                        return m.pagination !== undefined;
                    },
                    isFilteringEnabled: function() {
                        return m.filtering !== undefined;
                    },
                    page: function(currentPage, pageSize) {
                        var paginationUrl = m.pagination.url;
                        var pageNrParam = m.pagination.paramNames.pageNr;
                        var pageSizeParam = m.pagination.paramNames.pageSize;
                        var separator = paginationUrl.indexOf("?") > -1 ? "&" : "?";
                        return paginationUrl + separator + pageNrParam + "=" + (currentPage - 1) + "&" + pageSizeParam + "=" + pageSize;
                    },
                    filter: function (searchTerms) {
                        var filterUrl = m.filtering.url + "?";
                        var separator = filterUrl.indexOf("?") > -1 ? "&" : "?";
                        for (var i = 0; i < searchTerms.length; i++) {
                            filterUrl += "&" + searchTerms[i].column + "=" + searchTerms[i].term;
                        }
                        return filterUrl;
                    },
                    count: function() {
                        // TODO
                        return m.many;
                    }
                });
            }
        };
    }
).provider('RenderService', function() {

    /**
     * Maps viewmodel types to renderers
     */
    var renderers = {};

    this.addRenderer = function(renderer) {
        renderers[renderer.id] = renderer.render;
    };

    this.$get = ['DataCommon', function(Data) {
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
                var renderer = renderers[element.type];
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
