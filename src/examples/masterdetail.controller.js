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
var validIds = ['#folder_array','#file_array','#drive_array','#folder_object','#file_object','#drive_object'];

var module = angular.module('examples.masterdetailcontroller',[]);

module.run(['UiSchemaRegistry', function(UiSchemaRegistry) {
    UiSchemaRegistry.register(userDetailSchema, function (schema){
        if(validIds.indexOf(schema.id)===-1) return -1;
        return 1;
    });
}]);

module
    .controller('MasterDetailController', ['masterdetail.schema-array','masterdetail.schema-object','masterdetail.uischema','masterdetail.data-array','masterdetail.data-object',
function(SchemaArray, SchemaObject, UISchema, DataArray, DataObject) {
    var vm = this;
    vm.schemaArray = SchemaArray;

    vm.uiSchema = UISchema;

    vm.dataArray =DataArray;

    vm.dataObject = DataObject;

    vm.schemaObject = SchemaObject;

    //fix icons:
    vm.uiSchema.options.imageProvider['#folder_array']="images/examples/masterdetail-icons/folder.png";
    vm.uiSchema.options.imageProvider['#file_array']="images/examples/masterdetail-icons/page.png";
    vm.uiSchema.options.imageProvider['#drive_array']="images/examples/masterdetail-icons/drive.png";
    vm.uiSchema.options.imageProvider['#folder_object']="images/examples/masterdetail-icons/folder.png";
    vm.uiSchema.options.imageProvider['#file_object']="images/examples/masterdetail-icons/page.png";
    vm.uiSchema.options.imageProvider['#drive_object']="images/examples/masterdetail-icons/drive.png";
}]);
