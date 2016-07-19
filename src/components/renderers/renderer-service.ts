import {IPathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {IUISchemaElement} from '../../uischema';
import {Testers} from './controls/abstract-control';
import {SchemaElement} from '../../jsonschema';

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

    constructor(private pathResolver: IPathResolver) {
        this.renderer.push({directiveName: 'norenderer', tester: Testers.none});
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
