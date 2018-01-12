import { StringMap, ModelMapping } from "./jsoneditor";
import { JsonSchema } from "@jsonforms/core";

export class EditorContext {
    public static DATA = 'data';
    public static DATA_SCHEMA = 'dataSchema';
    public static IDENTIFYING_PROPERTY = 'identifyingProperty';
    public static IMAGE_PROVIDER = 'imageProvider';
    public static LABEL_PROVIDER = 'labelProvider';
    public static MODEL_MAPPING = 'modelMapping';

    private listeners: EditorContextChangeListener[];
    private _data: Object | Object[];
    private _dataSchema: JsonSchema;

    private _identifyingProperty: string;
    private _imageProvider: StringMap;
    private _labelProvider: StringMap;
    private _modelMapping: ModelMapping;

    constructor() {
        this.listeners = [];
    }

    set data(data: Object | Object[]) {
        this._data = data;
        this.notifyChangeListeners(EditorContext.DATA, data);
    }
    get data(): Object | Object[] {
        return this._data;
    }

    set dataSchema(dataSchema: JsonSchema) {
        this._dataSchema = dataSchema;
        this.notifyChangeListeners(EditorContext.DATA_SCHEMA, dataSchema);
    }

    get dataSchema(): JsonSchema {
        return this._dataSchema;
    }

    
    set imageProvider(imageProvider: StringMap) {
        this._imageProvider = imageProvider;
        this.notifyChangeListeners(EditorContext.IMAGE_PROVIDER, imageProvider);
    }
    get imageProvider(): StringMap {
        return this._imageProvider;
    }

    set identifyingProperty(identifyingProperty: string) {
        this._identifyingProperty = identifyingProperty;
        this.notifyChangeListeners(EditorContext.IDENTIFYING_PROPERTY, identifyingProperty);
    }
    get identifyingProperty(): string {
        return this._identifyingProperty;
    }

    set labelProvider(labelProvider: StringMap) {
        this._labelProvider = labelProvider;
        this.notifyChangeListeners(EditorContext.LABEL_PROVIDER, labelProvider);
    }
    get labelProvider() {
        return this._labelProvider;
    }

    set modelMapping(modelMapping: ModelMapping) {
        this._modelMapping = modelMapping;
        this.notifyChangeListeners(EditorContext.MODEL_MAPPING, modelMapping);
        
    }
    get modelMapping(): ModelMapping {
        return this._modelMapping;
    }

    addChangeListener(listener: EditorContextChangeListener) {
        this.listeners.push(listener);
    }

    removeChangeListener(listener: EditorContextChangeListener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    protected notifyChangeListeners(changedProperty: string, newValue: any) {
        this.listeners.forEach(listener => {
            listener.editorContextChanged(changedProperty, newValue);
        });
    }
}

export interface EditorContextChangeListener {
    editorContextChanged(changedProperty: string, newValue: any);
}