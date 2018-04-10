import '../src/ide';
import { JsonEditorIde } from '../src/ide';
import { createEditorStore } from '../src/helpers/util';
import { detailSchemata, imageProvider, labelProvider, modelMapping } from './ecore-config';
import { ecoreSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import {
  annotationView,
  attributeView,
  datatypeView,
  eClassView,
  enumView,
  eOperationView,
  ePackageView,
  eReferenceView
} from './uischema';

window.onload = () => {
  const ide = document.createElement('json-editor-ide') as JsonEditorIde;

  const uischema = {
    'type': 'MasterDetailLayout',
    'scope': '#'
  };

  const store = createEditorStore({}, ecoreSchema, uischema, materialFields, materialRenderers,
                                  imageProvider, labelProvider, modelMapping, detailSchemata);

  ide.store = store;

  document.getElementById('editor').appendChild(ide);
};
