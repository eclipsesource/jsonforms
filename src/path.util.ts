import {JsonSchema} from "./models/jsonSchema";
const PATH_SEGMENTS_TO_IGNORE = ["#", "properties"];
export class PathUtil {
  static getValuePropertyPair(instance: any, path: string): any {
    let validPathSegments = path.split("/").filter(subpath => PATH_SEGMENTS_TO_IGNORE.indexOf(subpath) === -1);
    let resolvedInstance = validPathSegments.slice(0, validPathSegments.length - 1).reduce((curInstance, pathSegment) => {
      if (!curInstance.hasOwnProperty(pathSegment)) {
        curInstance[pathSegment] = {};
      }
      return curInstance[pathSegment];
    }
    , instance);
    return {instance: resolvedInstance, property: validPathSegments[validPathSegments.length - 1]};
  }
  static getResolvedSchema(schema: JsonSchema, path: string): JsonSchema {
    let validPathSegments = path.split("/");
    let resolvedSchema = validPathSegments.reduce((curSchema, pathSegment) => pathSegment === "#" ? curSchema : curSchema[pathSegment], schema);
    return resolvedSchema;
  }
  static toDataPath(path: string): string {
    return path.split("/").filter(subpath => PATH_SEGMENTS_TO_IGNORE.indexOf(subpath) === -1).join("/");
  }
}
