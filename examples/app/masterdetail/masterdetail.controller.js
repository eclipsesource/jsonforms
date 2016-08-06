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

app.run(['UiSchemaRegistry', function(UiSchemaRegistry) {
    UiSchemaRegistry.register(userDetailSchema, function (schema){
        if(schema.properties.name===undefined) return -1;
        return 1;
    });
}]);
angular.module('makeithappen').controller('MasterDetailController', function() {
    var vm = this;
    vm.schema = {
        "definitions": {
            "folder": {
              "type": "object",
              "properties": {
                  "id": "folder",
                  "name": {
                      "type": "string",
                      "minLength": 3
                  },
                  "folders": {
                      "type":"array",
                      "items":
                      {
                          //TODO make recursive
                          "$ref": "#/definitions/file"
                      }
                  },
                  "files": {
                      "type":"array",
                      "items":
                      {
                          "$ref": "#/definitions/file"
                      }
                  }
              },
              "required": ["name"]
            },
            "file": {
                "type": "object",
                "properties": {
                    "id": "file",
                    "name": {
                        "type": "string",
                        "minLength": 3
                    }
                },
                "required": ["name"]
            }
        },
        "type": "object",
        "properties": {
            "id": "disk",
            "name": {
                "type": "string",
                "minLength": 3
            },
            "folders": {
                "type":"array",
                "items":
                {
                    "$ref": "#/definitions/folder"
                }
            },
            "files": {
                "type":"array",
                "items":
                {
                    "$ref": "#/definitions/file"
                }
            }
        },
        "required": ["occupation", "nationality"]
    };
    vm.uiSchema = {
        "type":"MasterDetailLayout",
        "scope": {
            "$ref": "#"
        },
        "options":{
            "labelProvider":{"disk":"name","folder":"name","file":"name"},
            "imageProvider":{"folder":"app/masterdetail/icons/folder.png","file":"app/masterdetail/icons/page.png"}
        }
    };

    vm.data ={
        "name":"c",
        "folders":
        [
            {
                name: 'a',
                folders:[
                    {name: 'aa'},
                    {name: 'ab'}
                ]
            },
            {
                name: 'b'
            }
        ],
        "files":
        [
            {
                name: 'x',
            },
            {
                name: 'y',
            }
        ]
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.data, null, 4);
    };
});
