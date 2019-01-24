import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { Component, ViewChild } from '@angular/core';
import {
  composeWithUi,
  ControlElement,
  Generate,
  JsonFormsState,
  JsonSchema,
  RankedTester,
  rankWith,
  resolveSchema,
  toDataPath,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { Nav, Platform } from 'ionic-angular';
import { NgRedux } from '@angular-redux/store';
import { MasterPage } from './pages/master/master';
import { DetailPage } from './pages/detail/detail';
import { removeSchemaKeywords } from '../../common';

export interface MasterItem {
  label: string;
  data: any;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

const isMasterPage = (page: any) => {
  return page !== undefined && page.component === MasterPage;
};

@Component({
  selector: 'jsonforms-master-detail',
  template: `
    <ion-split-pane (ionChange)="onSplitPaneChange($event)">
      <ion-nav
        [root]="masterPage"
        [rootParams]="masterParams"
        #masterNav
      ></ion-nav>
      <ion-nav
        [root]="detailPage"
        [rootParams]="detailParams"
        #detailNav
        main
      ></ion-nav>
    </ion-split-pane>
  `
})
export class ListWithDetailControl extends JsonFormsControl {
  @ViewChild('masterNav') masterNav: Nav;
  @ViewChild('detailNav') detailNav: Nav;
  masterPage: any;
  detailPage: any;
  masterItems: MasterItem[];
  masterParams: any;
  detailParams: any;
  _isSplit: boolean;

  constructor(private platform: Platform, ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
    this.masterPage = MasterPage;
    this.detailPage = DetailPage;
  }

  ngOnInit() {
    this.subscription = this.ngRedux
      .select()
      .subscribe((state: JsonFormsState) => {
        const { data, schema, uischema } = this.mapToProps(state);
        const controlElement = uischema as ControlElement;
        const instancePath = toDataPath(`${controlElement.scope}/items`);
        const resolvedSchema = resolveSchema(
          schema,
          `${controlElement.scope}/items`
        );
        const detailUISchema =
          controlElement.options.detail ||
          Generate.uiSchema(resolvedSchema, 'VerticalLayout');
        const masterItems = data.map((d: any, index: number) => {
          const labelRefInstancePath = removeSchemaKeywords(
            controlElement.options.labelRef
          );
          const masterItem: MasterItem = {
            label: get(d, labelRefInstancePath),
            data: d,
            path: `${instancePath}.${index}`,
            schema: resolvedSchema,
            uischema: detailUISchema
          };
          return masterItem;
        });

        this._isSplit = this.platform.width() > 768;

        if (
          this.masterItems === undefined ||
          this.masterItems.length !== masterItems.length
        ) {
          this.masterItems = masterItems;
          this.masterParams = {
            items: this.masterItems,
            path: composeWithUi(this.uischema as ControlElement, this.path),
            uischema: this.uischema,
            schema: this.schema,
            pushDetail: this.updateDetail
          };
          this.updateMaster();
        } else if (this.masterItems !== undefined) {
          const currentLabels = this.masterItems.map(item => item.label);
          const nextLabels = masterItems.map((item: MasterItem) => item.label);
          if (!isEqual(currentLabels, nextLabels)) {
            this.masterParams.items.forEach((item: MasterItem, idx: number) => {
              if (item.label !== nextLabels[idx]) {
                item.label = nextLabels[idx];
              }
            });
          }
        }
      });

    // show master page initially if not split
    this._isSplit = this.platform.width() > 768;
    if (!this._isSplit) {
      this.detailPage = MasterPage;
      this.detailParams = this.masterParams;
    }
  }

  onSplitPaneChange = (event: any) => {
    this._isSplit = event._visible;
    if (this.masterNav && this.detailNav) {
      this._isSplit ? this.showDetail() : this.hideDetail();
    }
  };

  showDetail = (): Promise<any> => {
    const activeDetailView = this.detailNav.getActive();

    return this.detailNav.popToRoot({ animate: false }).then(() => {
      if (isMasterPage(activeDetailView)) {
        // set empty detail
        return this.detailNav.setRoot(DetailPage);
      } else if (activeDetailView !== undefined) {
        // update detail, such that navbar in detail disappears
        return this.updateDetail(activeDetailView.data.item).then(() =>
          this.updateMaster()
        );
      }
    });
  };

  hideDetail = (): Promise<any> => {
    const activeDetailView = this.detailNav.getActive();
    const activeMasterView = this.masterNav.getActive();

    // set master as root on detail nav
    return this.detailNav
      .setRoot(activeMasterView.component, activeMasterView.data, {
        animate: false
      })
      .then(() => {
        if (activeDetailView.data.item && activeDetailView.data.item.path) {
          // update detail, such that navbar in detail appears
          return this.updateDetail(activeDetailView.data.item);
        }
      });
  };

  updateMaster = () => {
    if (this._isSplit) {
      this.masterNav.setRoot(MasterPage, this.masterParams, { animate: false });
    } else {
      this.detailNav.setRoot(MasterPage, this.masterParams, { animate: false });
    }
  };

  updateDetail = (item: any) => {
    const params = {
      item: {
        ...item,
        isSplit: this._isSplit,
        goBack: this.goBack
      }
    };
    if (!this._isSplit) {
      // push such that we have a back button
      return this.detailNav.push(DetailPage, params, { animate: false });
    } else {
      return this.detailNav.setRoot(DetailPage, params, { animate: false });
    }
  };

  goBack = () => {
    if (!this._isSplit) {
      this.detailNav.pop();
    }
  };
}

export const listWithDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
