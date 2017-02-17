'use strict';

var module = angular.module('listing.listingcontroller',[]);

module.controller('ListingController', function() {
    this.text = "my text";
    var vm = this;
    vm.schema = {
        "type": "object",
        "properties": {
            "n": {
                "type": "number",
                "minimum": 10
            }
        }
    };
    vm.uischema = {
        "type": "Control",
        "scope": {
            "$ref": "#/properties/n"
        }
    };
    vm.data = {
        "n": 15
    };

});