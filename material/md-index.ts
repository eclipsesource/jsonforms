
import form from '../src/components/form/form';
import ngServices from '../src/components/ng-services/ng-services';
import jsonformsMaterial from './jsonforms-material';
require('./jsonforms-material.css');

export default angular.module('jsonforms', [
    form,
    ngServices,
    jsonformsMaterial
]).name;
