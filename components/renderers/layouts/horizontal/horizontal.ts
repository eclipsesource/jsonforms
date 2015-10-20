///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="horizontal-renderer.ts"/>

var app = angular.module('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new HorizontalRenderer(RenderService));
}]);
