angular.module('makeithappen').controller('PlaceholderController', ['$resource', '$routeParams', function($resource, $routeParams) {

    var vm = this;

    //
    // Posts --
    //

    vm.postsSchema = {
        "type": "object",
        "definitions": {
            "post": {
                "type": "object",
                "properties": {
                    "userId": {"type": "number"},
                    "id":    {"type": "number"},
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

    vm.postsSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "userId": { "type": "number" },
                "id":     { "type": "number" },
                "title":  { "type": "string" },
                "body":   { "type": "string" }
            }
        }
    };

    vm.postSchema = vm.postsSchema.items;

    vm.postsUiSchema = {
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
        ],
        "options": {
            enableFiltering: true,
            // will cause IDataProvider#filter to be called
            useExternalFiltering: true,
            pageSizes: [5,10]
        }
    };

    //
    // Users --
    //

    vm.userUiSchema = {
        "type": "VerticalLayout",
        "elements": [{
            "type": "Control",
            "scope": { "$ref": "#/properties/name" }
        }]
    };

    vm.usersUiSchema = {
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

    vm.usersSchema = {
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

    vm.userSchema = vm.usersSchema.items;

    //
    // Comments --
    //
    vm.commentUiSchema = {
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

    vm.commentsUiSchema = {
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

    vm.commentsSchema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "postId": {"type": "number"},
                "id":     {"type": "number"},
                "name":   {"type": "string"},
                "email":  {"type": "string"},
                "body":   {"type": "string"}
            }
        }
    };

    vm.commentSchema = vm.commentsSchema.items;

    //
    // Resources --
    //

    var Posts = $resource('http://localhost:3000/posts/:id');
    var Users = $resource('http://localhost:3000/users/:id');
    var Comments = $resource('http://localhost:3000/comments/:id');

    vm.id = $routeParams.id;

    function createDataProvider(toQuery) {
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
                return toQuery.query({_start: start, _end: end}, function (response) {
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
            },
            filter: function(terms) {
                var that = this;
                return toQuery.query(terms, function(response) {
                    that.data = response;
                }, function(error) {
                    console.log("error occurred: " + JSON.stringify(error));
                }).$promise;
            }
        };
    }

    vm.CommentDataProvider = createDataProvider(Comments);
    vm.PostsDataProvider = createDataProvider(Posts);
    vm.UserDataProvider = createDataProvider(Users);
    vm.UserDataProvider.setPageSize(5);

}]);

