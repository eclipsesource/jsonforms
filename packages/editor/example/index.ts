import '../src/ide';
import { JsonEditorIde } from '../src/ide';
import { createEditorStore } from '../src/helpers/util';
import { imageProvider, labelProvider, modelMapping } from './config';
import { taskSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';

window.onload = () => {
  const ide = document.createElement('json-editor-ide') as JsonEditorIde;

  const uischema = {
    'type': 'MasterDetailLayout',
    'scope': '#'
  };

  const store = createEditorStore({}, taskSchema, uischema, materialFields,
                                  materialRenderers, imageProvider, labelProvider, modelMapping);

  ide.store = store;

  document.getElementById('editor').appendChild(ide);
};
