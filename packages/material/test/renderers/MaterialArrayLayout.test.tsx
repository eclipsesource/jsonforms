/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import './MatchMediaMock';
import {
  ControlElement
} from '@jsonforms/core';
import * as React from 'react';

import { materialRenderers } from '../../src';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester
} from '../../src/layouts';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonForms, JsonFormsStateProvider } from '@jsonforms/react';
import { Accordion } from '@mui/material';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = [
  {
    message: 'El Barto was here',
    message2: 'El Barto was here 2',
    done: true
  },
  {
    message: 'Yolo',
    message2: 'Yolo 2'
  }
];
const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        maxLength: 3
      },
      done: {
        type: 'boolean'
      }
    }
  }
};

const nestedSchema = {
  type: 'array',
  items: {
    ...schema
  }
};

const nestedSchemaWithRef = {
  definitions: {
    arrayItems: {
      ...schema
    }
  },
  type: 'array',
  items: {
    $ref: '#/definitions/arrayItems'
  }
}

const uischema: ControlElement = {
  type: 'Control',
  scope: '#'
};

const nestedSchema2 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      objectarrayofstrings: {
        type: 'object',
        properties: {
          choices: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

const nestedSchema2WithRef = {
  definitions: {
    arrayItems: {
      ...nestedSchema2
    }
  },
  type: 'array',
  items: {
    $ref: '#/definitions/arrayItems'
  }
}

const uischemaWithSortOption: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    showSortButtons: true
  }
};

const uischemaWithChildLabelProp: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    elementLabelProp: 'message2'
  }
};

const uischemaOptions: {
  generate: ControlElement;
  default: ControlElement;
  inline: ControlElement;
} = {
  default: {
    type: 'Control',
    scope: '#',
    options: {
      detail: 'DEFAULT'
    }
  },
  generate: {
    type: 'Control',
    scope: '#',
    options: {
      detail: 'GENERATE'
    }
  },
  inline: {
    type: 'Control',
    scope: '#',
    options: {
      detail: {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/message'
          }
        ]
      }
    }
  }
};

describe('Material array layout tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', () => {
    expect(materialArrayLayoutTester(uischema, schema, undefined)).toBe(-1);
    expect(materialArrayLayoutTester(uischema, nestedSchema, undefined)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchema2, undefined)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchemaWithRef, nestedSchemaWithRef)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchemaWithRef, nestedSchemaWithRef)).toBe(4);
    expect(materialArrayLayoutTester(uischema, nestedSchema2WithRef, nestedSchema2WithRef)).toBe(4);

    expect(materialArrayLayoutTester(uischemaOptions.default, schema, undefined)).toBe(-1);
    expect(materialArrayLayoutTester(uischemaOptions.generate, schema, undefined)).toBe(4);
    expect(materialArrayLayoutTester(uischemaOptions.inline, schema, undefined)).toBe(4);
  });
});

describe('Material array layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two by two children', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should generate uischema when options.detail=GENERATE', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout schema={schema} uischema={uischemaOptions.generate} />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should use inline options.detail uischema', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout schema={schema} uischema={uischemaOptions.inline} />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 1 control
    expect(controls).toHaveLength(2);
  });

  it('should be hideable', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // no controls should be rendered
    expect(controls).toHaveLength(0);
  });

  it('should have renderers prop via ownProps', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout
          schema={schema}
          uischema={uischema}
          renderers={[]}
        />
      </JsonFormsStateProvider>
    );

    const materialArrayLayout = wrapper.find(MaterialArrayLayout);
    expect(materialArrayLayout.props().renderers).toHaveLength(0);
  });

  it('ui schema label for array', () => {
    const uischemaWithLabel = {
      ...uischema,
      label: 'My awesome label'
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithLabel}
        renderers={materialRenderers}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    const listLabel = wrapper.find('h6').at(0);
    expect(listLabel.text()).toBe('My awesome label');
  });

  it('schema title for array', () => {
    const titleSchema = {
      ...schema,
      title: 'My awesome title'
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout schema={titleSchema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const listTitle = wrapper.find('h6').at(0);
    expect(listTitle.text()).toBe('My awesome title');
  });

  it('should render sort buttons if showSortButtons is true', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithSortOption}
        renderers={materialRenderers}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // up button
    expect(
      wrapper
        .find('Memo(ExpandPanelRendererComponent)')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper
        .find('Memo(ExpandPanelRendererComponent)')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move down' }).length
    ).toBe(1);
  });
  it('should move item up if up button is presses', (done) => {
    const onChangeData: any = {
      data: undefined
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithSortOption}
        renderers={materialRenderers}
        onChange={({ data }) => {
          onChangeData.data = data;
        }}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('Memo(ExpandPanelRendererComponent)')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    upButton.simulate('click');
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(onChangeData.data).toEqual([
        {
          message: 'Yolo',
          message2: 'Yolo 2'
        },
        {
          message: 'El Barto was here',
          message2: 'El Barto was here 2',
          done: true
        }
      ]);
      done();
    }, 50);
  });
  it('should move item down if down button is pressed', (done) => {
    const onChangeData: any = {
      data: undefined
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithSortOption}
        renderers={materialRenderers}
        onChange={({ data }) => {
          onChangeData.data = data;
        }}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('Memo(ExpandPanelRendererComponent)')
      .at(0)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    upButton.simulate('click');
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(onChangeData.data).toEqual([
        {
          message: 'Yolo',
          message2: 'Yolo 2'
        },
        {
          message: 'El Barto was here',
          message2: 'El Barto was here 2',
          done: true
        }
      ]); done();
    }, 50);
  });
  it('should have up button disabled for first element', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithSortOption}
        renderers={materialRenderers}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // getting up button of second item in expension panel;
    const upButton = wrapper
      .find('Memo(ExpandPanelRendererComponent)')
      .at(0)
      .find('button')
      .find({ 'aria-label': 'Move up' });
    expect(upButton.is('[disabled]')).toBe(true);
  });
  it('should have down button disabled for last element', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithSortOption}
        renderers={materialRenderers}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // getting up button of second item in expension panel;
    const downButton = wrapper
      .find('Memo(ExpandPanelRendererComponent)')
      .at(1)
      .find('button')
      .find({ 'aria-label': 'Move down' });
    expect(downButton.is('[disabled]')).toBe(true);
  });

  const getChildLabel = (wrapper: ReactWrapper, index: number) =>
    wrapper
      .find(
        `#${
        wrapper
          .find(Accordion)
          .at(index)
          .props()['aria-labelledby']
        }`
      )
      .text();

  it('should render first simple property as child label', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialArrayLayout schema={schema} uischema={uischemaWithSortOption} />
      </JsonFormsStateProvider>
    );

    expect(getChildLabel(wrapper, 0)).toBe('El Barto was here');
    expect(getChildLabel(wrapper, 1)).toBe('Yolo');
  });

  it('should render configured child label property as child label', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischemaWithChildLabelProp}
        renderers={materialRenderers}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    expect(getChildLabel(wrapper, 0)).toBe('El Barto was here 2');
    expect(getChildLabel(wrapper, 1)).toBe('Yolo 2');
  });
});
