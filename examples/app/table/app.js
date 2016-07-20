import angular from 'angular';
import Schema from './schema';
import UISchema from './ui-schema';
import './table-control/table-control';
import './jsonforms-theme.css';

const app = angular.module('makeithappen');
app.controller('MyTableController', ['$scope', function($scope) {
    $scope.test = "skjdfsldf";
    $scope.schema = Schema;
    $scope.uiSchema = UISchema;
    $scope.data = {
        "people": [{name: "Francisco", age: 22, gender: "Male"}, {name: "Hector", age: 22, gender: "Female"}]
    };
}]);
