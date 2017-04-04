import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import {DataService} from './data.service';
import {Runtime, RUNTIME_TYPE, RuntimeListener} from './runtime';

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

  abstract render(): HTMLElement;
  abstract dispose(): void;
}
