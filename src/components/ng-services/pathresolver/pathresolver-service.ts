
import {PointerResolver} from '../../services/pathresolver/jsonforms-pathresolver';

export default angular
    .module('jsonforms.service.path-resolver', [])
    .service('PathResolver', PointerResolver)
    .name;
