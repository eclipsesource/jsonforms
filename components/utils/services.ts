///<reference path="../references.ts"/>

module JSONForms{
    declare var tv4;
    class HashTable {

        private hashes;

        constructor() {
            this.hashes = {}
        }

        put(key, value) {
            this.hashes[JSON.stringify(key)] = value;
        }

        get(key) {
            return this.hashes[JSON.stringify(key)];
        }
    }
    export class Services {

        private services: any = {};

        add(service: IService): void {
            this.services[service.getId()] = service;
        }

        get<T extends IService>(serviceId: ServiceId): T {
            return this.services[serviceId];
        }

    }
    export class SchemaProvider implements ISchemaProvider {
        constructor(private schema: SchemaElement) {

        }

        getId():JSONForms.ServiceId {
            return ServiceId.SchemaProvider;
        }

        getSchema():SchemaElement {
            return this.schema;
        }
    }
    export class ValidationService implements IValidationService {

        private validationResults = new HashTable();

        getId(): ServiceId {
            return ServiceId.Validation;
        }

        getResult(instance: any, dataPath: string): any {
            if (this.validationResults.get(instance) == undefined) {
                return undefined;
            } else {
                return this.validationResults.get(instance)[dataPath];
            }
        }

        validate(instance: any, schema: SchemaElement): void {
            if (tv4 == undefined) {
                return;
            }

            this.validationResults.put(instance, {});
            var results = tv4.validateMultiple(instance, schema);

            for (var i = 0; i < results['errors'].length; i++) {

                var validationResult = results['errors'][i];

                //if (validationResult.schemaPath.indexOf('/required') != -1) {
                //    var propName = validationResult['params']['key'];
                //    if (propName == normalizedPath.substr(normalizedPath.lastIndexOf('/') + 1, normalizedPath.length)) {
                //        errorMsg = "Missing property";
                //        break;
                //    }
                //}

                this.validationResults.get(instance)[validationResult['dataPath']] = validationResult;
            }
        }
    }
    export enum ServiceId {
        Validation,
        DataProvider,
        SchemaProvider,
        RuleService
    }
}
