
import form from '../components/form/form';
import ngServices from './components/ng-services/ng-services';
import jsonformsBootstrap from './jsonforms_bootstrap';
require('angular-ui-validate');

export default angular.module('jsonforms', [
    'ui.validate',
    form,
    ngServices,
    jsonformsBootstrap
]).name;

