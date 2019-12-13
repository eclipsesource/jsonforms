import {
  JsonFormsState,
  RankedTester,
  UISchemaElement,
  JsonFormsSubStates,
  coreReducer,
  JsonFormsRendererRegistryEntry
} from '@jsonforms/core';
import { BehaviorSubject, Subscription, PartialObserver } from 'rxjs';
import { JsonFormsBaseRenderer } from './base.renderer';
import {
  ValidCoreActions,
  ValidLocaleActions,
  ValidUISchemaReducerActions
} from '@jsonforms/core';
import { cloneDeep } from 'lodash';
import { Injectable } from '@angular/core';
import { i18nReducer } from '@jsonforms/core/lib/reducers/i18n';
import { uischemaRegistryReducer } from '@jsonforms/core/lib/reducers/uischemas';

@Injectable({
  providedIn: 'root'
})
export class JSONFormsAngularService {
  private _state: JsonFormsSubStates;
  private state: BehaviorSubject<JsonFormsState>;

  init(initialState: JsonFormsSubStates = {}) {
    this._state = initialState;
    this.state = new BehaviorSubject({ jsonforms: this._state });
  }

  subscribe(observer: PartialObserver<JsonFormsState>): Subscription {
    if (!this.state) {
      this.init();
    }
    return this.state.subscribe(observer);
  }

  registerRenderer(
    renderer: JsonFormsBaseRenderer<UISchemaElement>,
    tester: RankedTester
  ): void {
    this._state.renderers.push({ renderer, tester });
    this.updateSubject();
  }
  registerRenderers(renderers: JsonFormsRendererRegistryEntry[]): void {
    this._state.renderers = renderers;
    this.updateSubject();
  }

  unregisterRenderer(tester: RankedTester): void {
    const findIndex = this._state.renderers.findIndex(v => v.tester === tester);
    if (findIndex === -1) {
      return;
    }
    const renderers = this._state.renderers.filter(v => v.tester !== tester);
    this._state.renderers = renderers;
    this.updateSubject();
  }

  updateLocale<T extends ValidLocaleActions>(localeAction: T): T {
    const localeState = i18nReducer(this._state.i18n, localeAction);
    this._state.i18n = localeState;
    this.updateSubject();
    return localeAction;
  }

  updateCore<T extends ValidCoreActions>(coreAction: T): T {
    const coreState = coreReducer(this._state.core, coreAction);
    this._state.core = coreState;
    this.updateSubject();
    return coreAction;
  }

  updateUiSchema<T extends ValidUISchemaReducerActions>(uischemaAction: T): T {
    const uischemaState = uischemaRegistryReducer(
      this._state.uischemas,
      uischemaAction
    );
    this._state.uischemas = uischemaState;
    this.updateSubject();
    return uischemaAction;
  }

  getState(): JsonFormsState {
    return cloneDeep({ jsonforms: this._state });
  }

  private updateSubject(): void {
    this.state.next({ jsonforms: this._state });
  }
}
