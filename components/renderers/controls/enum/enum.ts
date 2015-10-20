///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="enum-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls']);

app.run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new EnumRenderer(PathResolver));
}]);
