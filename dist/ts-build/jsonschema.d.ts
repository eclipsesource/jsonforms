export interface SchemaElement {
    type?: string;
    enum?: SchemaElement[];
}
export interface SchemaObject extends SchemaElement {
    properties?: any;
    additionalProperties?: any;
    required?: StringArray;
}
export interface SchemaArray extends SchemaElement {
    items?: any;
}
export interface SchemaString extends SchemaElement {
    format?: string;
}
export interface StringArray {
    [index: number]: string;
}
