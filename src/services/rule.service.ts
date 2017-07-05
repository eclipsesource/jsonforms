import {JsonFormService, JsonFormsServiceElement} from '../core';
import {DataChangeListener, DataService} from '../core/data.service';
import {Runtime} from '../core/runtime';
import {JsonSchema} from '../models/jsonSchema';
import {
  ControlElement, Layout, LeafCondition, RuleEffect, UISchemaElement
} from '../models/uischema';
import {getValuePropertyPair} from '../path.util';

/**
 * Service that evaluates all rules upon a data change.
 */
@JsonFormsServiceElement({})
export class JsonFormsRuleService implements DataChangeListener, JsonFormService {
  private pathToControlMap: {[path: string]: UISchemaElement[]} = {};

  /**
   * Constructor.
   *
   * @param {DataService} dataService the data service
   * @param {JsonSchema} dataSchema the JSON schema describing the data
   * @param {UISchemaElement} uiSchema the UI schema to be rendered
   */
  constructor(private dataService: DataService, dataSchema: JsonSchema, uiSchema: UISchemaElement) {
    dataService.registerDataChangeListener(this);
    this.parseRules(uiSchema);
  }

  /**
   * @inheritDoc
   */
  needsNotificationAbout(uischema: ControlElement): boolean {
    // TODO hack
    if (uischema === null) {
      return true;
    }

    return this.pathToControlMap.hasOwnProperty(uischema.scope.$ref);
  }

  /**
   * @inheritDoc
   */
  dataChanged(uischema: ControlElement, newValue: any, data: any): void {
    if (uischema === null) {
      this.initialRun(data);

      return;
    }
    const elements = this.pathToControlMap[uischema.scope.$ref];
    elements.forEach(element => {
      this.evaluate(element, data);
    });
  }

  /**
   * @inheritDoc
   */
  dispose(): void {
    this.dataService.deregisterDataChangeListener(this);
  }

  private parseRules(uiSchema: UISchemaElement) {
    if (uiSchema.hasOwnProperty('rule')) {
      const ref = (uiSchema.rule.condition as LeafCondition).scope.$ref;
      if (!this.pathToControlMap.hasOwnProperty(ref)) {
        this.pathToControlMap[ref] = [];
      }
      this.pathToControlMap[ref].push(uiSchema);
    }
    if (uiSchema.hasOwnProperty('elements')) {
      (uiSchema as Layout).elements.forEach(element => {
        this.parseRules(element);
      });
    }
  }

  private evaluate(uiSchema: UISchemaElement, data: any) {
    // TODO condition evaluation should be done somewhere else
    const condition = uiSchema.rule.condition as LeafCondition;
    const ref = condition.scope.$ref;
    const pair = getValuePropertyPair(data, ref);
    const value = pair.instance[pair.property];
    const equals = value === condition.expectedValue;
    if (!uiSchema.hasOwnProperty('runtime')) {
      uiSchema.runtime = new Runtime();
    }
    const runtime = uiSchema.runtime as Runtime;
    switch (uiSchema.rule.effect) {
      case RuleEffect.HIDE: runtime.visible = !equals; break;
      case RuleEffect.SHOW: runtime.visible = equals; break;
      case RuleEffect.DISABLE: runtime.enabled = !equals; break;
      case RuleEffect.ENABLE: runtime.enabled = equals; break;
      default:
    }
  }

  private initialRun = (data: any) => {
    Object.keys(this.pathToControlMap).forEach(
      key => {
        this.pathToControlMap[key].forEach(uischema => {
          this.evaluate(uischema, data);
        });
      }
    );
  }
}
