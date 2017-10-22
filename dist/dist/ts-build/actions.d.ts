import { ThunkAction } from 'redux-thunk';
import { JsonFormsRendererConstructable } from './renderers/renderer.util';
import { RankedTester } from './core/testers';
export declare const INIT = "INIT";
export declare const UPDATE_DATA = "UPDATE";
export declare const UPDATE_UI = "UPDATE_UI";
export declare const VALIDATE = "VALIDATE";
export declare const SHOW = "SHOW";
export declare const HIDE = "HIDE";
export declare const ENABLE = "ENABLE";
export declare const DISABLE = "DISABLE";
export declare const ADD_RENDERER = "ADD_RENDERER";
export declare const REMOVE_RENDERER = "REMOVE_RENDERER";
export declare const update: (path: string, updater: (any: any) => any) => ThunkAction<void, any, void>;
export declare const validate: () => (dispatch: any, getState: any) => void;
export declare const registerRenderer: (tester: RankedTester, renderer: JsonFormsRendererConstructable) => {
    type: string;
    tester: RankedTester;
    renderer: JsonFormsRendererConstructable;
};
export declare const unregisterRenderer: (tester: RankedTester, renderer: JsonFormsRendererConstructable) => {
    type: string;
    tester: RankedTester;
    renderer: JsonFormsRendererConstructable;
};
