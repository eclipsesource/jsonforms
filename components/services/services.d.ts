import { PathResolver } from './pathresolver/jsonforms-pathresolver';
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
export declare class PathResolverService implements IPathResolverService {
    private resolver;
    constructor(resolver: PathResolver);
    getId(): ServiceId;
    getResolver(): PathResolver;
}
export declare class SchemaProvider implements ISchemaProvider {
    private schema;
    constructor(schema: SchemaElement);
    getId(): ServiceId;
    getSchema(): SchemaElement;
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
}
export interface IService {
    getId(): ServiceId;
}
export interface IPathResolverService extends IService {
    getResolver(): PathResolver;
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
