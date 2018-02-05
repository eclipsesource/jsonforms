import { Component, InjectionToken, Input, OnInit, Type } from 'angular/core';
import { NgComponentOutlet } from '@angular/common';
import { JsonFormsInitialState, RankedTester } from '@jsonforms/core';
import { UnknownRenderer } from './Unknown.component';

export const FORM_RENDERER = new InjectionToken<RendererDefinition>('RendererDefinition');
export interface RendererDefinition {
  renderer: Type;
  tester: RankedTester;
}

@Component({
  selector: 'jsonforms-outlet',
  template: '<ng-container *ngComponentOutlet="bestComponent"></ng-container>'
})
export class JsonFormsOutlet implements OnInit {
  @Input('state') private _state: JsonFormsInitialState;
  private bestComponent: Type;

  constructor(@Inject(FORM_RENDERER) private _renderers: RendererDefinition[]) {
    // bla
  }

  ngOnInit(): void {
    const renderer = this._renderers
      .map(r => this.mapToValue(r))
      .reduce((acc, r) => r.value > acc.value ? r : acc, {renderer: UnknownRenderer, value: 0});
    this.bestComponent = renderer.renderer;

  }
  private mapToValue (r: RendererDefinition): {renderer: Type, value: number} {
    return {renderer: r.renderer, value: r.tester(this._state.uischema, this._state.schema) };
  }
}
