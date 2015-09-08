
var app = angular.module('jsonForms.data.local', []);

app.factory('GetData', ['$http', '$q', 'DataCommon', 'RenderService',
    function($http, $q, DataCommon, RenderService) {
        return {
            getFormData: function(url, type, id) {
                return DataCommon.getFormData($http, $q, id, {
                    "viewUrl":  "/" + type + "-view.json",
                    "modelUrl": "/" + type + "-model.json",
                    "dataUrl":  "/" + type + "-data.json"
                });
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
            }
            //getLocalData: function(modelData, viewData){
            //    //function handleRawData($http, $q, $scope, ecoreModelData, viewModelData, instanceData, urlMap, RenderService){
            //    return handleRawData($http, $q, undefined, modelData, viewData, undefined, undefined, RenderService);
            //}
        };
    }
]);

