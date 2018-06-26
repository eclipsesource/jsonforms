import {  Input, OnDestroy, OnInit } from '@angular/core';
import { JsonFormsState, mapStateToLayoutProps } from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';

export class JsonFormsIonicLayout extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

  @Input() path: string;
  protected subscription;
  protected elements;

  constructor(protected ngRedux: NgRedux<JsonFormsState>) {
    super();
  }

  connectLayoutToJsonForms = (store, ownProps) => {
    return store.select().map(state => {
      return mapStateToLayoutProps(state, ownProps);
    });
  }

  ngOnInit() {
    const ownProps = {
      ...this.getOwnProps(),
      path: this.path
    };
    const state$ = this.connectLayoutToJsonForms(this.ngRedux, ownProps);
    this.subscription = state$.subscribe(state => {
      this.elements = state.uischema.elements;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
