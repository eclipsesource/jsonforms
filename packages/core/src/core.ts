/**
 * Global JSONForms object that holds services and registries.
 */
export class JsonFormsGlobal {
  public renderers = [];
  public fields = [];
  public reducers: {[key: string]: any} = {};
}

const JsonForms = new JsonFormsGlobal();
export { JsonForms} ;
