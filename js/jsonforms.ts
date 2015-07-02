
module jsonforms {
    export interface UISchemaElement {
        id: string
    }

    export class Control implements UISchemaElement {
        id:string = 'Control';
        path:String;
        label:String;

        constructor(label:String, path:String) {
            this.label = label;
            this.path = path;
        }
    }

    export class Label implements UISchemaElement {
        id:string = 'Label';
        text:string;

        constructor(text:string) {
            this.text = text;
        }
    }

    export interface ISchemaElementContainer extends UISchemaElement {
        elements: Array<UISchemaElement>
    }

// TODO: type the path of control?
//export interface UISchemaControl extends UISchemaElement {
//    scope: JSONPointer
//}

    export class Json {
        public static from(json):UISchemaElement {
            if (json.hasOwnProperty('elements')) {
                var elements = json['elements'];
                console.log("has elements!!" + elements);
                var children = elements.map(function (el) {
                    return Json.from(el);
                });
                if (json['type'] == 'HorizontalLayout') {
                    var h = new HorizontalLayout(children);
                    console.log(h);
                    return h;
                } else if (json['type'] === 'VerticalLayout') {
                    return new VerticalLayout(children);
                }
            } else if (json.hasOwnProperty('scope')) {
                if (json['type'] === 'Control') {
                    return new Control(json['label'], json['scope']['$ref']);
                }
            }

            console.log("unmatched " + JSON.stringify((json)));

            return new Label(json['text']);
        }
    }

    export class HorizontalLayout implements ISchemaElementContainer {
        id:string = 'HorizontalLayout';
        elements:Array<UISchemaElement>;

        constructor(elements:Array<UISchemaElement>) {
            this.elements = elements;
        }
    }

    export class VerticalLayout implements ISchemaElementContainer {
        id:string = 'VerticalLayout';
        elements:Array<UISchemaElement>;

        constructor(elements:Array<UISchemaElement>) {
            this.elements = elements;
        }
    }


    export class JSONPointer {
        fragments:Array<String>;

        constructor(path:String) {
            this.fragments = path.split("/");
        }
    }


    interface UIElement {
        elements(): Array<UIElement>
        size(): Number
    }
}
