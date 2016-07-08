export interface SchemaElement {
    type?: string;
    enum?: SchemaElement[];
}

export interface SchemaObject extends SchemaElement {
    // TODO: specify properties
    properties?: any;
    additionalProperties?: any;
    required?: StringArray;
}

export interface SchemaArray extends SchemaElement {
    // TODO: specify items
    items?: any;
}

export interface SchemaString extends SchemaElement {
    format?: string;
}

// Array type
export interface StringArray {
    [index: number]: string;
}
