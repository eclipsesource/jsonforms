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
            },
            "drive": {
                "type": "object",
                "properties": {
                    "id": "drive",
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
            "labelProvider":{"drive":"name","folder":"name","file":"name"},
            "imageProvider":{"folder":"app/masterdetail/icons/folder.png","file":"app/masterdetail/icons/page.png","drive":"app/masterdetail/icons/drive.png"}
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
            "id": "drive",
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
