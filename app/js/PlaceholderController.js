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
                    "url": "/placeholder-posts",
                    "label": "Post"
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

    $scope.id = $routeParams.id;

    var createDataProvider = function(toQuery) {
        return {
            page: 0,
            pageSize: 10,
            data: [],
            getData: function () {
                return this.data;
            },
            getPage: function () {
                return this.page;
            },
            getPageSize: function () {
                return this.pageSize;
            },
            setPageSize: function (size) {
                this.pageSize = size;
            },
            getId: function () {
                return 1;
            },
            getTotalItems: function () {
                return this.data.length;
            },
            fetchPage: function (page, size) {
                var start = (page - 1) * this.pageSize;
                var end = start + this.pageSize;
                var that = this;
                return Comments.query({_start: start, _end: end}, function (response) {
                    that.data = response;
                }).$promise;
            },
            fetchData: function () {
                var that = this;
                if ($routeParams.id) {
                    return toQuery.get({"id": $routeParams['id']}, function (response) {
                        that.data = response;
                    }, function (error) {
                        console.log("error occurred: " + JSON.stringify(error));
                    }).$promise;
                } else {
                    return toQuery.query({}, function (response) {
                        that.data = response;
                    }, function (error) {
                        console.log("error occurred: " + JSON.stringify(error));
                    }).$promise;
                }
            }
        };
    };

    $scope.CommentDataProvider = createDataProvider(Comments);
    $scope.PostsDataProvider = createDataProvider(Posts);
    $scope.UserDataProvider = createDataProvider(Users);
    $scope.UserDataProvider.setPageSize(5);

}]);

