///<reference path="../../../../typings/angularjs/angular.d.ts"/>
///<reference path="label-renderer.ts"/>

var app = angular.module('jsonforms.renderers.extras.label', ['jsonforms.renderers']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new LabelRenderer());
}]);
