
var module = angular.module("jsonForms.data.common", []);

module.factory('DataCommon', ['$http', '$q', function($http, $q) {

    function isObjectType(element) {
        return element.type === "object";
    }

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
            console.log(property);
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
        isObjectType: isObjectType,
        fetchSchema: function(endpoint) {
            var defer = $q.defer();
            var promise = $http.get(endpoint);
            $q.all([promise]).then(function(schema) {
                defer.resolve(schema);
            });

            return defer.promise;
        },

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
}]);
