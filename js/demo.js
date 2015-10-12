'use strict';

var app = angular.module('jsonforms-website');
app.directive('preview', ['$compile',function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.refresh);
            },
            function(value) {
                if(element.contents().length!=0)
                element.contents()[0].remove();
                element.append($compile('<jsonforms schema="dynamicDataSchema" ui-schema="dynamicUiSchema" data="dynamicDataProvider.data"/>')(scope));
                scope.refresh=false;
            }
        );
    };
}]);
app.controller('SupportCtrl', function() { });
app.controller('DemoController', ['$scope','StaticData','DynamicData', function($scope,StaticData,DynamicData) {

    $scope.refresh=true;
    $scope.staticDataProvider=StaticData;
    $scope.dynamicDataProvider=DynamicData;

    $scope.localModelDefault = JSON.stringify($scope.dynamicDataProvider.dataSchema, undefined, 2);
    $scope.localViewDefault = JSON.stringify($scope.dynamicDataProvider.uiSchema, undefined, 2);
    if($scope.localModel === undefined){
        $scope.localModel = $scope.localModelDefault;
    }
    if($scope.localView === undefined){
        var localViewObject = JSON.parse($scope.localViewDefault);
        $scope.localView = JSON.stringify(localViewObject, undefined, 2);
    }
    $scope.dynamicDataSchema=JSON.parse($scope.localModel);
    $scope.dynamicUiSchema=JSON.parse($scope.localView);
    $scope.aceLoaded = function(editor) {
        editor.$blockScrolling = Infinity;
        editor.getSession().setMode("ace/mode/javascript");
        editor.setOptions({
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    };
    $scope.reparse = function() {
        var localModelObject = JSON.parse($scope.localModel);
        var localViewObject = JSON.parse($scope.localView);

        $scope.localModel = JSON.stringify(localModelObject, undefined, 2);
        $scope.localView = JSON.stringify(localViewObject, undefined, 2);

        $scope.dynamicDataSchema=JSON.parse($scope.localModel);
        $scope.dynamicUiSchema=JSON.parse($scope.localView);
        $scope.refresh=true;
    };
}]);
