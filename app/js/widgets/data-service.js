
var app = angular.module('jsonForms.data', []);

app.factory('GetData', ['$http', '$q',
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