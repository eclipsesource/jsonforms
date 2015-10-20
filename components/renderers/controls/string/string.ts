///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="string-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new StringRenderer());
}]);
