
import {RefResolver} from '../../services/path-resolver/path-resolver';

export default angular
    .module('jsonforms.service.path-resolver', [])
    .service('PathResolver', RefResolver)
    .name;
