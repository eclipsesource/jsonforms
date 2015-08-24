/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class HorizontalLayout implements jsonforms.services.IRenderer {

    constructor(private renderServ: jsonforms.services.IRenderService) {

    }

    priority = 1;

    render = (element: ILayout, subSchema: SchemaElement, schemaPath:String, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IContainerResult => {

        var that = this;

        var renderElements = function (elements) {
            if (elements === undefined || elements.length == 0) {
                return [];
            } else {
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderServ.render(curr, dataProvider));
                    return acc;
                }, []);
            }
        };
        // TODO
        var maxSize = 99;

        var renderedElements = renderElements(element.elements);
        var size = renderedElements.length;
        var individualSize = Math.floor(maxSize / size);
        for (var j = 0; j < renderedElements.length; j++) {
            renderedElements[j].size = individualSize;
        }

        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": maxSize,
            "template":
                `<fieldset>
                  <div class="row">
                    <recelement ng-repeat="child in element.elements"
                                element="child"
                                bindings="bindings"
                                top-open-date="topOpenDate"
                                top-validate-number="topValidateNumber"
                                top-validate-integer="topValidateInteger">
                    </recelement>
                  </div>
                </fieldset>`
        };
    };

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == "HorizontalLayout";
    }

}

var app = angular.module('jsonForms.horizontalLayout', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new HorizontalLayout(RenderService));
}]);

