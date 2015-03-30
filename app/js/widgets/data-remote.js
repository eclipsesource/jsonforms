
var app = angular.module('jsonForms.data.remote', []);

app.factory('GetData', ['$http', '$q', 'DataCommon',
    function($http, $q, DataCommon) {
        return {
            getFormData: function(url, type, id) {
                return DataCommon.getFormData(url, type, id, {
                    "baseUrl": url,
                    "viewUrl": url + "/" + type + "/view"  + (id === undefined ? "" : "/" + id),
                    "modelUrl": url + "/" + type + "/model",
                    "dataUrl": url + "/" + type
                });
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
