import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
import { JsonFormsStore } from '../../src/json-forms';
import { INIT } from '../../src/actions';
import { JsonSchema } from '../../src/models/jsonSchema';
import { UISchemaElement } from '../../src/models/uischema';
import { createJsonFormsStore } from '../../src/store';
import '../../src/renderers/renderers';

export const dispatchInputEvent = (input: HTMLElement) => {
  const evt = new Event('input', {
    'bubbles': true,
    'cancelable': true
  });
  input.dispatchEvent(evt);
};

export const initJsonFormsStore = (
  data: any,
  schema: JsonSchema,
  uischema: UISchemaElement): JsonFormsStore => {

  const store = createJsonFormsStore({
    common: {
      data
    }
  });
  store.dispatch({
    type: INIT,
    data,
    schema,
    uischema
  });

  return store;
};
