import {IPathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {IUISchemaElement} from '../../jsonforms';

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

class RendererServiceImpl implements RendererService {
    static $inject = ['PathResolver'];
    private renderer: Array<RendererDefinition> = [];

    constructor(private pathResolver: IPathResolver) {
    }

    register(directiveName: string, tester: RendererTester): void {
        this.renderer.push({directiveName: directiveName, tester: tester});
    }
    getBestComponent(element: IUISchemaElement, dataSchema: any, dataObject: any): string {
        let bestRenderer = _.maxBy(this.renderer, renderer => {
            let result = renderer.tester(element, dataSchema, dataObject, this.pathResolver);
            return result === NOT_FITTING ? null : result;
        });
        if (bestRenderer == null) {
            return '<!-- No Renderer for ' + element.type + '. -->'
                + '<!-- Full element:' + JSON.stringify(element) + '. -->';
        }
        let bestDirective = bestRenderer.directiveName;
        return `<${bestDirective}></${bestDirective}>`;
    }
}

export default angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
