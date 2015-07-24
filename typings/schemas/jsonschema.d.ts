interface SchemaElement{
    type: string;
}

interface SchemaObject extends SchemaElement{
    //TODO: specify properties
    properties: any;
    additionalProperties?: boolean;
    required?: StringArray;
}

interface SchemaArray extends SchemaElement{
    //TODO: specify items
    items: any;
}

// Array type
interface StringArray{
    [index: number]: string;
}
