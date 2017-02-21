import { UISchemaElement, ControlElement } from './models/uischema';
import { JsonSchema } from './models/jsonSchema';
import { getValuePropertyPair } from './path.util';

export enum RUNTIME_TYPE {
  VALIDATION_ERROR, VISIBLE, ENABLED
}
export interface RuntimeListener {
  notify(type: RUNTIME_TYPE);
}
export class Runtime {
  private _validationErrors: Array<string> = [];
  private _visible = true;
  private _enabled = true;
  private _listeners: Array<RuntimeListener> = [];

  get visible(): boolean {return this._visible; };
  get enabled(): boolean {return this._enabled; };
  get validationErrors(): Array<string> {return this._validationErrors; };

  set visible(visible: boolean) {
    this._visible = visible;
    this.notifyListeners(RUNTIME_TYPE.VISIBLE);
  };

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this.notifyListeners(RUNTIME_TYPE.ENABLED);
  };

  set validationErrors(validationErrors: Array<string>) {
    this._validationErrors = validationErrors;
    this.notifyListeners(RUNTIME_TYPE.VALIDATION_ERROR);
  };

  addListener(listener: RuntimeListener): void {
    this._listeners.push(listener);
  }

  removeListener(listener: RuntimeListener): void {
    this._listeners.splice(this._listeners.indexOf(listener), 1);
  }

  private notifyListeners(type: RUNTIME_TYPE): void {
    this._listeners.forEach(listener => listener.notify(type));
  }
}

export abstract class Renderer extends HTMLElement implements RuntimeListener {
  protected uischema: UISchemaElement;
  protected dataService: DataService;
  protected dataSchema: JsonSchema;
  setUiSchema(uischema: UISchemaElement) {
    this.uischema = uischema;
  }

  setDataService(dataService: DataService) {
    this.dataService = dataService;
  }

  setDataSchema(dataSchema: JsonSchema) {
    this.dataSchema = dataSchema;
  }

  notify(type: RUNTIME_TYPE): void {
    //
  }

  connectedCallback(): void {
    if (!this.uischema.hasOwnProperty('runtime')) {
      const runtime = new Runtime();
      this.uischema['runtime'] = runtime;
    }
    const runtime = <Runtime>this.uischema['runtime'];
    runtime.addListener(this);
    this.render();
  }
  disconnectedCallback(): void {
    this.dispose();
    const runtime = <Runtime>this.uischema['runtime'];
    runtime.removeListener(this);
  }

  protected abstract render(): void;
  protected abstract dispose(): void;
}
export interface RendererTester {
    (element: UISchemaElement, schema: JsonSchema): number;
}
class RendererService {
  private renderers= [];
  registerRenderer(tester, renderer: string): void {
    this.renderers.push({tester: tester, renderer: renderer});
  }
  getBestRenderer(uischema: UISchemaElement,
                  schema: JsonSchema,
                  dataService: DataService): HTMLElement {
    let bestRenderer: string;
    let specificity = -1;
    this.renderers.forEach(renderer => {
      const rSpec = renderer.tester(uischema, schema);
      if (rSpec > specificity) {
        bestRenderer = renderer.renderer;
        specificity = rSpec;
      }
    });
    let renderer: HTMLElement;
    if (bestRenderer === undefined) {
      renderer =  document.createElement('label');
      renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uischema);
    } else {
      const cRenderer = <Renderer> document.createElement(bestRenderer);
      cRenderer.setUiSchema(uischema);
      cRenderer.setDataSchema(schema);
      cRenderer.setDataService(dataService);
      renderer = cRenderer;
    }
    return renderer;
  }
}

export interface DataChangeListener {
  isRelevantKey: (uischema: ControlElement) => boolean;
  notifyChange(uischema: ControlElement, newValue: any, data: any): void;
}
export class DataService {
  private changeListeners: Array<DataChangeListener>= [];
  constructor(private data: any) {
  }
  notifyChange(uischema: ControlElement, newValue: any): void {
    const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
    pair.instance[pair.property] = newValue;
    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(uischema)) {
        listener.notifyChange(uischema, newValue, this.data);
      }
    });
  }
  registerChangeListener(listener: DataChangeListener): void {
    this.changeListeners.push(listener);
  }
  unregisterChangeListener(listener: DataChangeListener): void {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }
  getValue(uischema: ControlElement): any {
    const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
    return pair.instance[pair.property];
  }
  initialRootRun(): void {
    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(null)) {
        listener.notifyChange(null, null, this.data);
      }
    });
  }
}

export interface JsonFormService {
  dispose(): void;
  schemaChanged(dataSchema: JsonSchema);
}
interface JsonFormsServiceConstructable {
  new(dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement): JsonFormService;
}
export const JsonFormsServiceElement = (config) => (cls: JsonFormsServiceConstructable) => {
  JsonFormsHolder.jsonFormsServices.push(cls);
};
export class JsonFormsHolder {
  public static rendererService = new RendererService();
  public static jsonFormsServices: Array<JsonFormsServiceConstructable> = [];
}
