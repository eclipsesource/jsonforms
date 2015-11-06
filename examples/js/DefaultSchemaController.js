angular.module('makeithappen').controller('DefaultSchemaController', ['$scope', function($scope) {

    $scope.schema = undefined;

    $scope.uiSchema = undefined;

    $scope.data = {
        name: 'John Doe',
        age: 36
    };
    $scope.users = [
        $scope.data,
        {
            name: 'Todd',
            age: 33
        },
        {
            name: 'Jimmy',
            age: 34
        }
    ];

    $scope.formattedData = function() {
        return JSON.stringify($scope.data, null, 4);
    };
}]);