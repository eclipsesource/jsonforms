///<reference path="../../../references.ts"/>

class ArrayRenderer implements JSONForms.IRenderer {

    protected maxSize = 99;
    priority = 99;

    constructor(private renderService: JSONForms.IRenderService, private pathResolver: JSONForms.IPathResolver) { }

    protected static createGroup(elements: IUISchemaElement[]): IGroup {
        return {
            "type": "Group",
            "elements": elements
        };
    }

    protected static createControl(schemaPath: string, prop: string): IControlObject {
        return {
            "type": "Control",
            "label": JSONForms.PathUtil.beautify(prop),
            "scope": {
                "$ref": schemaPath
            }
        }
    }

    protected createControlGroupPerItem(schemaPath: string, items: any, dataLength: number): IGroup[] {
        return _.range(0, dataLength).map(index => {
            let elements = _.keys(items['properties']).map(key =>
                // path does not actually exists
                ArrayRenderer.createControl(`${schemaPath}/items/${index}/properties/${key}`, key)
            );
            return ArrayRenderer.createGroup(elements);
        });
    }

    protected createControlsForSubmit(items: any, schemaPath: string, submitElement: any, services: JSONForms.Services) {
        let unboundControls = _.keys(items['properties']).map(prop =>
            ArrayRenderer.createControl(`${schemaPath}/items/properties/${prop}`, prop)
        );
        let renderDescriptionsForSubmit = JSONForms.RenderDescriptionFactory.renderElements(unboundControls, this.renderService, services);
        return renderDescriptionsForSubmit.map(renderDescription => {
            renderDescription['instance'] = submitElement;
            renderDescription['path'] = JSONForms.PathUtil.lastFragment(renderDescription['path']);
            return renderDescription;
        });
    }

    protected generateControlDescriptions(items: any, schemaPath: string, currentDescriptions: JSONForms.IRenderDescription[], dataSize: number, services: JSONForms.Services) {
        // TODO: this won't work for replace
        // is there a better way to accomplish this?
        if (currentDescriptions.length === dataSize) {
            return currentDescriptions;
        }
        currentDescriptions.splice(0, currentDescriptions.length);
        let controlGroups = this.createControlGroupPerItem(schemaPath, items, dataSize);
        let renderDescriptions = JSONForms.RenderDescriptionFactory.renderElements(controlGroups, this.renderService, services);

        return renderDescriptions.reduce((descriptions, renderDescription) => {
                let foundRenderDesc = _.find(descriptions, desc => _.isEqual(renderDescription, desc));
                if (foundRenderDesc === undefined) {
                    descriptions.push(renderDescription);
                }
                return descriptions;
            }, currentDescriptions);
    }

    render(element: IArrayControlObject, subSchema: SchemaArray, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        let data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();

        if (!Array.isArray(data)) {
            data = this.pathResolver.resolveInstance(data, schemaPath);
        }

        let resolvedSubSchema = this.pathResolver.resolveSchema(subSchema, schemaPath) as SchemaArray;
        let items = resolvedSubSchema.items;
        // TODO: generate label form schema path if not present
        let label = element.label ? element.label : JSONForms.PathUtil.beautifiedLastFragment(schemaPath);

        // TODO: think about how to access options in an uniform fashion
        if (element.options != undefined && element.options['simple']) {
            let controlDescription = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
            let properties = _.keys(items['properties']);
            let propertiesString = JSON.stringify(properties);
            controlDescription.template = `<jsonforms-layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <div ng-repeat='d in element.instance[element.path]'>
                    <div ng-repeat='prop in ${propertiesString}'>
                    <strong>{{prop | capitalize}}:</strong> {{d[prop]}}
                    </div>
                    <hr ng-show="!$last">
                </div>
               </fieldset>
             </jsonforms-layout>`;
            return controlDescription;
        } else {
            let submitElement = {};
            let supportsSubmit = element.options != undefined && element.options['submit'];
            let generatedGroups = this.createControlGroupPerItem(schemaPath, items, data.length);
            let buttonText = JSONForms.PathUtil.beautifiedLastFragment(schemaPath);

            let template = `
            <jsonforms-layout class="jsf-group">
              <fieldset>
                <legend>${label}</legend>
                <div ng-repeat="renderDescription in element.generateControlDescriptions(element.instance[element.path]) ">
                  <jsonforms-dynamic-widget element="renderDescription">
                  </jsonforms-dynamic-widget>
                </div>
                  <jsonforms-dynamic-widget ng-repeat="submitRenderDescription in element.submitControls" element="submitRenderDescription">
                  </jsonforms-dynamic-widget>
               </fieldset>
               <input ng-show="${supportsSubmit}" type="button" value="Add to ${buttonText}" ng-click="element.submitCallback()" ng-model="element.submitElement">
               </input>
             </jsonforms-layout>`;

            let containeeDescriptions = JSONForms.RenderDescriptionFactory.renderElements(generatedGroups, this.renderService, services);
            let containerDescription = JSONForms.RenderDescriptionFactory.createContainerDescription(this.maxSize, containeeDescriptions, template, services, element);
            if (supportsSubmit) {
                containerDescription['submitElement'] = submitElement;
                containerDescription['submitControls'] = this.createControlsForSubmit(items, schemaPath, submitElement, services);
                containerDescription['submitCallback'] = () => data.push(_.clone(submitElement));
            }
            containerDescription['generateControlDescriptions'] = (data) =>
                this.generateControlDescriptions(items, schemaPath, containerDescription['elements'], data.length, services);
            return containerDescription;
        }
    }

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema !== undefined && subSchema.type == 'array';
    }
}

angular.module('jsonforms.renderers.controls.array').run(['RenderService', 'PathResolver', (RenderService, PathResolver) => {
    RenderService.register(new ArrayRenderer(RenderService, PathResolver));
}]);
