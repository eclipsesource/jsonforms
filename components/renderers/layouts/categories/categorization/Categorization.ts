///<reference path="../../../../../typings/angularjs/angular.d.ts"/>
///<reference path="categorization-renderer.ts"/>

var app = angular.module('jsonforms.renderers.layouts.categories.categorization', ['jsonforms.renderers.layouts.categories']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new CategorizationRenderer(RenderService));
}]);
