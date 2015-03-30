
var app = angular.module('jsonForms.data.endpoint', []);

var testUrl = "http://localhost:9000/";
var userMapping = {
    "user": {
        single: "user/",
        many: "user",
        "size": testUrl + "user/count",
        "pagination": {
            url: testUrl + "user/search",
            paramNames: {
                pageNr: "page",
                pageSize: "pageSize"
            },
            // TODO: these should be put somewhere elese
            defaultPageSize: 5,
            defaultPage: 1,
            defaultPageSizes: [5, 10]
        },
        "filtering": {
            url: testUrl + "user/search" //?userId={{id}}"
        }
    },
    "task": {
        "single": "task/",
        "many": "task",
        "pagination": {
            url: testUrl + "task/search?userId={{id}}", // TODO: userId
            paramNames: {
                pageNr: "page",
                pageSize: "pageSize"
            },
            // TODO: these should be put somewhere elese
            defaultPageSize: 5,
            defaultPage: 1,
            defaultPageSizes: [5, 10]
        }
    }
};

var ResolverType = Object.freeze({"local": 1, "remote": 2});

var resolverMapping = {
    // TODO: the actual type should be user and not array
    "user": {
        "tasks": {
            kind: ResolverType.remote,
            type: "task"
        }
    }
};

app.factory('EndpointMapping', ['$http', '$q',
    function($http, $q) {

        var mergeObjects = function(obj1, obj2) {
            var obj3 = {};
            for (var attr1 in obj1) { obj3[attr1] = obj1[attr1] }
            for (var attr2 in obj2) { obj3[attr2] = obj2[attr2] }
            return obj3;
        };

        return {
            resolverKind: function(schemaType, attribute) {
                return resolverMapping[schemaType][attribute];
            },
            map: function(schemaType) {

                var mapping = userMapping[schemaType];

                return mergeObjects(mapping, {
                    isPaginationEnabled: function() {
                        return mapping.pagination !== undefined;
                    },
                    isFilteringEnabled: function() {
                        return mapping.filtering !== undefined;
                    },
                    page: function(currentPage, pageSize) {
                        var paginationUrl = mapping.pagination.url;
                        var pageNrParam = mapping.pagination.paramNames.pageNr;
                        var pageSizeParam = mapping.pagination.paramNames.pageSize;
                        var separator = paginationUrl.indexOf("?") > -1 ? "&" : "?";
                        return paginationUrl + separator + pageNrParam + "=" + (currentPage - 1) + "&" + pageSizeParam + "=" + pageSize;
                    },
                    filter: function (searchTerms) {
                        var filterUrl = mapping.filtering.url + "?";
                        var separator = filterUrl.indexOf("?") > -1 ? "&" : "?";
                        for (var i = 0; i < searchTerms.length; i++) {
                            filterUrl += "&" + searchTerms[i].column + "=" + searchTerms[i].term;
                        }
                        return filterUrl;
                    },
                    count: function() {
                        return mapping.size;
                    }
                });
            }
        };
    }
]);