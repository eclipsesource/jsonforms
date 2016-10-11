import {SchemaElement} from '../../jsonschema';
import {IUISchemaElement} from '../../uischema';
import {PathUtil} from './pathutil';

// TODO: replace
let Ajv = require('ajv');
let ajv = new Ajv({allErrors: true, jsonPointers: true});
// TODO: remove
class HashTable {

    private hashes;

    constructor() {
        this.hashes = {};
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
export class ScopeProvider implements IScopeProvider {
    constructor(private scope: ng.IScope) { }

    getId(): ServiceId {
        return ServiceId.ScopeProvider;
    }

    getScope(): ng.IScope {
        return this.scope;
    }
}
export class SchemaProvider implements ISchemaProvider {
    constructor(private schema: SchemaElement) {

    }

    getId(): ServiceId {
        return ServiceId.SchemaProvider;
    }

    getSchema(): SchemaElement {
        return this.schema;
    }
}

export class UiSchemaProvider implements IUiSchemaProvider {
    constructor(private schema: IUISchemaElement) {
    }

    getId(): ServiceId {
        return ServiceId.UiSchemaProvider;
    }

    getUiSchema(): IUISchemaElement {
        return this.schema;
    }
}
export class ValidationService implements IValidationService {

    private validationResults = new HashTable();
    private checkObjects : Array<Object> = [];

    getId(): ServiceId {
        return ServiceId.Validation;
    }

    getResult(instance: any, dataPath: string): any {
        if (this.validationResults.get(instance) === undefined) {
            return undefined;
        } else {
            return this.validationResults.get(instance)[dataPath];
        }
    }

    validate(instance: any, schema: SchemaElement): void {

        if (ajv === undefined) {
            return;
        }

        this.convertAllDates(instance);
        this.checkObjects = [];
        this.clear(instance);
        // TODO
        let valid = ajv.validate(schema, instance);
        if (valid) {
          this.validationResults.put(instance, undefined);
          return;
        }
        ajv['errors'].forEach((error) => {
            if (error['schemaPath'].indexOf('required') !== -1) {
                let propName = error['dataPath'] + '/' + error['params']['missingProperty'];
                this.validationResults.get(instance)[propName] = error['message'];
            } else {
                this.validationResults.get(instance)[error['dataPath']] = error['message'];
            }
        });
    }

    private convertAllDates(instance): void {
        _.forOwn(instance, (value, key) => {
            if (_.includes(this.checkObjects, value)) {
                return;
            }
            this.checkObjects.push(value);
            if (value instanceof Date) {
                instance[key] = value.toString();
            } else if (value instanceof Object) {
                this.convertAllDates(value);
            }
        });
    }

    private clear(instance: any) { this.validationResults.put(instance, {}); }
}

export enum ServiceId {
    Validation,
    DataProvider,
    SchemaProvider,
    UiSchemaProvider,
    ScopeProvider,
    RuleService,
    PathResolver
}

export interface IService {
    getId(): ServiceId;
}
export interface IScopeProvider extends IService {
    getScope(): ng.IScope;
}
export interface IUiSchemaProvider extends IService {
    getUiSchema(): IUISchemaElement;
}
export interface ISchemaProvider extends IService {
    getSchema(): SchemaElement;
}
export interface IValidationService extends IService {
    getResult(instance: any, dataPath: string): any;
    validate(instance: any, schema: SchemaElement): void;
}
