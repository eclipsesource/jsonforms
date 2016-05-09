export interface TemplateService {
    register(directiveName: string, template: any): void;
    getTemplate(directiveName: string): any;
}
class TemplateServiceImpl implements TemplateService {
    private templates: Object = new Object();
    register(directiveName: string, template: any): void {
        this.templates[directiveName] = template;
    }
    getTemplate(directiveName: string): any {
        return this.templates[directiveName];
    }
}
export default angular
    .module('jsonforms.renderers.template', [])
    .service('TemplateService', TemplateServiceImpl)
    .name;
