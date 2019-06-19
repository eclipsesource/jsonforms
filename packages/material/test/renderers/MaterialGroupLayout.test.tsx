import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MaterialGroupLayout from '../../src/layouts/MaterialGroupLayout';
import { MaterialLayoutRenderer } from '../../src/util/layout';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your name'
    },
    birthDate: {
      type: 'string',
      format: 'date',
      description: 'Please enter your birth date.'
    }
  }
};

const uischema = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate'
    }
  ]
};

describe('Material group layout', () => {
  it('should render a GroupComponent with direction column when given no direction LayoutProp', () => {
    const wrapper = mount(<MaterialGroupLayout schema={schema} uischema={uischema} />)
    expect(wrapper.find(MaterialLayoutRenderer).props().direction).toBe('column')
  })

  it('should render a GroupComponent with direction row when this is provided as a direction prop', () => {
    const wrapper = mount(<MaterialGroupLayout schema={schema} uischema={uischema} direction={'row'} />)
    expect(wrapper.find(MaterialLayoutRenderer).props().direction).toBe('row')
  })
})
