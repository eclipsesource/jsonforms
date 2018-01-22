import {
    isArrayObjectControl,
    rankWith,
    registerStartupRenderer,
} from '@jsonforms/core';
import MaterialArrayControlRenderer from './MaterialArrayControlRenderer';

export default registerStartupRenderer(
    rankWith(3, isArrayObjectControl),
    MaterialArrayControlRenderer
);
