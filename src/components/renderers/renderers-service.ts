
import * as angular from 'angular'
import {RenderService} from "./jsonforms-renderers";
import {RenderDescriptionFactory} from "./jsonforms-renderers";
import {RendererServiceImpl} from './renderer-service';
export default angular
    .module('jsonforms.renderers', [])
    .service('RenderService', RenderService)
    .service('RenderDescriptionFactory', RenderDescriptionFactory)
    .service('RendererService', RendererServiceImpl)
    .name;
