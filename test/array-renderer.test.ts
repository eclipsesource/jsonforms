import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import { JsonSchema } from '../src/models/jsonSchema';
import { ControlElement } from '../src/models/uischema';
import { ArrayControlRenderer } from '../src/renderers/additional/array-renderer';
import { DataService } from '../src/core';


test('generate array child control', t => {

    const renderer: ArrayControlRenderer = new ArrayControlRenderer;
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': {'type': 'integer'},
                        'y': {'type': 'integer'}
                    }
                }
            }
        }
    };
    const uiSchema: ControlElement = {
        'label': '',
        'type': 'ArrayControl',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {
        'test': [{
            x: 1,
            y: 3
        }]
    };
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
});
