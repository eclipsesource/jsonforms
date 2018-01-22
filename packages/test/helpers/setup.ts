import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import {
  createJsonFormsStore,
  INIT,
  JsonForms,
  JsonFormsStore,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';

export interface JsonFormsState {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  styles?: { name: string, classNames: string[] }[];
}

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     ...props
                                   }: JsonFormsState): JsonFormsStore => {

  const store = createJsonFormsStore({
    common: {
      data,
      schema,
      uischema
    },
    renderers: JsonForms.renderers,
    fields: JsonForms.fields,
    ...props
  });

  store.dispatch({
    type: INIT,
    data,
    schema,
    uischema
  });

  return store;
};
