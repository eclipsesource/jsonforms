///<reference path="../../references.ts"/>

import {UISchemaGenerator} from "./jsonforms-uischemagenerator";

export default angular
    .module('jsonforms.generators.uischema', ['jsonforms.generators'])
    .service('UISchemaGenerator', UISchemaGenerator).name;
