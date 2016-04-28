import {IPathResolver} from '../services/pathresolver/jsonforms-pathresolver';
import {IUISchemaElement} from '../../jsonforms';
export interface RendererService {
    register(directiveName: string, tester: RendererTester): void;
    getBestComponent(element: IUISchemaElement, dataSchema: any, dataObject: any): string;
}
export interface RendererTester {
    (element: IUISchemaElement, dataSchema: any, dataObject: any,pathResolver:IPathResolver): number;
}
interface RendererDefinition {
    directiveName: string;
    tester: RendererTester;
}
export const NOT_FITTING:number=-1;
class RendererServiceImpl implements RendererService {
    static $inject = ['PathResolver'];
    constructor(private refResolver: IPathResolver) {
    }

    private renderer: Array<RendererDefinition> = [];
    register=(directiveName: string, tester: RendererTester): void =>{
        this.renderer.push({directiveName: directiveName, tester: tester});
    }
    getBestComponent(element: IUISchemaElement, dataSchema: any, dataObject: any): string {
        var bestDirective: string;
        var highestSpecificity: number = -1;
        for (var rendererDef of this.renderer) {
            var currentSpecificity: number = rendererDef.tester(element, dataSchema, dataObject,this.refResolver);
            if (currentSpecificity > highestSpecificity) {
                highestSpecificity = currentSpecificity;
                bestDirective = rendererDef.directiveName;
            }
        }
        return "<"+bestDirective+"></"+bestDirective+">";
    }
}
export default angular
    .module('jsonforms.renderers', [])
    .service('RendererService', RendererServiceImpl)
    .name;
