'use strict';

var userDetailSchema = {
    "type": "Control",
    "label": {
        "text": "Name",
        "show": true
    },
    "scope": {
        "$ref": "#/properties/name"
    }
};
var app = angular.module('makeithappen');
var validIds = ['#folder_array','#file_array','#drive_array','#folder_object','#file_object','#drive_object'];

app.run(['UiSchemaRegistry', function(UiSchemaRegistry) {
    UiSchemaRegistry.register(userDetailSchema, function (schema){
        if(validIds.indexOf(schema.id)===-1) return -1;
        return 1;
    });
}]);
angular.module('makeithappen').controller('MasterDetailController',
['masterdetail.schema-array','masterdetail.schema-object','masterdetail.uischema','masterdetail.data-array','masterdetail.data-object',
function(SchemaArray, SchemaObject, UISchema, DataArray, DataObject) {
    var vm = this;
    vm.schemaArray = SchemaArray;

    vm.uiSchema = UISchema;

    vm.dataArray =DataArray;

    vm.dataObject = DataObject;

    vm.schemaObject = SchemaObject;

    vm.formattedData = function(data) {
        return JSON.stringify(data, null, 4);
    };
}]);
