import {IPathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {IUISchemaElement} from '../../uischema';

export interface RendererService {
    register(directiveName: string, tester: RendererTester): void;
    getBestComponent(uiSchemaElement: IUISchemaElement, dataSchema: any, dataObject: any): string;
}
export interface RendererTester {
    (element: IUISchemaElement,
     dataSchema: any,
     dataObject: any,
     pathResolver: IPathResolver): number;
}
interface RendererDefinition {
    directiveName: string;
    tester: RendererTester;
}

export const NOT_FITTING: number = -1;
const NoRendererTester: RendererTester = function(
        element: IUISchemaElement, dataSchema: any, dataObject: any, pathResolver: IPathResolver ){
    return 0;
};
class RendererServiceImpl implements RendererService {
    static $inject = ['PathResolver'];
    private renderer: Array<RendererDefinition> = [];

    constructor(private pathResolver: IPathResolver) {
        this.renderer.push({directiveName: 'norenderer', tester: NoRendererTester});
    }

    register(directiveName: string, tester: RendererTester): void {
        this.renderer.push({directiveName: directiveName, tester: tester});
    }
    getBestComponent(element: IUISchemaElement, dataSchema: any, dataObject: any): string {
        let bestRenderer = _.maxBy(this.renderer, renderer =>
            renderer.tester(element, dataSchema, dataObject, this.pathResolver)
        );

        let bestDirective = bestRenderer.directiveName;
        return `<${bestDirective}></${bestDirective}>`;
    }
}

export default angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
