
import form from '../components/form/form';
import ngServices from '../components/ng-services/ng-services';
import jsonformsMaterial from './jsonforms-material';

export default angular.module('jsonforms', [
    form,
    ngServices,
    jsonformsMaterial
]).name;