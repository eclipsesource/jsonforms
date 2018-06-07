import * as React from 'react';
import { TreeRenderer } from './tree/TreeRenderer';

const EditorIde = props => {
  const { uischema, schema, filterPredicate, labelProvider, imageProvider} = props;

  return (
    <div>
      <TreeRenderer
        uischema={uischema}
        schema={schema}
        filterPredicate={filterPredicate}
        labelProvider={labelProvider}
        imageProvider={imageProvider}
      />
    </div>
  );
};

export default EditorIde;
