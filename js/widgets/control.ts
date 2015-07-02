/// <reference path="../../typings/angularjs/angular.d.ts"/>

var app = angular.module('jsonForms.control', []);

app.run(['RenderService', 'BindingService', 'ReferenceResolver',
    function(RenderService, BindingService, ReferenceResolver) {

        RenderService.register({
            id: "Control",
            render: function (resolvedElement, schema, instance, path) {

                var control = {};
                control["schemaType"] = resolvedElement.scope !== undefined ? resolvedElement.scope.type : "";
                control["bindings"] = instance;
                control["path"] = ReferenceResolver.normalize(ReferenceResolver.get(path));
                control["label"] = resolvedElement.label;
                // TODO: create unique ID?
                control["id"] = path;

                return {
                    "type": "Control",
                    "elements": [control],
                    "size": 99
                };
            }
        });
    }]);