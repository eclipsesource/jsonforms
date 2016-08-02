
import form from '../components/form/form';
import capitalize from '../components/ng-services/capitalize/capitalize.filter';
import pathResolver from '../components/ng-services/pathresolver/pathresolver-service';
import jsonformsBootstrap from './jsonforms_bootstrap';
require('angular-ui-validate');

export default angular.module('jsonforms', [
    'ui.validate',
    form,
    capitalize,
    pathResolver,
    jsonformsBootstrap
]).name;

