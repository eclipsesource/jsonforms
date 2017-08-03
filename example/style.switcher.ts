import * as _ from 'lodash';
import { JsonForms } from '../src/core';
import { changeExample } from './example';
import { Style } from '../src/core/styling.registry';
import { VNodeRegistry } from '../src/services/vnode.registry';
import { MaterializeDialogHandler } from './material.dialog';
declare let $;

/**
 * Disables all links and only enables the one containing the wanted href.
 * This function assumes that all links are CSS links used for styling purposes.
 *
 * @param wantedHref a substring of the link's href value, which is to be enabled
 */
const enableLink = (wantedHref: string): void => {
  const links = $('link').toArray();
  // disable all links
  _.forEach(links, link => link.disabled = true);
  const wantedLinks = _.filter(links, (link: HTMLLinkElement) => link.href.includes(wantedHref)
  || link.href.includes('dark') || link.href.includes('labelfixed'));
  // enable wanted link
  _.forEach(wantedLinks, wantedLink => {wantedLink.disabled = false; });
};

const none = () => {
  enableLink('example');
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.label',
      classNames: ['control']
    },
    {
      name: 'control.input',
      classNames: ['input']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    },
    {
      name: 'categorization',
      classNames: ['jsf-categorization']
    },
    {
      name: 'categorization.master',
      classNames: ['jsf-categorization-master']
    },
    {
      name: 'categorization.detail',
      classNames: ['jsf-categorization-detail']
    },
    {
      name: 'category.group',
      classNames: ['jsf-category-group']
    },
    {
      name: 'array.layout',
      classNames: ['array-layout']
    },
    {
      name: 'array.children',
      classNames: ['children']
    },
    {
      name: 'group-layout',
      classNames: ['group-layout']
    },
    {
      name: 'horizontal-layout',
      classNames: ['horizontal-layout']
    },
    {
      name: 'vertical-layout',
      classNames: ['vertical-layout']
    },
    {
      name: 'array-table',
      classNames: ['array-table-layout', 'control']
    }
  ]);
};

const bootstrap = () => {
  enableLink('bootstrap');
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'btn-primary']
    },
    {
      name: 'array.button',
      classNames: ['btn', 'btn-primary']
    },
    {
      name: 'select',
      classNames: ['custom-select']
    },
  ]);
  $('select').attr('class', JsonForms.stylingRegistry.getAsClassName('select'));
};

const material = () => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'waves-effect', 'waves-light']
    },
    {
      name: 'array.button',
      classNames: ['btn-floating', 'waves-effect', 'waves-light', 'array-button']
    },
    {
      name: 'array.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.layout',
      classNames: ['z-depth-3']
    },
    {
      name: 'group.label',
      classNames: ['group.label']
    },
    {
      name: 'collection',
      classNames: ['collection']
    },
    {
      name: 'item',
      classNames: ['collection-item']
    },
    {
      name: 'item-active',
      classNames: ['active']
    },
    {
      name: 'horizontal-layout',
      classNames: ['row']
    },
    {
      name: 'json-forms',
      classNames: ['container']
    }
  ]);

  JsonForms.stylingRegistry.register({
    name: 'horizontal-layout-item',
    classNames: childrenSize => {
      console.log('children size is', childrenSize[0]);
      const colSize = Math.floor(12 / childrenSize[0]);

      return ['col', `s${colSize}`];
    }
  } as Style);

  JsonForms.stylingRegistry.register({
    name: 'vertical-layout-item',
    classNames: ['vertical-layout-item']
  });
  JsonForms.stylingRegistry.deregister('select');
  // VNodeRegistry.registerDialogHandler(new MaterializeDialogHandler());

  // init selection combo box
  $('select').material_select();
};

const changeStyle = style => {
  $('select').material_select('destroy');
  if (style === 'bootstrap') {
    bootstrap();
  } else if (style === 'materialize') {
    material();
  } else {
    none();
  }
};

export const createStyleSelection = (selectExampleElement: HTMLSelectElement) => {
  const styleDiv = document.getElementById('style');
  // create select element for selecting style to be applied
  const selectStyle = document.createElement('select');
  ['none', 'bootstrap', 'materialize'].forEach(style => {
    const option = document.createElement('option');
    option.value = style;
    option.label = _.capitalize(style);
    option.text = style;
    selectStyle.appendChild(option);
  });
  selectStyle.onchange = () => {
    changeStyle(selectStyle.value);
    // re-render the easy way
    const currentExample = selectExampleElement.value;
    changeExample(currentExample);
  };
  const styleLabel = document.createElement('label');
  styleLabel.innerText = 'Style';
  styleDiv.appendChild(styleLabel);
  styleDiv.appendChild(selectStyle);

  changeStyle('materialize');
};
