
import form from '../src/components/form/form';
import ngServices from '../src/components/ng-services/ng-services';
import jsonformsBootstrap from './jsonforms-bootstrap';
require('angular-ui-validate');

export default angular.module('jsonforms', [
    'ui.validate',
    form,
    ngServices,
    jsonformsBootstrap
]).name;
