'use strict';

/* Controllers */

var qbFormsControllers = angular.module('jsonForms.controllers', []);

qbFormsControllers
    .controller('FormCtrlLocal', ['$scope', 'GetData', 'BindingService', 'RenderService', 'SendData', '$routeParams',
        function($scope, Data, BindingService, RenderService, SendData, $routeParams) {

            $scope.localModelDefault = JSON.stringify(getDefaultModelObject(), undefined, 2);
            $scope.localViewDefault = JSON.stringify(getDefaultViewObject(), undefined, 2);
            if($scope.localModel === undefined){
                $scope.localModel = $scope.localModelDefault;
            }
            if($scope.localView === undefined){
                $scope.localView= $scope.localViewDefault;
            }

            $scope.reparse = function() {
                var localModelObject = JSON.parse($scope.localModel);
                var localViewObject = JSON.parse($scope.localView);

                $scope.localModel = JSON.stringify(localModelObject, undefined, 2);
                $scope.localView = JSON.stringify(localViewObject, undefined, 2);

                replaceRefLinks(localViewObject);

                var mergedData = RenderService.renderAll(localModelObject, localViewObject, undefined);

                $scope.elements = mergedData;
                $scope.id = mergedData.id;

                $scope.opened = false;
            };

            $scope.openDate = function($event, element) {
                $event.preventDefault();
                $event.stopPropagation();

                element.isOpen = true;
            };

            $scope.sendData = function() {
                var data = {};

                var bindingsKeys = Object.keys($scope.bindings);

                for (var i = 0; i < bindingsKeys.length; i++) {
                    var key = bindingsKeys[i];
                    if($scope.bindings[key] != null){
                        data[key] = $scope.bindings[key];
                    }
                }

                SendData.sendData($routeParams.type, $scope.id, data);
            };

            $scope.validateNumber = function(value, element) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };

            $scope.validateInteger = function(value, element) {
                if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid integer!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };
        }
    ]);

var baseUrl = "assets";

qbFormsControllers
    .controller('FormCtrl', ['$scope', 'GetData', 'SendData', 'RenderService', 'BindingService', '$routeParams',
        function($scope, Data, SendData, RenderService, BindingService, $routeParams) {

            // TODO: fix me
            Data.getFormData("http://localhost:9000", $routeParams.type, $routeParams.id, $scope).then(function(data) {
                $scope.elements = RenderService.renderAll(data.ecoreModelData, data.viewModelData, data.rawInstanceData, $scope); //data.layoutTree;
                $scope.id = data.rawInstanceData.id;
                $scope.bindings = BindingService.all();
            });
            $scope.opened = false;


            $scope.openDate = function($event, element) {
                $event.preventDefault();
                $event.stopPropagation();

                element.isOpen = true;
            };

            $scope.sendData = function() {
                var data = {};

                var bindingsKeys = Object.keys($scope.bindings);

                for (var i = 0; i < bindingsKeys.length; i++) {
                    var key = bindingsKeys[i];
                    if($scope.bindings[key] != null){
                        data[key] = $scope.bindings[key];
                    }
                }

                SendData.sendData(baseUrl, $routeParams.type, $scope.id, data);
            };

            $scope.validateNumber = function(value, element) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };

            $scope.validateInteger = function(value, element) {
                if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid integer!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                element.alerts = [];
                return true;
            };
        }
    ]);


qbFormsControllers
    .controller('ListCtrl', ['$scope', 'GetData', '$routeParams',
        function($scope, Data, $routeParams) {
            //Fetch data from service and bind it to elements
            Data.getRawInstanceData(baseUrl, $routeParams.type).then(function(data) {
                $scope.elements = data;
                $scope.type = $routeParams.type;
            });
        }
    ]);


function getDefaultViewObject(){
    return {
        "elements": [
            {
                "type": "QBHorizontalLayout",
                "elements": [
                    {
                        "type": "QBVerticalLayout",
                        "elements": [
                            {
                                "type": "Label",
                                "text": "Personal Data"
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/firstName"},
                                    "name": "First Name"
                                }
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/lastName"},
                                    "name": "Last Name"
                                }
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/dateOfBirth"},
                                    "name": "Date Of Birth"
                                }
                            },
                            {
                                "type": "QBHorizontalLayout",
                                "elements": [
                                    {
                                        "type": "Control",
                                        "feature": {
                                            "path": {$ref: "/user-schema.json#/weight"},
                                            "name": "Weight"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "feature": {
                                            "path": {$ref: "/user-schema.json#/height"},
                                            "name": "Height"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "feature": {
                                            "path": {$ref: "/user-schema.json#/nationality"},
                                            "name": "Nationality"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/gender"},
                                    "name": "Gender"
                                }
                            }
                        ]
                    },
                    {
                        "type": "QBVerticalLayout",
                        "elements": [
                            {
                                "type": "Label",
                                "text": "Site Related Data"
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/timeOfRegistration"},
                                    "name": "Gender"
                                }
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/email"},
                                    "name": "Email"
                                }
                            },
                            {
                                "type": "Control",
                                "feature": {
                                    "path": {$ref: "/user-schema.json#/active"},
                                    "name": "Active"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

function getDefaultModelObject(){
    return {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "format": "objectId"
            },
            "lastName": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "firstName": {
                "type": "string"
            },
            "gender": {
                "type": "string",
                "enum": [
                    "Male",
                    "Female"
                ]
            },
            "active": {
                "type": "boolean"
            },
            "timeOfRegistration": {
                "type": "string",
                "format": "date-time"
            },
            "weight": {
                "type": "number"
            },
            "height": {
                "type": "integer"
            },
            "nationality": {
                "type": "string",
                "enum": [
                    "German",
                    "French",
                    "UK",
                    "US",
                    "Spanish",
                    "Italian",
                    "Russian"
                ]
            },
            "dateOfBirth": {
                "type": "string",
                "format": "date-time"
            }
        },
        "additionalProperties": false,
        "required": [
            "id",
            "lastName",
            "email"
        ]
    };
}

function replaceRefLinks(viewModelObject){
    for (var key in viewModelObject) {
        if (key == "feature") {
            var featureObject = viewModelObject[key];
            var pathObject = featureObject["path"];

            var refString = pathObject["$ref"];
            refString = refString.replace(new RegExp(escapeRegExp("/user-schema.json#/"), 'g'), "");
            featureObject["path"] = refString;

        }else if (viewModelObject[key] !== null && typeof(viewModelObject[key]) === "object"){
            replaceRefLinks(viewModelObject[key]);
        }
    }
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
