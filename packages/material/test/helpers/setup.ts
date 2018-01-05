import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import { createJsonFormsStore, INIT, JsonForms, JsonFormsStore, JsonSchema, UISchemaElement } from '@jsonforms/core';

export const initJsonFormsStore = (
  data: any,
  schema: JsonSchema,
  uischema: UISchemaElement): JsonFormsStore => {

  const store = createJsonFormsStore({
    common: {
      data
    },
    renderers: JsonForms.renderers,
    fields: JsonForms.fields
  });
  store.dispatch({
    type: INIT,
    data,
    schema,
    uischema
  });

  return store;
};
