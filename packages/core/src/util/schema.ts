import find from "lodash/find";

export const getFirstPrimitiveProp = (schema: any) => {
  if (schema.properties) {
    return find(Object.keys(schema.properties), propName => {
      const prop = schema.properties[propName];
      return (
        prop.type === 'string' ||
        prop.type === 'number' ||
        prop.type === 'integer'
      );
    });
  }
  return undefined;
};
