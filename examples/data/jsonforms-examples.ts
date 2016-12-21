import 'angular';
import array from './array.data';
import async from './async.data';
import category from './category.data';
import custom from './custom.data';
import generateschema from './generate-schema.data';
import generateuischema from './generate-uischema.data';
import layouts from './layouts.data';
import masterdetail from './masterdetail.data';
import person from './person.data';
import resolve from './resolve.data';
import rule from './rule.data';

export default angular.module('jsonforms-examples', [
  array,
  async,
  category,
  custom,
  generateschema,
  generateuischema,
  layouts,
  masterdetail,
  person,
  resolve,
  rule
]).name;
