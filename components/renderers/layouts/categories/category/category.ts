///<reference path="../../../../../typings/angularjs/angular.d.ts"/>
///<reference path="category-renderer.ts"/>

var app = angular.module('jsonforms.renderers.layouts.categories.category', ['jsonforms.renderers.layouts.categories']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new CategoryRenderer(RenderService));
}]);
