/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { Component, ViewChild } from '@angular/core';
import {
  ArrayControlProps,
  composeWithUi,
  ControlElement,
  Generate,
  JsonFormsState,
  JsonSchema,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
  RankedTester,
  rankWith,
  toDataPath,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core';
import { Platform, IonNav } from '@ionic/angular';
import { NgRedux } from '@angular-redux/store';
import { MasterPage } from './pages/master/master';
import { DetailPage } from './pages/detail/detail';
import { removeSchemaKeywords } from '../../common';
import { JsonFormsArrayControl } from '../../../../angular/src/array-control';

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
export class ListWithDetailControl extends JsonFormsArrayControl {
  @ViewChild('masterNav') masterNav: IonNav;
  @ViewChild('detailNav') detailNav: IonNav;
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
        const detailUISchema =
          controlElement.options.detail ||
          Generate.uiSchema(schema, 'VerticalLayout');
        const masterItems = data.map((d: any, index: number) => {
          const labelRefInstancePath = removeSchemaKeywords(
            controlElement.options.labelRef
          );
          const masterItem: MasterItem = {
            label: get(d, labelRefInstancePath),
            data: d,
            path: `${instancePath}.${index}`,
            schema: schema,
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
            schema: schema,
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

    return this.detailNav.popToRoot({ animated: false }).then(() => {
      if (isMasterPage(activeDetailView)) {
        // set empty detail
        return this.detailNav.setRoot(DetailPage);
      } else if (activeDetailView !== undefined) {
        // TODO: DEPS
        // update detail, such that navbar in detail disappears
       // return this.updateDetail(activeDetailView.data.item).then(() =>
       //   this.updateMaster()
       // );
      }
    });
  };

  hideDetail = (): Promise<any> => {
    // set master as root on detail nav
    return Promise.all(
      [
        this.masterNav.getActive(),
        this.detailNav.getActive()
      ]
    ).then(([activeMasterView, _]) => {
      this.detailNav.setRoot(
        activeMasterView.component,
        activeMasterView.params,
        { animated: false }
      )
     // TODO: DEPS
     // .then(() => {
     //   if (activeDetailView.params) {
     //     // update detail, such that navbar in detail appears
     //     return this.updateDetail(activeDetailView.data.item);
     //   }
     // });
    });
  }

  updateMaster = () => {
    if (this._isSplit) {
      this.masterNav.setRoot(MasterPage, this.masterParams, { animated: false });
    } else {
      this.detailNav.setRoot(MasterPage, this.masterParams, { animated: false });
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
      return this.detailNav.push(DetailPage, params, { animated: false });
    } else {
      return this.detailNav.setRoot(DetailPage, params, { animated: false });
    }
  };

  goBack = () => {
    if (!this._isSplit) {
      this.detailNav.pop();
    }
  };

  protected mapToProps(state: JsonFormsState): ArrayControlProps {
    const props = mapStateToArrayControlProps(state, this.getOwnProps());
    const dispatch = mapDispatchToArrayControlProps(this.ngRedux.dispatch);
    return { ...props, ...dispatch };
  }
}

export const listWithDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
