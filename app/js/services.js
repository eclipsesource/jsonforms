'use strict';

/* Services */
var dataServices = angular.module('jsonForms.dataServices', []);
var utilityServices = angular.module('jsonForms.utilityServices', []);
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

function buildLayoutTree($http, $q, $scope, model, layout, instance, bindings, urlMap, RenderService) {
            var result = [];

            if (layout.elements === undefined) {
                return result;
            }

            for (var i = 0; i < layout.elements.length; i++) {

                var element = layout.elements[i];

                console.log("render service has renderer for " + element.type + ": " + RenderService.hasRendererFor(element));

                if (RenderService.hasRendererFor(element)) {
                    console.log("Custom renderer requested for: " + JSON.stringify(element));
            var renderedElement = RenderService.render(element, model, instance);
            result.push(renderedElement);
            continue;
        }
    }

    return result;
}

