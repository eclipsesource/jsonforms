import { JsonFormsRendererConstructable } from '../renderers/renderer.util';
import { RankedTester } from '../core/testers';
export declare const rendererReducer: (state: {
    tester: RankedTester;
    renderer: JsonFormsRendererConstructable;
}[], { type, tester, renderer }: {
    type: any;
    tester: any;
    renderer: any;
}) => {
    tester: RankedTester;
    renderer: JsonFormsRendererConstructable;
}[];
