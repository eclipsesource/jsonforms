import { JsonSchema } from './models/jsonSchema';
const PATH_SEGMENTS_TO_IGNORE = ['#', 'properties'];

export const getValuePropertyPair = (instance: any, path: string): any => {
  const validPathSegments =
      path.split('/').filter(subPath => PATH_SEGMENTS_TO_IGNORE.indexOf(subPath) === -1);
  const resolvedInstance =
      validPathSegments
          .slice(0, validPathSegments.length - 1)
          .reduce((curInstance, pathSegment) => {
              if (!curInstance.hasOwnProperty(pathSegment)) {
                  curInstance[pathSegment] = {};
              }
              return curInstance[pathSegment];
          }, instance);
    return {
      instance: resolvedInstance,
      property: validPathSegments[validPathSegments.length - 1]
  };
};

export const toDataPath = (path: string): string =>
  path.split('/').filter(subPath => PATH_SEGMENTS_TO_IGNORE.indexOf(subPath) === -1).join('/');

export const resolveSchema = (schema: JsonSchema, path: string): JsonSchema => {
  const validPathSegments = path.split('/');
  return validPathSegments.reduce((curSchema, pathSegment) =>
      pathSegment === '#' ? curSchema : curSchema[pathSegment], schema);
};
