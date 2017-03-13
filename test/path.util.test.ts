import test from 'ava';

import { resolveSchema } from '../src/path.util';
import { JsonSchema } from '../src/models/jsonSchema';

test('resolve ', t => {
    const schema: JsonSchema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'integer'
            }
        }
    } as JsonSchema;
    t.deepEqual(resolveSchema(schema, '#/properties/foo'), {
        type: 'integer'
    } as JsonSchema);
});
