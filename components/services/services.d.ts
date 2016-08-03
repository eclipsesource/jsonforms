import { SchemaElement } from '../../jsonschema';
import { IUISchemaElement } from '../../uischema';
export declare class Services {
    private services;
    add(service: IService): void;
    get<T extends IService>(serviceId: ServiceId): T;
}
export declare class ScopeProvider implements IScopeProvider {
    private scope;
    constructor(scope: ng.IScope);
    getId(): ServiceId;
    getScope(): ng.IScope;
}
export declare class SchemaProvider implements ISchemaProvider {
    private schema;
    constructor(schema: SchemaElement);
    getId(): ServiceId;
    getSchema(): SchemaElement;
}
export declare class UiSchemaProvider implements IUiSchemaProvider {
    private schema;
    constructor(schema: IUISchemaElement);
    getId(): ServiceId;
    getUiSchema(): IUISchemaElement;
}
export declare class ValidationService implements IValidationService {
    private validationResults;
    private checkObjects;
    getId(): ServiceId;
    getResult(instance: any, dataPath: string): any;
    validate(instance: any, schema: SchemaElement): void;
    private convertAllDates(instance);
    private clear(instance);
}
export declare enum ServiceId {
    Validation = 0,
    DataProvider = 1,
    SchemaProvider = 2,
    ScopeProvider = 3,
    RuleService = 4,
    PathResolver = 5,
    UiSchemaProvider = 6,
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
