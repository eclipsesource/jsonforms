import * as _ from 'lodash';
import {JsonFormsHolder} from '../src/core';
import {changeExample} from './example';
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
};

const bootstrap = () => {
  enableLink('bootstrap');
  JsonFormsHolder.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'btn-primary']
    },
    {
      name: 'select',
      classNames: ['custom-select']
    },
  ]);
  $('select').attr('class', JsonFormsHolder.stylingRegistry.getAsClassName('select'));
};

const material = () => {
  enableLink('materialize');
  JsonFormsHolder.stylingRegistry.register(
      'button',
      ['btn', 'waves-effect', 'waves-light']
  );
  JsonFormsHolder.stylingRegistry.unregister('select');
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

  changeStyle('none');
};
