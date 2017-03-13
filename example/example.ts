/// <reference path="html-import.d.ts" />
import personTemplate from './templates/person.html';
import layoutTemplate from './templates/layout.html';
import ruleTemplate from './templates/rule.html';
import generateUiTemplate from './templates/generate-ui.html';
import generateTemplate from './templates/generate.html';
import arraysTemplate from './templates/arrays.html';
import day2 from './templates/day2.html';
import day4 from './templates/day4.html';

window.onload = (ev) => {
  addTemplate('person', personTemplate);
  addTemplate('layout', layoutTemplate);
  addTemplate('rule', ruleTemplate);
  addTemplate('generate-ui', generateUiTemplate);
  addTemplate('generate', generateTemplate);
  addTemplate('arrays', arraysTemplate);
  addTemplate('day2', day2);
  addTemplate('day4', day4);

  window['changeExample']();
};
function addTemplate(id: string, template: string): void {
  const body = document.getElementsByTagName('body')[0];
  const wrapper = document.createElement('template');
  wrapper.id = id;
  wrapper.innerHTML = template;
  body.appendChild(wrapper);
}
