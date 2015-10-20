///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="integer-renderer.ts"/>

var app = angular.module('jsonforms.renderers.controls.integer', ['jsonforms.renderers.controls']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new IntegerRenderer());
}]);
