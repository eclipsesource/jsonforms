import { createExampleSelection } from './example';
import './templates/arrays';
import './templates/day2';
import './templates/day4';
import './templates/day5';
import './templates/day6';
import './templates/generate';
import './templates/generate-ui';
import './templates/layout';
import './templates/person';
import './templates/rule';
import './templates/dynamic';
import './templates/dynamic2';
import './templates/categorization';
import './templates/masterdetail';
import './templates/resolve';
import './templates/uischema-registry';
import './templates/ecore';

import '../src/renderers/materialized';
import { materialize } from '../src/renderers/materialized/index';
declare let $;

window.onload = ev => {
  const selectExampleElement = createExampleSelection();
  materialize();
  $('select').material_select();
};
