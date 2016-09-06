import {IUISchemaElement} from '../../uischema';
import {SchemaElement} from '../../jsonschema';
import {Testers, always} from './testers';

export interface RendererService {
    register(directiveName: string,
             tester:  (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean,
             spec: number): void;
    getBestComponent(uiSchemaElement: IUISchemaElement, dataSchema: any, dataObject: any): string;
}

interface RendererDefinition {
    directiveName: string;
    tester:  (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => number;
}

export const NOT_FITTING: number = -1;

class RendererServiceImpl implements RendererService {

    static $inject = ['PathResolver'];
    private renderer: Array<RendererDefinition> = [];

    register(directiveName: string,
             tester: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean,
             spec = 100): void {
        this.renderer.push({directiveName: directiveName, tester: Testers.create(tester, spec)});
    }

    constructor() {
        this.register('norenderer', always, 0);
    }

    getBestComponent(element: IUISchemaElement, dataSchema: any, dataObject: any): string {
        let bestRenderer = _.maxBy(this.renderer, renderer => {
            return renderer.tester(element, dataSchema, dataObject);
        });
        let bestDirective = bestRenderer.directiveName;
        return `<${bestDirective}></${bestDirective}>`;
    }
}

export default angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
