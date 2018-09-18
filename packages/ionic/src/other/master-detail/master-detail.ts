import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import {
  ControlElement,
  Generate,
  JsonFormsState,
  RankedTester,
  rankWith,
  resolveSchema,
  toDataPath,
  uiTypeIs,
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { Nav, Platform } from 'ionic-angular';
import { MasterDetailNavService } from './master-detail-nav.service';
import { MasterPage } from './pages/master/master';
import { removeSchemaKeywords } from '../../common';
import { NgRedux } from '@angular-redux/store';
import { DetailPage } from './pages/detail/detail';

@Component({
  selector: 'jsonforms-master-detail',
  template: `
      <ion-split-pane (ionChange)="onSplitPaneChange($event)">
          <ion-nav [root]="masterPage" #masterNav ></ion-nav>
          <ion-nav [root]="detailPage" #detailNav main></ion-nav>
      </ion-split-pane>
  `
})
export class MasterDetailComponent extends JsonFormsControl {

  @ViewChild('masterNav') masterNav: Nav;
  @ViewChild('detailNav') detailNav: Nav;

  private masterItems: any[];

  constructor(
    private parentNav: Nav,
    private platform: Platform,
    ngRedux: NgRedux<JsonFormsState>,
    private masterDetailService: MasterDetailNavService
  ) {
    super(ngRedux);
  }

  ngOnInit() {

    this.masterDetailService.masterNav = this.masterNav;
    this.masterDetailService.detailNav = this.detailNav;
    this.masterDetailService.parentNav = this.parentNav;

    const state$ = this.ngRedux.select().map(this.mapToProps(this.getOwnProps()));
    this.subscription = state$.subscribe(state => {

      const controlElement = state.uischema as ControlElement;
      const labelRefInstancePath = removeSchemaKeywords(controlElement.options.labelRef);
      const instancePath = toDataPath(`${controlElement.scope}/items`);
      const resolvedSchema = resolveSchema(state.schema, `${controlElement.scope}/items`);
      const detailUISchema = controlElement.options.detail ||
        Generate.uiSchema(resolvedSchema, 'VerticalLayout');

      this.masterItems = state.data.map((d, index) => {
        return {
          label: _.get(d, labelRefInstancePath),
          data: d,
          path: `${instancePath}.${index}`,
          schema: resolvedSchema,
          uischema: detailUISchema
        };
      });
    });

    this.masterDetailService.masterNav.setRoot(
      MasterPage,
      {
        addToNavStack: true,
        items: this.masterItems
      }
    );

    this.detailNav.setRoot(
      DetailPage,
      {
        addToNavStack: true,
        // TODO: must have items
        item: this.masterItems[0]
      }
    );

    if (this.platform.width() < 768) {
      this.masterDetailService.useParentNav = true;
      this.parentNav.push(
        MasterPage,
        {
          addToNavStack: true,
          items: this.masterItems
        }
      );
    } else {
      this.masterDetailService.useParentNav = false;
    }
  }

  onSplitPaneChange(event) {
    const isDetailVisible = event._visible;
    this.masterDetailService.onDetailVisibilityChanged(isDetailVisible, this.parentNav);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export const masterDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('FlatMasterDetail')
);
