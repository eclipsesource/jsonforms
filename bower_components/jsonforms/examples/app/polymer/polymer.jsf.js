function polymerDirective(){
    return {
        restrict : "E",
        //replace= true;
        template :
        '<div class="panel panel-default">' +
           '<paper-input type="text" value="{{vm.modelValue[vm.fragment]}}" data-jsonforms-model label="Last name goes here"></paper-input>' +
        '</div>',
        controller : polymerController,
        controllerAs : 'vm',
        // set-up event binding
        document.addEventListener('WebComponentsReady', function() {
            var input = document.querySelector('paper-input');
            if (input) {
                input.addEventListener('keyup', function () {
                    vm.modelValue[vm.fragment] = input.value;
                    $rootScope.$digest();
                });
            }
        });
    };
}
function polymerControlRendererTester (element, dataSchema, dataObject,pathResolver ){
    if(element.type!='Control')
        return -1;
    let schemaPath=element['scope']['$ref'];
    if(schemaPath != undefined && schemaPath.endsWith("lastName"))
        return 100;
    return -1;
}
let polymerController=['$scope','PathResolver','$rootScope', function ($scope,refResolver,$rootScope) {
    var vm = this;
    vm.fragment=refResolver.lastFragment($scope.uiSchema.scope.$ref);
    vm.modelValue=refResolver.resolveToLastModel($scope.data,$scope.uiSchema.scope.$ref);


}];

var app = angular.module('makeithappen');
app.directive('polymerControl', polymerDirective)
app.run(['RendererService', function(RendererService) {
    RendererService.register("polymer-control",polymerControlRendererTester);
}]);

/*
app.run(['RenderService', 'PathResolver', '$rootScope', function(RenderService, PathResolver, $rootScope) {

    function PolymerControl() {

        var instance;
        var path;

        // set-up event binding
        document.addEventListener('WebComponentsReady', function() {
            var input = document.querySelector('paper-input');
            if (input) {
                input.addEventListener('keyup', function () {
                    instance[path] = input.value;
                    $rootScope.$digest();
                });
            }
        });

        return {
            priority: 100,
            render: function(element, schema, schemaPath, services) {
                var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
                var data = services.get(JSONForms.ServiceId.DataProvider).getData();
                path = PathResolver.toInstancePath(schemaPath);
                instance = data;
                control['template'] =
                 '<div class="panel panel-default">' +
                    '<paper-input type="text" value="{{element.instance[\'' + path + '\']}}" data-jsonforms-model label="Last name goes here"></paper-input>' +
                 '</div>';
                return control;
            },

            isApplicable: function (element, subSchema, schemaPath) {
                return element.type == "Control" && schemaPath != undefined && schemaPath.endsWith("lastName");
            }
        }
    }

    RenderService.register(new PolymerControl());
}]);
*/
