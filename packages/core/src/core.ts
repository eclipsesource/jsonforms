/**
 * Global JSONForms object that holds services and registries.
 */
export class JsonFormsGlobal {
  /**
   * Array of renderers that should be picked up at startup.
   * @type {any[]}
   */
  public renderers = [];

  /**
   * Array of field renderers that should be picked up at startup.
   * @type {any[]}
   */
  public fields = [];
}

const JsonForms = new JsonFormsGlobal();
export { JsonForms} ;
