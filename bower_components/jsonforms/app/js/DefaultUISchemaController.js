angular.module('makeithappen').controller('DefaultUISchemaController', ['$scope', function($scope) {

    $scope.schema = {
        "type": "object",
        "properties": {
            "id": "user.json",
            "name": {
                "type": "string"
            },
            "age": {
                "type": "integer"
            }
        }
    };

    $scope.uiSchema = undefined;

    $scope.data = {
        name: 'John Doe',
        age: 36
    };

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);