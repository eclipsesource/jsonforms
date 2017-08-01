import { JsonSchema } from '../models/jsonSchema';
import { ContainmentProperty, ReferenceProperty, SchemaService } from './schema.service';
export declare class SchemaServiceImpl implements SchemaService {
    private rootSchema;
    private selfContainedSchemas;
    constructor(rootSchema: JsonSchema);
    getContainmentProperties(schema: JsonSchema): ContainmentProperty[];
    hasContainmentProperties(schema: JsonSchema): boolean;
    getSelfContainedSchema(parentSchema: JsonSchema, refPath: string): JsonSchema;
    getReferenceProperties(schema: JsonSchema): ReferenceProperty[];
    private getContainment(key, name, schema, rootSchema, isInContainment, addFunction, deleteFunction, getFunction);
    /**
     * Makes the given JsonSchema self-contained. This means all referenced definitions
     * are contained in the schema's definitions block and references equal to
     * outerReference are set to root ('#').
     *
     * @param schema The current schema to make self contained
     * @param outerSchema The root schema to which missing definitions are added
     * @param outerReference The reference which is considered to be self ('#')
     * @param includedDefs The list of definitions which were already added to the outer schema
     */
    private selfContainSchema(schema, outerSchema, outerReference, includedDefs?);
    private copyAndResolveInner(resolved, innerRef, outerSchema, outerReference, includedDefs);
}
