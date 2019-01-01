import * as _ from 'lodash';
import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { Subscription } from 'rxjs/Subscription';
import {
  isVisible,
  JsonFormsState,
  LabelElement,
  OwnPropsOfRenderer,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
@Component({
  selector: 'LabelRenderer',
  template: `
    <label class="mat-title" fxFlex> {{ label }} </label>
  `
})
export class LabelRenderer extends JsonFormsBaseRenderer {
  label: string;
  visible: boolean;

  private subscription: Subscription;

  constructor(private ngRedux: NgRedux<JsonFormsState>) {
    super();
  }
  ngOnInit() {
    const labelElement = this.uischema as LabelElement;
    this.label =
      labelElement.text !== undefined &&
      labelElement.text !== null &&
      labelElement.text;
    this.subscription = this.ngRedux
      .select()
      .map((s: JsonFormsState) => mapStateToProps(s, this.getOwnProps()))
      .subscribe(props => {
        this.visible = props.visible;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  mapAdditionalProps() {
    this.label = (this.uischema as LabelElement).text;
  }
}

const mapStateToProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfRenderer
) => {
  const visible = _.has(ownProps, 'visible')
    ? ownProps.visible
    : isVisible(ownProps, state);

  return {
    visible
  };
};

export const LabelRendererTester: RankedTester = rankWith(4, uiTypeIs('Label'));
