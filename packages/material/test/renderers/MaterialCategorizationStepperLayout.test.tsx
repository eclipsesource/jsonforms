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
  Layout,
  layoutDefaultProps,
  RuleEffect,
  SchemaBasedCondition,
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Enzyme, { mount } from 'enzyme';

import MaterialCategorizationStepperLayoutRenderer, {
  materialCategorizationStepperTester
} from '../../src/layouts/MaterialCategorizationStepperLayout';
import { MaterialLayoutRenderer, materialRenderers } from '../../src';
import { Button, Step, StepButton, Stepper } from '@material-ui/core';
import Adapter from 'enzyme-adapter-react-16';
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

describe('Material categorization stepper layout tester', () => {
  it('should not fail when given undefined data', () => {
    expect(materialCategorizationStepperTester(undefined, undefined)).toBe(-1);
    expect(materialCategorizationStepperTester(null, undefined)).toBe(-1);
    expect(
      materialCategorizationStepperTester({ type: 'Foo' }, undefined)
    ).toBe(-1);
    expect(
      materialCategorizationStepperTester({ type: 'Categorization' }, undefined)
    ).toBe(-1);
  });

  it('should not fail with null elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: null
    };
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
  });

  it('should not fail with empty elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: []
    };
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
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
    expect(materialCategorizationStepperTester(uischema, undefined)).toBe(-1);
  });

  it('should not apply to a single category and no schema', () => {
    const categorization = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category'
        }
      ]
    };
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(
      -1
    );
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
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(
      -1
    );
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
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(
      -1
    );
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

    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(
      -1
    );
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
    expect(materialCategorizationStepperTester(categorization, undefined)).toBe(
      -1
    );
  });
});

describe('Material categorization stepper layout', () => {
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
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const steps = wrapper.find(Step);
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
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const beforeClick = wrapper.find(Stepper).props().activeStep;
    wrapper
      .find(StepButton)
      .at(1)
      .simulate('click');
    const afterClick = wrapper.find(Stepper).props().activeStep;

    expect(beforeClick).toBe(0);
    expect(afterClick).toBe(1);
    wrapper.unmount();
  });

  it('can be hidden via ownProp', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Stepper).exists()).toBeFalsy();
    wrapper.unmount();
  });

  it('is shown by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Stepper).exists()).toBeTruthy();
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
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(Step).length).toBe(1);
    wrapper.unmount();
  });

  it('should have renderers prop via ownProps', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderers: any[] = [];
    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={fixture.uischema}
          renderers={renderers}
        />
      </JsonFormsStateProvider>
    );

    const materialArrayLayout = wrapper.find(MaterialLayoutRenderer);
    expect(materialArrayLayout.props().renderers).toHaveLength(0);
  });

  it('should render nav buttons if showNavButtons is set', () => {
    const nameControl: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      options: {
        showNavButtons: true
      },
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl, nameControl]
        },
        {
          type: 'Category',
          label: 'C',
          elements: undefined
        }
      ]
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const isPrevButtonEnabledBeforeClick = !wrapper.find(Button).at(1).props().disabled;
    const isNextButtonEnabledBeforeClick = !wrapper.find(Button).at(0).props().disabled;
    wrapper
      .find(StepButton)
      .at(1)
      .simulate('click');
    const isPrevButtonEnabledAfterClick = !wrapper.find(Button).at(1).props().disabled;
    const isNextButtonEnabledAfterClick = !wrapper.find(Button).at(0).props().disabled;

    expect(isPrevButtonEnabledBeforeClick).toBeFalsy();
    expect(isNextButtonEnabledBeforeClick).toBeTruthy();
    expect(isPrevButtonEnabledAfterClick).toBeTruthy();
    expect(isNextButtonEnabledAfterClick).toBeFalsy();
    wrapper.unmount();
  });

  it('should render new category on button click', () => {
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
      options: {
        showNavButtons: true
      },
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
    const core = initCore(fixture.schema, uischema, fixture.data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
          {...layoutDefaultProps}
          schema={fixture.schema}
          uischema={uischema}
        />
      </JsonFormsStateProvider>
    );
    const activeStepBeforeClick = wrapper.find(Stepper).props().activeStep;
    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    const activeStepAfterClick = wrapper.find(Stepper).props().activeStep;

    expect(activeStepBeforeClick).toBe(0);
    expect(activeStepAfterClick).toBe(1);
    wrapper.unmount();
  });

  it('nav button behavior after hiding a step', () => {
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
      label: 'Root',
      options: {
          showNavButtons: true
      },
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl]
        },
        {
          type: 'Category',
          label: 'C',
          elements: undefined,
          rule: {
            effect: RuleEffect.SHOW,
            condition
          }
        }
      ]
    };

    const core = initCore(fixture.schema, uischema, data);

    const wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: materialRenderers, core }}>
        <MaterialCategorizationStepperLayoutRenderer
            {...layoutDefaultProps}
            schema={fixture.schema}
            uischema={uischema}
        />
      </JsonFormsStateProvider>
    );

    const isNextButtonDisabledBeforeTextInput = wrapper.find(Button).at(0).props().disabled;

    expect(isNextButtonDisabledBeforeTextInput).toBe(false);

    core.data = { ...core.data, name: 'Barr' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core }} );
    wrapper.update();

    const isNextButtonDisabledAfterTextInput = wrapper.find(Button).at(0).props().disabled;

    expect(isNextButtonDisabledAfterTextInput).toBe(true);

    wrapper.unmount();
  });
});
