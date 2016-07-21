import angular from 'angular';
const app = angular.module('jsonforms.renderers.controls');

export default function(name, controller, template, tester){
    app.directive(camelize(name), () => {
        return {
            restrict: 'E',
            template: template,
            controller: controller,
            controllerAs: 'vm'
        }
    });
    app.run(['RendererService', function (RendererService) {
        RendererService.register(name, tester);
    }]);
}


function camelize(str) {
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}