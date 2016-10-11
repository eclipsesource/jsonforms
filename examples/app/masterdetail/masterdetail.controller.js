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
    vm.schemaArray = {
        "definitions": {
            "folder": {
              "type": "object",
              "id": "#folder_array",
              "properties": {
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
                "id": "#file_array",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 3
                    }
                },
                "required": ["name"]
            },
            "drive": {
                "type": "object",
                "id": "#drive_array",
                "properties": {
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
                "required": ["name"]
            }
        },
        "type":"array",
        "id": "drives#",
        "items":
        {
            "$ref": "#/definitions/drive"
        }
    };
    vm.uiSchema = {
        "type":"MasterDetailLayout",
        "scope": {
            "$ref": "#"
        },
        "options":{
            "labelProvider":{
              "#drive_array":"name",
              "#folder_array":"name",
              "#file_array":"name",
              "#drive_object":"name",
              "#folder_object":"name",
              "#file_object":"name"
              },
            "imageProvider":{
              "#folder_array":"app/masterdetail/icons/folder.png",
              "#file_array":"app/masterdetail/icons/page.png",
              "#drive_array":"app/masterdetail/icons/drive.png",
              "#folder_object":"app/masterdetail/icons/folder.png",
              "#file_object":"app/masterdetail/icons/page.png",
              "#drive_object":"app/masterdetail/icons/drive.png"
            }
        }
    };

    vm.dataArray =[
        {
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
        },
        {
            "name":"d",
            "folders":
            [
                {
                    name: 'o',
                    folders:[
                        {name: 'oo'},
                        {name: 'op'}
                    ]
                },
                {
                    name: 'p'
                }
            ],
            "files":
            [
                {
                    name: 'i',
                },
                {
                    name: 'k',
                }
            ]
        }
    ];

    vm.dataObject = {
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

    vm.schemaObject = {
        "definitions": {
            "folder": {
              "type": "object",
              "id": "#folder_object",
              "properties": {
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
                "id": "#file_object",
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 3
                    }
                },
                "required": ["name"]
            }
        },
        "type": "object",
        "id": "drive_object#",
        "properties": {
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
        "required": ["name"]
    };

    vm.formattedData = function(data) {
        return JSON.stringify(data, null, 4);
    };
});
