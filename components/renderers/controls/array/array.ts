///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="array-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls']);

app.run(['RenderService', 'PathResolver', '$rootScope', function(RenderService, PathResolver, $rootScope) {
    RenderService.register(new ArrayRenderer(PathResolver, $rootScope));
}]);
