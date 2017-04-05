import { JsonSchema } from './models/jsonSchema';
// const PATH_SEGMENTS_TO_IGNORE = ['#', 'properties'];

export const getValuePropertyPair = (instance: any, path: string):
  {instance: Object, property: string} => {
  const validPathSegments = toDataPathSegments(path);
      // path.split('/').filter(subPath => PATH_SEGMENTS_TO_IGNORE.indexOf(subPath) === -1);
  const resolvedInstance =
      validPathSegments
          .slice(0, validPathSegments.length - 1)
          .map(segment => decodeURIComponent(segment))
          .reduce((curInstance, decodedSegment) => {
              if (!curInstance.hasOwnProperty(decodedSegment)) {
                  curInstance[decodedSegment] = {};
              }
              return curInstance[decodedSegment];
          }, instance);
    return {
      instance: resolvedInstance,
      property: validPathSegments.length > 0 ?
        decodeURIComponent(validPathSegments[validPathSegments.length - 1]) : undefined
  };
};
const toDataPathSegments = (path: string): Array<string> => {
  const segments = path.split('/');
  const startFromRoot = segments[0] === '#' || segments[0] === '';
  return segments.filter((segment, index) => {
    if (startFromRoot) {
      if (index === 0) {
        return false;
      } else if (index % 2 === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (index % 2 === 0) {
        return false;
      } else {
        return true;
      }
    }
  });
}
export const toDataPath = (path: string): string => {
  return toDataPathSegments(path).join('/');
}

export const resolveSchema = (schema: JsonSchema, path: string): JsonSchema => {
  const validPathSegments = path.split('/');
  const invalidSegment =
    (pathSegment) => pathSegment === '#' || pathSegment === undefined || pathSegment === '';
  const resultSchema = validPathSegments.reduce((curSchema, pathSegment) =>
      invalidSegment(pathSegment) ? curSchema : curSchema[pathSegment], schema);
  if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
    return retrieveResolvableSchema(schema, resultSchema.$ref);
  }
  return resultSchema;
};
interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}
const findAllRefs = (schema: JsonSchema, result: ReferenceSchemaMap = {}): ReferenceSchemaMap => {
  if (schema.type === 'object' && schema.properties !== undefined) {
    Object.keys(schema.properties).forEach(key => findAllRefs(schema.properties[key], result));
  }
  if (schema.type === 'array' && schema.items !== undefined) {
    // FIXME Do we want to support tupples? If so how do we render this?
    if (Array.isArray(schema.items)) {
      schema.items.forEach(child => findAllRefs(child, result));
    }
    findAllRefs(schema.items, result);
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }
  return result;
};
export const retrieveResolvableSchema = (full: JsonSchema, reference: string): JsonSchema => {
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }
  return child;
};
