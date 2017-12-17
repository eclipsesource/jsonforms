import * as React from 'react';
import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';

export interface RendererProps {
  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  /**
   * Whether the rendered element should be visible.
   */
  visible?: boolean;

  /**
   * Whether the rendered element should be enabled.
   */
  enabled?: boolean;

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;
}

export class Renderer<P extends RendererProps, S> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }
}
