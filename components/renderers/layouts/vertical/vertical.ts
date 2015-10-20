///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="vertical-renderer.ts"/>

var app = angular.module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new VerticalRenderer(RenderService));
}]);
