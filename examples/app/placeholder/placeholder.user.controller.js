angular.module('makeithappen')
    .controller('PlaceholderUserController',
        ['$resource', '$routeParams',
            function($resource, $routeParams) {
                var vm = this;
                
                vm.userUiSchema = {
                    "type": "VerticalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": { "$ref": "#/properties/firstName" }
                        },
                        {
                            "type": "Control",
                            "scope": { "$ref": "#/properties/lastName" }
                        },
                        {
                            "type": "Control",
                            "scope": { "$ref": "#/properties/nationality" }
                        }
                    ]
                };
                vm.usersUiSchema = {
                    "type": "Control",
                    "scope": { "$ref": "#/" },
                    "options": {
                        "submit": false
                    }
                };
                vm.usersSchema = {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id":          { "type": "string" },
                            "firstName":   { "type": "string" },
                            "lastName":    { "type": "string" },
                            "nationality": {
                                "type": "string",
                                "enum": ["AR", "DE", "FR", "MEX", "RU"]
                            }
                        }
                    }
                };
                vm.userSchema = vm.usersSchema.items;
                
                vm.id = $routeParams.id;
                vm.alert = {};
                vm.submitElement = {};
                vm.data = [];
                var Users = $resource('http://localhost:3000/users/:id', null, {
                    'update': { method: 'PUT'}
                });
                vm.updateUser = function() {
                    vm.alerts = [];
                    Users.update({id: vm.id}, vm.data, function(response) {
                        vm.alert = {
                            'type': 'alert-success',
                            'msg':  'User updated succesfully'
                        };
                    }, function(error) {
                        vm.alert = {
                            'type': 'alert-error',
                            'msg':  'User updated failed'
                        };
                    });
                };
                vm.createUser = function() {
                    vm.alerts = [];
                    var newUser = new Users(vm.submitElement);
                    newUser.$save(newUser, function(response) {
                        vm.alert = {
                            'type': 'alert-success',
                            'msg':  'User create succesfully'
                        };
                        // fetch all users and reset submit form
                        vm.fetchUsers();
                        vm.submitElement = {};
                    }, function(error) {
                        vm.alert = {
                            'type': 'alert-error',
                            'msg':  'User creation failed'
                        };
                    });
                };
                vm.fetchUsers = function() {
                    if ($routeParams.id) {
                        Users.get({"id": $routeParams['id']}, function (response) {
                            vm.data = response;
                        }, function (error) {
                            vm.alert = {
                                'type': 'alert-error',
                                'msg':  'Could not fetch user with ID ' + $routeParams['id']
                            }
                        })
                    } else {
                        Users.query({}, function (response) {
                            vm.data = response;
                        }, function (error) {
                            vm.alert = {
                                'type': 'alert-error',
                                'msg':  'Could not fetch users'
                            }
                        })
                    }
                };
                vm.fetchUsers();
            }
        ]
    );
