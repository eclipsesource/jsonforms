'use strict';

/* Controllers */

var qbFormsControllers = angular.module('qbForms.controllers', []);

qbFormsControllers
    .controller('FormCtrlLocal', ['$scope', 'GetDataLocal', 'SendData', '$routeParams',
        function($scope, Data, SendData, $routeParams) {

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

                var mergedData = Data.getLocalData(localModelObject, localViewObject);

                $scope.elements = mergedData.layoutTree;
                $scope.bindings = mergedData.bindings;
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
    .controller('FormCtrl', ['$scope', 'GetDataRemote', 'SendData', '$routeParams',
        function($scope, Data, SendData, $routeParams) {


                Data.getFormData("", $routeParams.type, $routeParams.id, $scope).then(function(data) {
                    $scope.elements = data.layoutTree;
                    $scope.id = data.id;
                    $scope.bindings = data.bindings;
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
    .controller('ListCtrl', ['$scope', 'GetDataRemote', '$routeParams',
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
                            "path": "firstName",
                            "name": "First Name"
                        },
                        {
                            "type": "Control",
                            "path": "lastName",
                            "name": "Last Name"
                        },
                        {
                            "type": "Control",
                            "path": "dateOfBirth",
                            "name": "Date Of Birth"
                        },
                        {
                            "type": "QBHorizontalLayout",
                            "elements": [
                                {
                                    "type": "Control",
                                    "path": "weight",
                                    "name": "Weight"
                                },
                                {
                                    "type": "Control",
                                    "path": "heigth",
                                    "name": "Heigth"
                                },
                                {
                                    "type": "Control",
                                    "path": "nationality",
                                    "name": "Nationality"
                                }
                            ]
                        },
                        {
                            "type": "Control",
                            "path": "gender",
                            "name": "Gender"
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
                            "path": "timeOfRegistration",
                            "name": "Time Of Registration"
                        },
                        {
                            "type": "Control",
                            "path": "email",
                            "name": "Email"
                        },
                        {
                            "type": "Control",
                            "path": "active",
                            "name": "Active"
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
            "heigth": {
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
