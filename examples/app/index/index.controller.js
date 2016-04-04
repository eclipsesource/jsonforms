'use strict';

angular.module('makeithappen').controller('IndexController', function($scope, $location) {

    var vm = this;
    vm.isActive = function(fragment) {
        if (fragment == $location.path()) {
            return 'active';
        } else {
            return 'inactive';
        }
    }
});