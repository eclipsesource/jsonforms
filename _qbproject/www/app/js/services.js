'use strict';

/* Services */
var dataServices = angular.module('qbForms.dataServices', []);
var utilityServices = angular.module('qbForms.utilityServices', []);

var maxSize = 99;

//http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
//TODO: Maybe Use https://github.com/marklagendijk/angular-recursion ? 
dataServices.factory('RecursionHelper', ['$compile',
    function($compile) {
        return {
            compile: function(element, link){
                // Normalize the link parameter
                if(angular.isFunction(link)){
                    link = { post: link };
                }

                // Break the recursion loop by removing the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: (link && link.pre) ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function(scope, element){
                        // Compile the contents
                        if(!compiledContents){
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function(clone){
                            element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if(link && link.post){
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }
]);

dataServices.factory('SendData', ['$http',
    function($http) {
        return {
            sendData: function(url, type, id, data) {

                if (id !== "") {
                    data.id = id;
                    console.log("post url is " + url + type + "/" + id);
                    $http.post(url + type + "/" + id, data).success(function() {
                        alert("Update Data successful");
                    }).error(function(){
                        alert("Update Data failed!");
                    });
                } else {
                    $http.post("/" + type, data).success(function() {
                        alert("Create Data successful");
                    }).error(function(){
                        alert("Create Data failed!");
                    });
                }
            }
        };
    }
]);

dataServices.factory('GetDataLocal', ['$http', '$q',
    function($http, $q) {
        return {
            getFormData: function(url, type, id, $scope) {
                return getFormData($http, $q, id, {
                    "viewUrl":  "/" + type + "-view.json",
                    "modelUrl": "/" + type + "-model.json",
                    "dataUrl":  "/" + type + "-data.json"
                }, $scope);
            },
            getAllRawData: function(url, type, id) {
                return getAllRawData($http, $q, id, {
                    "viewUrl":  "/" + type + "-view.json",
                    "modelUrl": "/" + type + "-model.json",
                    "dataUrl":  "/" + type + "-data.json"
                });
            },
            getRawInstanceData: function(url, type, id) {
                return getRawInstanceData($http, $q, "assets/" + type + "-data.json", id);
            },
            getRawModelData: function(url, type) {
                return getRawModelData($http, $q, "assets/" + type + "-model.json");
            },
            getLocalData: function(modelData, viewData){
                return handleRawData($http, $q, undefined, modelData, viewData);
            }
        };
    }
]);

dataServices.factory('GetData', ['$http', '$q',
    function($http, $q) {
        return {
            getFormData: function(url, type, id, $scope) {
                return getFormData($http, $q, id, {
                    "baseUrl": url,
                    "viewUrl": url + "/" + type + "/view",
                    "modelUrl": url + "/" + type + "/model",
                    "dataUrl": url + "/" + type + ""
                }, $scope);
            },
            getAllRawData: function(url, type, id) {
                return getAllRawData($http, $q, id, {
                    "baseUrl": url,
                    "viewUrl": url + "/" + type + "/view",
                    "modelUrl": url + "/" + type + "/model",
                    "dataUrl": url + "/" + type + ""
                });
            },
            getRawInstanceData: function(url, type, id) {
                return getRawInstanceData($http, $q, url + "/" + type + "/", id)
            },
            getRawModelData: function(url, type) {
                return getRawModelData($http, $q, url + "/" + type + "/model");
            }
        };
    }
]);

dataServices.factory('GetDataRemote', ['$http', '$q',
    function($http, $q) {
        return {
            getFormData: function(url, type, id, $scope) {
                return getFormData($http, $q, id, {
                    "baseUrl": url,
                    "viewUrl": url + "/" + type + "/view"  + (id === undefined ? "" : "/" + id),
                    "modelUrl": url + "/" + type + "/model",
                    "dataUrl": url + "/" + type
                }, $scope);
            },
            getAllRawData: function(url, type, id) {
                return getAllRawData($http, $q, id, {
                    "baseUrl": url,
                    "viewUrl": url + "/" + type + "/view" + (id === undefined ? "" : "/" + id),
                    "modelUrl": url + "/" + type + "/model",
                    "dataUrl": url + "/" + type
                });
            },
            getRawInstanceData: function(url, type, id) {
                return getRawInstanceData($http, $q, url + "/" + type + "/", id)
            },
            getRawModelData: function(url, type) {
                return getRawModelData($http, $q, url + "/" + type + "/model");
            }
        };
    }
]);

function getFormData($http, $q, id, urlMap, $scope) {

    var defer = $q.defer();

    var viewPromise;
    var modelPromise;
    var dataPromise;

    viewPromise = $http.get(urlMap["viewUrl"]);
    modelPromise = $http.get(urlMap["modelUrl"]);
    dataPromise = $http.get(urlMap["dataUrl"]);

    console.log(urlMap);

    $q.all([viewPromise, modelPromise, dataPromise]).then(function(values) {
        var viewModelData = values[0].data;
        var ecoreModelData = values[1].data;
        var rawInstanceData = values[2].data;
        var instanceData = getInstanceWithID(rawInstanceData, id);

        var result = handleRawData($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap);
        defer.resolve(result);
    });

    return defer.promise;
}


function handleRawData($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap){
    var result = {
        "id": "",
        "layoutTree": [],
        "bindings": {}
    };

    var bindings = {};
    var layoutTree = buildLayoutTree($http, $q, $scope, ecoreModelData, viewModelData, instanceData, bindings, urlMap);

    //check for id in instanceData
    if (instanceData !== undefined && instanceData.id !== undefined) {
        result.id = instanceData.id;
    }

    result.layoutTree = layoutTree;
    result.bindings = bindings;
    return result;
}

function getAllRawData($http, $q, id, urlMap) {
    var defer = $q.defer();

    var viewPromise = $http.get(urlMap["viewUrl"]);
    var modelPromise = $http.get(urlMap["modelUrl"]);
    var dataPromise = $http.get(urlMap["dataUrl"]);

    $q.all([viewPromise, modelPromise, dataPromise]).then(function(values) {
        var viewModelData = values[0].data;
        var ecoreModelData = values[1].data;
        var rawInstanceData = values[2].data;
        var instanceData = getInstanceWithID(rawInstanceData, id);

        var result = {
            "model": ecoreModelData,
            "layout": viewModelData,
            "instance": instanceData
        };

        //check for id in instanceData
        if (instanceData !== undefined && instanceData.id !== undefined) {
            result.id = instanceData.id;
        }

        defer.resolve(result);
    });

    return defer.promise;
}

function getRawInstanceData($http, $q, dataUrl, id) {
    var defer = $q.defer();
    var dataPromise = $http.get(dataUrl);

    $q.all([dataPromise]).then(function(values) {
        var result;
        var rawInstanceData = values[0].data;
        if (id === undefined) {
            result = rawInstanceData;
        } else {
            result = getInstanceWithID(rawInstanceData, id);
        }
        defer.resolve(result);
    });

    return defer.promise;
}

function getRawModelData($http, $q, modelUrl) {
    var defer = $q.defer();

    var dataPromise = $http.get(modelUrl);

    $q.all([dataPromise]).then(function(values) {
        var rawPersonData = values[0].data;
        defer.resolve(rawPersonData);
    });

    return defer.promise;
}

/**
 * TODO: pass in config object to enable paging etc.
 *
 */
function buildTableControlObject() {
    var tObject = {
        "type": "Control",
        "elements": [],
        "size": maxSize
    };
    return tObject;
}
function initTable(data, tableUiElement) {

    for (var h = 0; h < data[0].length; h++) {

        tableUiElement.tableOptions.gridOptions.totalItems = data[0].length;
        console.log("totalItems are " + data[0].length);
        var d = data[0][h];

        if (tableUiElement.tableOptions.gridOptions.data.length < tableUiElement.tableOptions.pagingOptions.pageSize) {
            tableUiElement.tableOptions.gridOptions.data.push(d);
        } else {
            break;
        }
    }
}
function createTableCallbacks(url, pagingUrl, tableUiElement, $scope, $http) {
    return function (gridApi) {
        gridApi.paging.on.pagingChanged($scope, function (pageNumber, pageSize) {
            var pagingOptions = tableUiElement.tableOptions.pagingOptions;
            pagingOptions.pageNumber = pageNumber;
            pagingOptions.pageSize = pageSize;
            var separator = url.indexOf("?") > -1 ? "&" : "?";
            $http.get(pagingUrl + separator + "page=" + (pagingOptions.pageNumber - 1) + "&pageSize=" + pagingOptions.pageSize).success(function (newdata) {
                console.log(pagingUrl + separator + "page=" + (pagingOptions.pageNumber - 1) + "&pageSize=" + pagingOptions.pageSize);
                console.log(newdata);
                tableUiElement.tableOptions.gridOptions.data = newdata;
            });
        });
        gridApi.core.on.filterChanged($scope, function () {
            var grid = this.grid;
            var searchTerm = grid.columns[0].filters[0].term;
            var pagingOptions = tableUiElement.tableOptions.pagingOptions;
            var separator = url.indexOf("?") > -1 ? "&" : "?";
            if (searchTerm !== undefined && searchTerm !== "") {
                console.log(url + separator + "page=" + (pagingOptions.pageNumber - 1) + "&pageSize=" + pagingOptions.pageSize + "&title=" + searchTerm);
                $http.get(url + separator + "page=" + (pagingOptions.pageNumber - 1) + "&pageSize=" + pagingOptions.pageSize + "&title=" + searchTerm)
                    .success(function (data) {
                        console.log("new data via search " + data);
                        tableUiElement.tableOptions.gridOptions.data = data;
                    });
            } else {
                $http.get(url + separator + "page=" + (pagingOptions.pageNumber - 1) + "&pageSize=" + pagingOptions.pageSize)
                    .success(function (newdata) {
                        tableUiElement.tableOptions.gridOptions.data = newdata;
                    });
            }
        });

    }
}

function buildLayoutTree($http, $q, $scope, model, layout, instance, bindings, urlMap) {
    var result = [];

    if (layout.elements === undefined) {
        return result;
    }

    for (var i = 0; i < layout.elements.length; i++) {

        var element = layout.elements[i];

        if (element.type === "QBVerticalLayout") {
            var vLayoutObject = {
                "type": "VerticalLayout",
                "elements": buildLayoutTree($http, $q, $scope, model, element, instance, bindings, urlMap),
                "size": maxSize
            };

            //no need to change sizes
            result.push(vLayoutObject);

        } else if (element.type === "QBHorizontalLayout") {
            var hLayoutObject = {
                "type": "HorizontalLayout",
                "elements": buildLayoutTree($http, $q, $scope, model, element, instance, bindings, urlMap),
                "size": maxSize
            };

            console.log(hLayoutObject.elements);

            //change sizes
            var size = hLayoutObject.elements.length;
            var individualSize = Math.floor(maxSize / size);
            for (var j = 0; j < hLayoutObject.elements.length; j++) {
                hLayoutObject.elements[j].size = individualSize;
                console.log(j + ": " + hLayoutObject.elements[j].size);
            }


            result.push(hLayoutObject);
        } else if (element.type === "Control") {
            var cObject = {
                "type": "Control",
                "elements": [],
                "size": maxSize
            };

            var elementPath = element.path;
            var elementName = element.name;
            if (elementName === undefined || elementName === null) {
                elementName = elementPath;
            }

            var elementTypeInfo = getType(elementPath, model);
            var instanceValue = getValue(elementPath, instance);

            var uiElement = getUIElement(elementName, elementPath, elementTypeInfo, instanceValue);
            cObject.elements.push(uiElement);

            result.push(cObject);

            bindings[uiElement.id] = uiElement.value;
            // TODO:
            //} else if (element.type === "Table") {
            //    var tObject = {
            //        "type": "Table",
            //        "columns": element.columns,
            //        "elements": [],
            //        "size": maxSize
            //    };
            //    var columns = element.columns; // "columns" : [ { "type" : "Column", "path" : "name" } ]
            //    var elementPath = element.path;
            //
            //    var elementTypeInfos = getType(elementPath, model);   // == qbList(task)
            //    var instanceValues = getValue(elementPath, instance); // == tasks
            //    var tableUiElement = getUIElement(elementPath, elementPath, elementTypeInfos, instanceValues);
            //
            //    for (var j = 0; j < instanceValues.length; j++) {
            //        console.log(instanceValues[j]);
            //        tObject.elements.push(instanceValues[j]);
            //    }
            //
            //    result.push(tObject);
            //    bindings[tableUiElement.name] = tableUiElement.value;

            ////////////////////////////
        } else if (element.type === "QBScopedTable") {

            var endPoint = element.endPoint;
            var endPointParam = element.endPointParam;
            if (endPointParam.indexOf("{{id}}") > -1) {
                endPointParam = endPointParam.replace("{{id}}", instance.id)
            }

            var url = urlMap["baseUrl"]  + endPoint + endPointParam;
            var pagingUrl = urlMap["baseUrl"] + element.options["pagingUrl"];
            if (pagingUrl.indexOf("{{id}}") > -1) {
                pagingUrl= pagingUrl.replace("{{id}}", instance.id)
            }
            console.log("Paging URL is " + pagingUrl);

            var tObject = buildTableControlObject();
            var tableUiElement = buildTableUIElement(element, {type: "multi-reference"}, $http, url);

            tableUiElement.tableOptions.gridOptions.onRegisterApi = createTableCallbacks(url, pagingUrl, tableUiElement, $scope, $http)
            tObject.elements.push(tableUiElement);
            bindings[tableUiElement.id] = tableUiElement.value;
            result.push(tObject);

            var promise = getRawInstanceData($http, $q, url);
            $q.all([promise]).then(function(data) {
                initTable(data, tableUiElement);
            });

        } else if (element.type === "Label") {
            var lObject = {
                "type": element.type,
                "elements": [],
                "size": maxSize
            };

            var uiElement = getUIElement("", "", {type:"Label"}, element.text);
            lObject.elements.push(uiElement);

            result.push(lObject);
        }
    }

    return result;
}

function getInstanceWithID(instanceData, id) {
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
}

function getType(elementName, model) {
    var properties = model.properties;
    var propertiesKeys = Object.keys(properties);

    var result = {
        "type": "",
        "enum": []
    };

    var path = elementName;
    var isArray = false;
    var index = -1;
    var bracketIdx = elementName.indexOf("[")

    // TODO: urghs
    if (bracketIdx > -1) {
        path = elementName.substring(0, bracketIdx);
        isArray = true;
        index = elementName[bracketIdx + 1];
    }

    if (isArray) {
        // TODO: fix type of contained elements within table
        result.type = elementName;
        return result;
    } else {
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
                }

                result.type = properties[key].type;
                return result;
            }
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

function getUIElement(displayName, path, type, value) {
    var data = {
        "displayname": displayName,
        "id": path,
        "value": value,
        "type": type.type,
        //
        "options": type.enum,
        "isOpen": false,
        "alerts": []
    };
    return data;
}

function buildTableUIElement(element, type, totalItems) {
    var pagingOptions = {
        pageNumber: 1,
        pageSize: 5,
        sort: null
    };
    var uiElement = getUIElement(element.displayname, element.path, type, element.value);
    uiElement.tableOptions = {
        "pagingOptions": pagingOptions,
        "columns": element.columns,
        "gridOptions": {
            elementPath: element.path,
            enablePaging: true,
            enableColumnResizing: true,
            enableAutoResize: true,
            pagingPageSizes: [5, 10],
            pagingPageSize: 5,
            columnDefs: [{
                field: element.idLabel.toLowerCase(),
                cellTemplate: '<a href="#<<TYPE>>/{{row.entity.id}}">{{row.entity[col.field]}}</a>'
            }],
            data: [],
            useExternalPaging: true,
            enableFiltering: element.options.hasOwnProperty("enableFiltering") ? element.options["enableFiltering"] : true,
            useExternalFiltering: true,
            minRowsToShow: pagingOptions.pageSize + 1,
            totalItems: totalItems
        }
    };


    // push all columns defined in the view model
    for (var j = 0; j < element.columns.length; j++) {

        if (element.idLabel.toLowerCase() !== element.columns[j].path){
            uiElement.tableOptions.gridOptions.columnDefs.push({
                field: element.columns[j].path
            });
        }
    }

    var firstColumnDef = uiElement.tableOptions.gridOptions.columnDefs[0];
    console.log(element.endPoint);
    firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", element.endPoint);

    return uiElement;
}
