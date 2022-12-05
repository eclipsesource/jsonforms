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
import React from 'react';
import {
  Categorization,
  ControlElement,
  createAjv,
  defaultJsonFormsI18nState,
  Layout,
  layoutDefaultProps,
  RuleEffect,
  SchemaBasedCondition
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Enzyme, { mount } from 'enzyme';

import MaterialCategorizationLayoutRenderer, {
  materialCategorizationTester
} from '../../src/layouts/MaterialCategorizationLayout';
import { MaterialLayoutRenderer, materialRenderers } from '../../src';
import { Tab, Tabs } from '@mui/material';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  data: {},
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  },
  uischema: {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'B'
      }
    ]
  }
};

const testDefaultProps = {
  ...layoutDefaultProps,
  data: fixture.data,
  ajv: createAjv(),
  t: defaultJsonFormsI18nState.translate,
  locale: defaultJsonFormsI18nState.locale
}

describe('Material categorization layout tester', () => {
  it('should not fail when given undefined data', () => {
    expect(materialCategorizationTester(undefined, undefined, undefined)).toBe(-1);
    expect(materialCategorizationTester(null, undefined, undefined)).toBe(-1);
    expect(materialCategorizationTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(
      materialCategorizationTester({ type: 'Categorization' }, undefined, undefined)
    ).toBe(-1);
  });

  it('should not fail with null elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: null
    };
    expect(materialCategorizationTester(uischema, undefined, undefined)).toBe(-1);
  });

  it('should succeed with empty elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: []
    };
    expect(materialCategorizationTester(uischema, undefined, undefined)).toBe(1);
  });

  it('should not fail tester with single unknown element and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Foo'
        }
      ]
    };
    expect(materialCategorizationTester(uischema, undefined, undefined)).toBe(-1);
  });

  it('should succeed with a single category and no schema', () => {
    const categorization = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category'
        }
      ]
    };
    expect(materialCategorizationTester(categorization, undefined, undefined)).toBe(1);
  });

  it('should not apply to a nested categorization with single category and no schema', () => {
    const nestedCategorization: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category'
        }
      ]
    };
    const categorization: Layout = {
      type: 'Categorization',
      elements: [nestedCategorization]
    };
    expect(materialCategorizationTester(categorization, undefined, undefined)).toBe(-1);
  });

  it('should not apply to nested categorizations without categories and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization'
        }
      ]
    };
    expect(materialCategorizationTester(categorization, undefined, undefined)).toBe(-1);
  });

  it('should not apply to a nested categorization with null elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          label: 'Test',
          elements: null
        }
      ]
    };

    expect(materialCategorizationTester(categorization, undefined, undefined)).toBe(-1);
  });

  it('should not apply to a nested categorizations with empty elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          elements: []
        }
      ]
    };
    expect(materialCategorizationTester(categorization, undefined, undefined)).toBe(-1);
  });
});

describe('Material categorization layout', () => {
  it('should render', () => {
    const nameControl = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        {
          type: 'Categorization',
          label: 'Bar',
          elements: [
            {
              type: 'Category',
              label: 'A',
              elements: [nameControl]
            }
          ]
        },
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl]
        }
      ]
    };

    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const steps = wrapper.find(Tab);
    expect(steps.length).toBe(2);
    wrapper.unmount();
  });

  it('should render on click', () => {
    const data = { name: 'Foo' };
    const nameControl: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const innerCategorization: Categorization = {
      type: 'Categorization',
      label: 'Bar',
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: [nameControl]
        }
      ]
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        innerCategorization,
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl, nameControl]
        },
        {
          type: 'Category',
          label: 'C',
          elements: undefined
        },
        {
          type: 'Category',
          label: 'D',
          elements: null
        }
      ]
    };
    const core = initCore(fixture.schema, fixture.uischema, data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    const beforeClick = wrapper.find(Tabs).props().value;
    wrapper
      .find('button[role="tab"]')
      .at(1)
      .simulate('click');
    const afterClick = wrapper.find(Tabs).props().value;

    expect(beforeClick).toBe(0);
    expect(afterClick).toBe(1);
    wrapper.unmount();
  });

  it('can be hidden via ownProp', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Tab).exists()).toBeFalsy();
    wrapper.unmount();
  });

  it('is shown by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Tab).exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('allows categories to be hidden', () => {
    const condition: SchemaBasedCondition = {
      scope: '#/properties/name',
      schema: { minLength: 3 }
    };

    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: []
        },
        {
          type: 'Category',
          label: 'B',
          elements: [],
          rule: {
            effect: RuleEffect.HIDE,
            condition
          }
        }
      ]
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Tab).length).toBe(1);
    wrapper.unmount();
  });

  it('should have renderers prop via ownProps', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderers: any[] = [];
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
          {...testDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
          renderers={renderers}
        />
      </JsonFormsStateProvider>
    );

    const materialArrayLayout = wrapper.find(MaterialLayoutRenderer);
    expect(materialArrayLayout.props().renderers).toHaveLength(0);
  });

  it('display correct content when hiding a tab', () => {
    const data = { name : 'fo' };
    const condition: SchemaBasedCondition = {
      scope: '#/properties/name',
      schema: { maxLength: 3 }
    };
    const nameControl: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      options: {
          showNavButtons: true
      },
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: undefined
        },
        {
          type: 'Category',
          label: 'B',
          elements: undefined,
          rule: {
            effect: RuleEffect.SHOW,
            condition: condition
          }
        },
        {
          type: 'Category',
          label: 'C',
          elements: [nameControl],
          rule: {
            effect: RuleEffect.HIDE,
            condition: condition
          }
        }
      ]
    };

    const core = initCore(fixture.schema, uischema, data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationLayoutRenderer
            {...testDefaultProps}
            schema={fixture.schema}
            uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    
    wrapper
      .find('button[role="tab"]')
      .at(1)
      .simulate('click');

    let isCategoryCshown = wrapper.find('input[type="text"]').length > 0;
    expect(isCategoryCshown).toBe(false);

    core.data = { ...core.data, name: 'Barr' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();

    isCategoryCshown = wrapper.find('input[type="text"]').length > 0;
    expect(isCategoryCshown).toBe(true);
    
    wrapper.unmount();
  });
});
