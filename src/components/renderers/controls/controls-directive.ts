import { TemplateService } from '../template-service';
import './control.css';

class ControlDirective implements ng.IDirective {
    constructor(private templateService: TemplateService) {}
    restrict    = 'E';
    replace     = true;
    transclude  = true;
    template = () => {
        let template = this.templateService.getTemplate('jsonformsControl');
        return template ? template : require('./control.html');
    }
}

export default angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers', 'jsonforms.renderers.template'])
    .directive('jsonformsControl', ['TemplateService', ctp => new ControlDirective(ctp)])
    .name;
