export const userView = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name'
        },
        {
          type: 'Control',
          scope: '#/properties/birthday'
        }
      ]
    },
    {
      type: 'Control',
      scope: '#/properties/nationality'
    }
  ]
};

export const userGroupView = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/label'
    }
  ]
};

export const taskView = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/done'
        },
        {
          type: 'Control',
          scope: '#/properties/dueDate'
        }
      ]
    },
    {
      type: 'Control',
      scope: '#/properties/priority'
    }
  ]
};
