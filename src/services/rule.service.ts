import { UISchemaElement, ControlElement, Layout, LeafCondition, RuleEffect }
  from '../models/uischema';
import { JsonFormsServiceElement, JsonFormService}
  from '../core';
import { JsonSchema } from '../models/jsonSchema';
import { getValuePropertyPair } from '../path.util';
import {Runtime} from '../core/runtime';
import {DataService, DataChangeListener} from '../core/data.service';

@JsonFormsServiceElement({})
class JsonFormsRuleService implements DataChangeListener, JsonFormService {
  private pathToControlMap: {[path: string]: Array<UISchemaElement>} = {};

  constructor(private dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    dataService.registerChangeListener(this);
    this.parseRules(uiSchema);
  }
  isRelevantKey(uischema: ControlElement): boolean {
    // TODO hack
    if (uischema === null) {
      return true;
    }
    return this.pathToControlMap.hasOwnProperty(uischema.scope.$ref);
  }
  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    if (uischema === null) {
      this.initialRun(data);
      return;
    }
    const elements = this.pathToControlMap[uischema.scope.$ref];
    elements.forEach(element => this.evaluate(element, data));
  }
  dispose(): void {
    this.dataService.unregisterChangeListener(this);
  }
  private parseRules(uiSchema: UISchemaElement) {
    if (uiSchema.hasOwnProperty('rule')) {
      const ref = (<LeafCondition>uiSchema.rule.condition).scope.$ref;
      if (!this.pathToControlMap.hasOwnProperty(ref)) {
        this.pathToControlMap[ref] = [];
      }
      this.pathToControlMap[ref].push(uiSchema);
    }
    if (uiSchema.hasOwnProperty('elements')) {
      (<Layout>uiSchema).elements.forEach(element => this.parseRules(element));
    }
  }
  private evaluate(uiSchema: UISchemaElement, data: any) {
    // TODO condition evaluation should be done somewhere else
    const condition = <LeafCondition>uiSchema.rule.condition;
    const ref = condition.scope.$ref;
    const pair = getValuePropertyPair(data, ref);
    const value = pair.instance[pair.property];
    const equals = value === condition.expectedValue;
    if (!uiSchema.hasOwnProperty('runtime')) {
      const runtime = new Runtime();
      uiSchema['runtime'] = runtime;
    }
    const runtime = <Runtime>uiSchema['runtime'];
    switch (uiSchema.rule.effect) {
      case RuleEffect.HIDE: runtime.visible = !equals; break;
      case RuleEffect.SHOW: runtime.visible = equals; break;
      case RuleEffect.DISABLE: runtime.enabled = !equals; break;
      case RuleEffect.ENABLE: runtime.enabled = equals; break;
    }
  }
  private initialRun(data: any) {
    Object.keys(this.pathToControlMap).forEach(
      key => this.pathToControlMap[key].forEach(
        uischema => this.evaluate(uischema, data))
      );
  }
}
