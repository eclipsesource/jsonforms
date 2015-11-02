angular.module('makeithappen').controller('PlaceholderController', ['$scope', '$resource', '$routeParams', function($scope, $resource, $routeParams) {

    //
    // Posts --
    //

    $scope.postsSchema = {
        "type": "object",
        "definitions": {
            "post": {
                "type": "object",
                "properties": {
                    "userId": {"type": "number"},
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "body": {"type": "string"}
                }
            }
        },
        "properties": {
            "posts": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/post"
                }
            },
            "comments": {

            }
        }
    };

    $scope.postsSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "userId": { "type": "number" },
                "id":     { "type": "string" },
                "title":  { "type": "string" },
                "body":   { "type": "string" }
            }
        }
    };

    $scope.postSchema = $scope.postsSchema.items;

    $scope.postsUiSchema = {
        "type": "Control",
        "scope": { "$ref": "#" },
        "columns": [
            {
                "label": "Title",
                "scope": {
                    "$ref": "#/items/properties/title"
                }
            },
            {
                "label": "User",
                "scope": {
                    "$ref": "#/items/properties/userId"
                },
                "href": {
                    "url": "/placeholder-users"
                }
            }
        ]
    };

    //
    // Users --
    //

    $scope.userUiSchema = {
        "type": "VerticalLayout",
        "elements": [{
            "type": "Control",
            "scope": { "$ref": "#/properties/name" }
        }]
    };

    $scope.usersUiSchema = {
        "type": "Control",
        "scope": { "$ref": "#" },
        "columns": [
            {
                "label": "Name",
                "scope": {
                    "$ref": "#/items/properties/name"
                }
            },
            {
                "label": "Username",
                "scope": {
                    "$ref": "#/items/properties/username"
                }
            },
            {
                "label": "Email",
                "scope": {
                    "$ref": "#/items/properties/email"
                },
                "href": {
                    url: "/placeholder-users",
                    scope: {
                        "$ref": '/items/properties/id'
                    }
                }
            }
        ]
    };

    $scope.usersSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "id":       {"type": "number"},
                "name":     {"type": "string"},
                "username": {"type": "string"},
                "email":    {"type": "string"}
            }
        }
    };

    $scope.userSchema = $scope.usersSchema.items;

    //
    // Comments --
    //
    $scope.commentUiSchema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/email" }
            },
            {
                "type": "Control",
                "scope": { "$ref": "#/properties/body" }
            },
            {
                "type": "ReferenceControl",
                "scope": { "$ref": "#/properties/postId" },
                "label": "Navigate to ",
                "href": {
                    "url": "/placeholder-users",
                    "label": "User"
                }
            }
        ]
    };

    $scope.commentsUiSchema = {
        "type": "Control",
        "scope": { "$ref": "#" },
        "columns": [
            {
                "label": "Name",
                "scope": {
                    "$ref": "#/items/properties/name"
                },
                "href": {
                    "url": "/placeholder-comments",
                    "scope": {
                        "$ref": "/items/properties/id"
                    }
                }
            },
            {
                "label": "User",
                "scope": {
                    "$ref": "#/items/properties/email"
                }
            },
            {
                "label": "Body",
                "scope": {
                    "$ref": "#/items/properties/body"
                }
            }
        ]
    };

    $scope.commentsSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "postId": {"type": "number"},
                "id": {"type": "number"},
                "name": {"type": "string"},
                "email": {"type": "string"},
                "body": {"type": "string"}
            }
        }
    };

    $scope.commentSchema = $scope.commentsSchema.items;

    //
    // Resources --
    //

    var Posts = $resource('http://localhost:3000/posts/:id');
    var Users = $resource('http://localhost:3000/users/:id');
    var Comments = $resource('http://localhost:3000/comments/:id');

    $scope.UserDataProvider = {
        // TODO: code duplication, can be factored out together with _start, _end and the $resource
        page: 0,
        pageSize: 5,
        data: [],
        fetchData: function() {
            if ($routeParams.id) {
                return Users.get({"id": $routeParams.id}, function (response) {
                    $scope.UserDataProvider.data = response;
                }).$promise;
            } else {
                return Users.query({}, function(response) {
                    console.log(JSON.stringify(response));
                    $scope.UserDataProvider.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            }
        },
        fetchPage: function(page, size) {
            var start = (page - 1) * this.pageSize;
            var end = start + this.pageSize;
            return Users.query({_start: start, _end: end}, function(response) {
                console.log(JSON.stringify(response));
                $scope.UserDataProvider.data = response;
            }).$promise;
        },
        setPageSize: function(newSize) {
            this.pageSize = newSize;
        }
    };

    $scope.id = $routeParams.id;
    $scope.PostDataProvider = {
        page: 0,
        pageSize: 10,
        data: [],
        fetchData: function() {
            if ($routeParams.id){
                return Posts.get({id: $routeParams.id}, function(response) {
                    $scope.PostDataProvider.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            } else {
                return Posts.query({}, function(response) {
                    $scope.PostDataProvider.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            }
        },
        fetchPage: function(page, size) {
            var start = (page - 1) * this.pageSize;
            var end = start + this.pageSize;
            return Posts.query({_start: start, _end: end}, function(response) {
                $scope.PostDataProvider.data = response;
            }).$promise;
        },
        setPageSize: function(newSize) {
            this.pageSize = newSize;
        }
    };

    $scope.CommentDataProvider = {
        page: 0,
        pageSize: 10,
        data: [],
        fetchData: function() {
            if ($routeParams.id) {
                return Comments.get({"id": $routeParams['id']}, function(response) {
                    $scope.CommentDataProvider.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            } else {
                return Comments.query({}, function(response) {
                    $scope.CommentDataProvider.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            }
        },
        fetchPage: function(page, size) {
            var start = (page - 1) * this.pageSize;
            var end = start + this.pageSize;
            return Comments.query({_start: start, _end: end}, function(response) {
                $scope.CommentDataProvider.data = response;
            }).$promise;
        },
        setPageSize: function(size){
            this.pageSize = size;
        }
    }
}]);
