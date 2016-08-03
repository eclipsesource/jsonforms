
import {RefResolver} from '../../services/pathresolver/jsonforms-pathresolver';

export default angular
    .module('jsonforms.service.path-resolver', [])
    .service('PathResolver', RefResolver)
    .name;
