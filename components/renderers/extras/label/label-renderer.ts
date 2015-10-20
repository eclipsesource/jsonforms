///<reference path="../../../../typings/schemas/uischema.d.ts"/>
///<reference path="../../renderers.d.ts"/>
///<reference path="../../renderers-service.ts"/>
///<reference path="../../../pathresolver/pathresolver.d.ts"/>

class LabelRenderer implements JSONForms.IRenderer {

    priority = 1;

    render(element:IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var text = element['text'];
        var size = 99;

        return {
            "type": "Widget",
            "size": size,
            "template": ` <widget><div class="jsf-label">${text}</div></widget>`
        };
    }

    isApplicable(element:IUISchemaElement):boolean {
        return element.type == "Label";
    }

}
