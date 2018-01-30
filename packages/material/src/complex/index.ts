import {
    isArrayObjectControl,
    rankWith,
    registerStartupRenderer,
} from '@jsonforms/core';
import MaterialArrayControlRenderer from './MaterialArrayControlRenderer';

registerStartupRenderer(
    rankWith(3, isArrayObjectControl),
    MaterialArrayControlRenderer
);

export default MaterialArrayControlRenderer;
