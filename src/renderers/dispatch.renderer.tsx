import * as _ from 'lodash';
import { JsonForms } from '../core';
import { UnknownRenderer } from './unknown.renderer';
import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';

export interface DispatchRendererProps {

  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;
}

export const DispatchRenderer = (props: DispatchRendererProps) => {
  const { uischema, path, schema } = props;
  const renderer = _.maxBy(JsonForms.rendererService.renderers, r =>
      r.tester(uischema, schema)
  );

  if (renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer/>;
  } else {
    return <renderer.renderer
      uischema={uischema}
      schema={schema}
      path={path}
    />;
  }
};
