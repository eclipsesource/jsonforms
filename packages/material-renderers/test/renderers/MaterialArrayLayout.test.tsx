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
import {
  ArrayTranslationEnum,
  ControlElement,
  i18nJsonSchema,
  JsonSchema7,
  Translator,
} from '@jsonforms/core';
import * as React from 'react';

import { ArrayLayoutToolbar, materialRenderers } from '../../src';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester,
} from '../../src/layouts';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonForms, JsonFormsStateProvider } from '@jsonforms/react';
import { Accordion } from '@mui/material';
import { createTesterContext, testTranslator, initCore } from './util';
import { checkTooltip, checkTooltipTranslation } from './tooltipChecker';
import { cloneDeep } from 'lodash';

Enzyme.configure({ adapter: new Adapter() });

const data = [
  {
    message: 'El Barto was here',
    message2: 'El Barto was here 2',
    done: true,
  },
  {
    message: 'Yolo',
    message2: 'Yolo 2',
  },
];

const emptyData: any[] = [];

const enumOrOneOfData = [
  {
    message: 'El Barto was here',
    messageType: 'MSG_TYPE_1',
  },
  {
    message: 'El Barto was not here',
    messageType: 'MSG_TYPE_2',
  },
  {
    message: 'Yolo',
  },
];

const schema: JsonSchema7 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        maxLength: 3,
      },
      done: {
        type: 'boolean',
      },
    },
  },
};

const enumSchema: JsonSchema7 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      messageType: {
        type: 'string',
        enum: ['MSG_TYPE_1', 'MSG_TYPE_2'],
      },
    },
  },
};

const oneOfSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      messageType: {
        type: 'string',
        oneOf: [
          {
            const: 'MSG_TYPE_1',
          },
          {
            const: 'MSG_TYPE_2',
            title: 'Second message type',
          },
        ],
      },
    },
  },
};

const deepEnumOrOneOfData = {
  article: {
    title: 'title',
    comments: [
      {
        author: {
          name: 'John',
          type: 'WRITER',
          role: 'ROLE_1',
        },
      },
      {
        author: {
          name: 'John',
          type: 'AUTHOR',
          role: 'ROLE_2',
        },
      },
    ],
  },
};

const deepEnumOrOneOfSchema: JsonSchema7 = {
  type: 'object',
  properties: {
    article: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              author: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['AUTHOR', 'WRITER'],
                  },
                  role: {
                    type: 'string',
                    oneOf: [
                      {
                        const: 'ROLE_1',
                      },
                      {
                        const: 'ROLE_2',
                        title: 'Second role',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const deepUiSchemaWithEnumChildLabelProp: ControlElement = {
  type: 'Control',
  scope: '#/properties/article/properties/comments',
  options: {
    elementLabelProp: 'author.type',
    detail: {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/author/properties/name' },
        { type: 'Control', scope: '#/properties/author/properties/type' },
        { type: 'Control', scope: '#/properties/author/properties/role' },
      ],
    },
  },
};

const deepUiSchemaWithOneOfChildLabelProp: ControlElement = {
  type: 'Control',
  scope: '#/properties/article/properties/comments',
  options: {
    elementLabelProp: 'author.role',
    detail: {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/author/properties/name' },
        { type: 'Control', scope: '#/properties/author/properties/type' },
        { type: 'Control', scope: '#/properties/author/properties/role' },
      ],
    },
  },
};

const nestedSchema: JsonSchema7 = {
  type: 'array',
  items: {
    ...schema,
  },
};

const nestedSchemaWithRef = {
  definitions: {
    arrayItems: {
      ...schema,
    },
  },
  type: 'array',
  items: {
    $ref: '#/definitions/arrayItems',
  },
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#',
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
              type: 'string',
            },
          },
        },
      },
    },
  },
};

const nestedSchema2WithRef = {
  definitions: {
    arrayItems: {
      ...nestedSchema2,
    },
  },
  type: 'array',
  items: {
    $ref: '#/definitions/arrayItems',
  },
};

const uischemaWithSortOption: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    showSortButtons: true,
  },
};

const uischemaWithChildLabelProp: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    elementLabelProp: 'message2',
  },
};

const uiSchemaWithEnumOrOneOfChildLabelProp: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    elementLabelProp: 'messageType',
    detail: {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/message' },
        { type: 'Control', scope: '#/properties/messageType' },
      ],
    },
  },
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
      detail: 'DEFAULT',
    },
  },
  generate: {
    type: 'Control',
    scope: '#',
    options: {
      detail: 'GENERATE',
    },
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
            scope: '#/properties/message',
          },
        ],
      },
    },
  },
};

describe('Material array layout tester', () => {
  it('should only be applicable for intermediate array or when containing proper options', () => {
    expect(materialArrayLayoutTester(uischema, schema, undefined)).toBe(-1);
    expect(materialArrayLayoutTester(uischema, nestedSchema, undefined)).toBe(
      4
    );
    expect(materialArrayLayoutTester(uischema, nestedSchema2, undefined)).toBe(
      4
    );
    expect(
      materialArrayLayoutTester(
        uischema,
        nestedSchemaWithRef,
        createTesterContext(nestedSchemaWithRef)
      )
    ).toBe(4);
    expect(
      materialArrayLayoutTester(
        uischema,
        nestedSchemaWithRef,
        createTesterContext(nestedSchemaWithRef)
      )
    ).toBe(4);
    expect(
      materialArrayLayoutTester(
        uischema,
        nestedSchema2WithRef,
        createTesterContext(nestedSchema2WithRef)
      )
    ).toBe(4);

    expect(
      materialArrayLayoutTester(uischemaOptions.default, schema, undefined)
    ).toBe(-1);
    expect(
      materialArrayLayoutTester(uischemaOptions.generate, schema, undefined)
    ).toBe(4);
    expect(
      materialArrayLayoutTester(uischemaOptions.inline, schema, undefined)
    ).toBe(4);
  });
});

describe('Material array layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render two by two children', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
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
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.generate}
        />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 2 controls
    expect(controls).toHaveLength(4);
  });

  it('should use inline options.detail uischema', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.inline}
        />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('input');
    // 2 data entries with each having 1 control
    expect(controls).toHaveLength(2);
  });

  it('should be hideable', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
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
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
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
      label: 'My awesome label',
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
      title: 'My awesome title',
    };

    wrapper = arrayLayoutWrapper(
      wrapper,
      data,
      titleSchema,
      uischema,
      undefined
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
        .find({ 'aria-label': 'Move item up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper
        .find('Memo(ExpandPanelRendererComponent)')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move item down' }).length
    ).toBe(1);
  });
  it('should render sort buttons if showSortButtons is true in config', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischema}
        renderers={materialRenderers}
        config={{ showSortButtons: true }}
      />
    );

    expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();

    // up button
    expect(
      wrapper
        .find('Memo(ExpandPanelRendererComponent)')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move item up' }).length
    ).toBe(1);
    // down button
    expect(
      wrapper
        .find('Memo(ExpandPanelRendererComponent)')
        .at(0)
        .find('button')
        .find({ 'aria-label': 'Move item down' }).length
    ).toBe(1);
  });
  it('should move item up if up button is presses', (done) => {
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={nestedSchema}
        uischema={uischema}
        config={{ showSortButtons: true }}
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
      .find({ 'aria-label': 'Move item up' });
    upButton.simulate('click');
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(onChangeData.data).toEqual([
        {
          message: 'Yolo',
          message2: 'Yolo 2',
        },
        {
          message: 'El Barto was here',
          message2: 'El Barto was here 2',
          done: true,
        },
      ]);
      done();
    }, 50);
  });
  it('should move item down if down button is pressed', (done) => {
    const onChangeData: any = {
      data: undefined,
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
      .find({ 'aria-label': 'Move item down' });
    upButton.simulate('click');
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(onChangeData.data).toEqual([
        {
          message: 'Yolo',
          message2: 'Yolo 2',
        },
        {
          message: 'El Barto was here',
          message2: 'El Barto was here 2',
          done: true,
        },
      ]);
      done();
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
      .find({ 'aria-label': 'Move item up' });
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
      .find({ 'aria-label': 'Move item down' });
    expect(downButton.is('[disabled]')).toBe(true);
  });

  it('add and delete buttons should exist if enabled', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeTruthy();
    const addButton = wrapper.find({ 'aria-label': 'Add button' });
    expect(addButton.exists()).toBeTruthy();
  });

  it('add and delete buttons should be removed if disabled', () => {
    const readOnlySchema = { ...schema };
    readOnlySchema.readOnly = true;
    wrapper = mount(
      <JsonForms
        data={data}
        schema={readOnlySchema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeFalsy();
    const addButton = wrapper.find({ 'aria-label': 'Add button' });
    expect(addButton.exists()).toBeFalsy();
  });

  it('add button should be removed if indicated via ui schema', () => {
    const disableUischema = { ...uischema };
    disableUischema.options = { ...uischema.options, disableAdd: true };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={disableUischema}
        renderers={materialRenderers}
      />
    );

    const button = wrapper.find({ 'aria-label': 'Add button' });
    expect(button.exists()).toBeFalsy();
  });

  it('delete button should be removed if indicated via ui schema', () => {
    const disableUischema = { ...uischema };
    disableUischema.options = { ...uischema.options, disableRemove: true };
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={disableUischema}
        renderers={materialRenderers}
      />
    );

    const button = wrapper.find({ 'aria-label': 'Delete button' });
    expect(button.exists()).toBeFalsy();
  });

  it('add and delete buttons should be removed if indicated via config', () => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
        config={{
          disableAdd: true,
          disableRemove: true,
        }}
      />
    );

    const deleteButton = wrapper.find({ 'aria-label': 'Delete button' });
    expect(deleteButton.exists()).toBeFalsy();
    const addButton = wrapper.find({ 'aria-label': 'Add button' });
    expect(addButton.exists()).toBeFalsy();
  });

  const getChildLabel = (wrapper: ReactWrapper, index: number) =>
    wrapper
      .find(`#${wrapper.find(Accordion).at(index).props()['aria-labelledby']}`)
      .text();

  it('should render first simple property as child label', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      data,
      schema,
      uischemaWithSortOption,
      undefined
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

  it('should render description', () => {
    const descriptionSchema = {
      ...nestedSchema,
      description: 'This is an array description',
    };

    wrapper = mount(
      <JsonForms
        data={data}
        schema={descriptionSchema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(
      wrapper.text().includes('This is an array description')
    ).toBeTruthy();
    expect(
      wrapper.find('.MuiToolbar-root .MuiFormHelperText-root').exists()
    ).toBeTruthy();
  });

  it('should not render description container if there is none', () => {
    const descriptionSchema = {
      ...nestedSchema,
    };
    // make sure there is no description
    delete descriptionSchema.description;

    wrapper = mount(
      <JsonForms
        data={data}
        schema={descriptionSchema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(
      wrapper.find('.MuiToolbar-root .MuiFormHelperText-root').exists()
    ).toBeFalsy();
  });

  it('should have a translation for no data', () => {
    const translate = () => 'Translated';
    const core = initCore(schema, uischema, emptyData);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core, i18n: { translate } }}
      >
        <MaterialArrayLayout
          schema={schema}
          uischema={uischemaOptions.inline}
        />
      </JsonFormsStateProvider>
    );
    const noDataLabel = wrapper.find('div>div>p').text();
    expect(noDataLabel.includes('Translated')).toBeTruthy();
  });

  it('should have a tooltip for add button', () => {
    wrapper = checkTooltip(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find(ArrayLayoutToolbar),
      ArrayTranslationEnum.addTooltip,
      {
        id: 'tooltip-add',
      },
      data
    );
  });
  it('should have a translatable tooltip for add button', () => {
    wrapper = checkTooltipTranslation(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find(ArrayLayoutToolbar),
      {
        id: 'tooltip-add',
      },
      data
    );
  });

  it('should have a tooltip for delete button', () => {
    wrapper = checkTooltip(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      ArrayTranslationEnum.removeTooltip,
      {
        id: 'tooltip-remove',
      },
      data
    );
  });
  it('should have a translatable tooltip for delete button', () => {
    wrapper = checkTooltipTranslation(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      {
        id: 'tooltip-remove',
      },
      data
    );
  });

  it('should have a tooltip for up button', () => {
    wrapper = checkTooltip(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      ArrayTranslationEnum.up,
      {
        id: 'tooltip-up',
      },
      data
    );
  });
  it('should have a translatable tooltip for up button', () => {
    wrapper = checkTooltipTranslation(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      {
        id: 'tooltip-up',
      },
      data
    );
  });

  it('should have a tooltip for down button', () => {
    wrapper = checkTooltip(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      ArrayTranslationEnum.down,
      {
        id: 'tooltip-down',
      },
      data
    );
  });
  it('should have a translatable tooltip for down button', () => {
    wrapper = checkTooltipTranslation(
      nestedSchema,
      uischemaWithSortOption,
      wrapper,
      (wrapper) => wrapper.find('Memo(ExpandPanelRendererComponent)').at(0),
      {
        id: 'tooltip-down',
      },
      data
    );
  });

  it('should render first simple enum property as-is if no translator', () => {
    const lightUiSchema = { ...uiSchemaWithEnumOrOneOfChildLabelProp };
    delete lightUiSchema.options.elementLabelProp;

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      enumSchema,
      lightUiSchema,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('MSG_TYPE_1');
  });

  it('should render first simple enum property as translated child label', () => {
    const lightUiSchema = cloneDeep(uiSchemaWithEnumOrOneOfChildLabelProp);
    delete lightUiSchema.options.elementLabelProp;

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      enumSchema,
      lightUiSchema,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.messageType.MSG_TYPE_1');
  });

  it('should render configured enum child label property as-is if no translator', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      enumSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('MSG_TYPE_1');
  });

  it('should render configured enum child label property as translated label', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      enumSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.messageType.MSG_TYPE_1');
  });

  it('should render first simple oneOf property as-is if no translator', () => {
    const lightUiSchema = cloneDeep(uiSchemaWithEnumOrOneOfChildLabelProp);
    delete lightUiSchema.options.elementLabelProp;

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      oneOfSchema,
      lightUiSchema,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('MSG_TYPE_1');
    expect(getChildLabel(wrapper, 1)).toBe('Second message type');
  });

  it('should render first simple oneOf property as translated child label', () => {
    const lightUiSchema = cloneDeep(uiSchemaWithEnumOrOneOfChildLabelProp);
    delete lightUiSchema.options.elementLabelProp;

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      oneOfSchema,
      lightUiSchema,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.messageType.MSG_TYPE_1');
  });

  it('should render configured oneOf child label property as-is if no translator', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      oneOfSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('MSG_TYPE_1');
    expect(getChildLabel(wrapper, 1)).toBe('Second message type');
  });

  it('should render configured oneOf child label property as translated label', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      oneOfSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.messageType.MSG_TYPE_1');
    expect(getChildLabel(wrapper, 1)).toBe(
      'translator.messageType.Second message type'
    );
  });

  it('should render configured deep enum child label property as-is if no translator', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      deepEnumOrOneOfData,
      deepEnumOrOneOfSchema,
      deepUiSchemaWithEnumChildLabelProp,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('WRITER');
    expect(getChildLabel(wrapper, 1)).toBe('AUTHOR');
  });

  it('should render configured deep enum child label property as translated label', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      deepEnumOrOneOfData,
      deepEnumOrOneOfSchema,
      deepUiSchemaWithEnumChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe(
      'translator.article.comments.author.type.WRITER'
    );
    expect(getChildLabel(wrapper, 1)).toBe(
      'translator.article.comments.author.type.AUTHOR'
    );
  });

  it('should render configured deep oneOf child label property as-is if no translator', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      deepEnumOrOneOfData,
      deepEnumOrOneOfSchema,
      deepUiSchemaWithOneOfChildLabelProp,
      undefined
    );

    expect(getChildLabel(wrapper, 0)).toBe('ROLE_1');
    expect(getChildLabel(wrapper, 1)).toBe('Second role');
  });

  it('should render configured deep oneOf child label property as translated label', () => {
    wrapper = arrayLayoutWrapper(
      wrapper,
      deepEnumOrOneOfData,
      deepEnumOrOneOfSchema,
      deepUiSchemaWithOneOfChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe(
      'translator.article.comments.author.role.ROLE_1'
    );
    expect(getChildLabel(wrapper, 1)).toBe(
      'translator.article.comments.author.role.Second role'
    );
  });

  it('should render configured enum child label property with schema i18n as translated label', () => {
    const i18nSchema = cloneDeep(enumSchema);
    const properties = (i18nSchema.items as JsonSchema7).properties;
    const childSchema = properties.messageType as i18nJsonSchema;
    childSchema.i18n = 'myI18n';

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      i18nSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.myI18n.MSG_TYPE_1');
  });

  it('should render configured oneOf child label property with schema i18n as translated label', () => {
    const i18nSchema = cloneDeep(oneOfSchema);
    const properties = (i18nSchema.items as JsonSchema7).properties;
    const oneOfArray = properties.messageType.oneOf;
    for (const oneOfValue of oneOfArray) {
      (oneOfValue as i18nJsonSchema).i18n = 'myI18n_' + oneOfValue.const;
    }

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      i18nSchema,
      uiSchemaWithEnumOrOneOfChildLabelProp,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.myI18n_MSG_TYPE_1');
    expect(getChildLabel(wrapper, 1)).toBe('translator.myI18n_MSG_TYPE_2');
  });

  it('should render configured enum child label property with UiSchema i18n as translated label', () => {
    const i18nUiSchema = cloneDeep(uiSchemaWithEnumOrOneOfChildLabelProp);
    const elements = i18nUiSchema.options.detail.elements as ControlElement[];
    const control = elements.find(
      (e) => e.scope === '#/properties/messageType'
    );
    control.i18n = 'myI18n';

    wrapper = arrayLayoutWrapper(
      wrapper,
      enumOrOneOfData,
      enumSchema,
      i18nUiSchema,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.myI18n.MSG_TYPE_1');
  });

  it('should render configured deep enum child label property with UiSchema i18n as translated label', () => {
    const i18nUiSchema = cloneDeep(deepUiSchemaWithEnumChildLabelProp);
    const elements = i18nUiSchema.options.detail.elements as ControlElement[];
    const control = elements.find(
      (e) => e.scope === '#/properties/author/properties/type'
    );
    control.i18n = 'myI18n';

    wrapper = arrayLayoutWrapper(
      wrapper,
      deepEnumOrOneOfData,
      deepEnumOrOneOfSchema,
      i18nUiSchema,
      testTranslator
    );

    expect(getChildLabel(wrapper, 0)).toBe('translator.myI18n.WRITER');
    expect(getChildLabel(wrapper, 1)).toBe('translator.myI18n.AUTHOR');
  });
});

function arrayLayoutWrapper(
  wrapper: ReactWrapper<any, any>,
  data: any,
  schema: JsonSchema7,
  uiSchema: ControlElement,
  translator: Translator
) {
  const core = initCore(schema, uiSchema, data);

  wrapper = mount(
    <JsonFormsStateProvider
      initState={{
        renderers: materialRenderers,
        core,
        i18n: translator ? { translate: translator } : undefined,
      }}
    >
      <MaterialArrayLayout schema={schema} uischema={uiSchema} />
    </JsonFormsStateProvider>
  );

  expect(wrapper.find(MaterialArrayLayout).length).toBeTruthy();
  return wrapper;
}
