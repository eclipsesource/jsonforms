interface SchemaElement{
    type?: string;
}

interface SchemaObject extends SchemaElement{
    //TODO: specify properties
    properties?: any;
    additionalProperties?: any;
    required?: StringArray;
}

interface SchemaArray extends SchemaElement{
    //TODO: specify items
    items?: any;
}

interface SchemaString extends SchemaElement {
    format?: string
}

// Array type
interface StringArray{
    [index: number]: string;
}
