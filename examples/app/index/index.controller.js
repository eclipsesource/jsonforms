'use strict';

angular.module('makeithappen').controller('IndexController', function($scope, $location) {

    var vm = this;
    vm.isActive = function(fragment) {
        if ($location.path().indexOf(fragment) > -1) {
            return 'active';
        } else {
            return 'inactive';
        }
    }
});