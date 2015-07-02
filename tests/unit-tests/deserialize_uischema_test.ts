/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../js/jsonforms.ts"/>

describe('deerialize JSON UI schema into AST', function() {

    var uiSchema = {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "VerticalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "label": "Name",
                            "scope": {
                                "$ref": "#/properties/name"
                            }
                        }
                    ]
                }
            ]
    };

    it('expect TODO', () => {
        var control: jsonforms.Control;
        var ui: jsonforms.UISchemaElement = jsonforms.Json.from(uiSchema);
        console.log(ui);
        function toContainer(el: jsonforms.UISchemaElement): jsonforms.ISchemaElementContainer {
            return <jsonforms.ISchemaElementContainer> el;
        }
        expect(toContainer(ui).elements.length).toBe(1);
        expect(toContainer(ui).elements[0] instanceof jsonforms.VerticalLayout).toBe(true);

    });
});
