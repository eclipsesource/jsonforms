
import {SchemaGenerator} from "./jsonforms-schemagenerator";

export default angular
    .module('jsonforms.generators.schema', ['jsonforms.generators'])
    .service('SchemaGenerator', SchemaGenerator).name;
