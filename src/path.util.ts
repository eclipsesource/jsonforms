import {FullDataModelType, isItemModel} from './parser/item_model';

const toDataPathSegments = (path: string): Array<string> => {
  const segments = path.split('/');
  const startFromRoot = segments[0] === '#' || segments[0] === '';
  if (startFromRoot) {
    return segments.filter((segment, index) => {
      if (index === 0) {
        return false;
      } else if (index % 2 === 1) {
        return false;
      } else {
        return true;
      }
    });
  }
  return segments.filter((segment, index) => {
    if (index % 2 === 0) {
      return false;
    } else {
      return true;
    }
  });
};

export const toDataPath = (path: string): string => {
  return toDataPathSegments(path).join('/');
};

export const getValuePropertyPair = (instance: any, path: string):
  {instance: Object, property: string} => {
  const validPathSegments = toDataPathSegments(path);
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

export const resolveSchema = (model: FullDataModelType, path: string): FullDataModelType => {
  const validPathSegments = path.split('/');
  const invalidSegment =
    (pathSegment) => pathSegment === '#' || pathSegment === undefined || pathSegment === '' ||
    pathSegment === 'properties';
  const resultSchema = validPathSegments.reduce((curModel, pathSegment) =>
    invalidSegment(pathSegment) ? curModel :
      isItemModel(curModel) ?
        curModel.dropPoints.hasOwnProperty(pathSegment) ? curModel.dropPoints[pathSegment]
          : curModel.attributes[pathSegment]
        : curModel, model);
  // if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
  //   return retrieveResolvableSchema(model.schema, resultSchema.$ref);
  // }
  return resultSchema;
};
