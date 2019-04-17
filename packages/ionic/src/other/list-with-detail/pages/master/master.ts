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
import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { AbstractMasterPage } from '../AbstractMasterPage';
import { MasterItem } from '../../list-with-detail-control';
import {
  ControlElement,
  createDefaultValue,
  JsonFormsState,
  JsonSchema,
  mapDispatchToArrayControlProps
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';

@Component({
  selector: 'jsonforms-master-detail-master',
  template: `
    <ion-content>
      <ion-list>
        <button
          ion-item
          *ngFor="let item of items"
          (click)="onItemSelected(item)"
        >
          <h2>{{ item.label }}</h2>
        </button>
      </ion-list>
      <ion-fab right bottom>
        <button ion-fab (click)="onClick()">
          <ion-icon name="add"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>
  `
})
export class MasterPage extends AbstractMasterPage implements OnInit {
  items: MasterItem;
  uischema: ControlElement;
  schema: JsonSchema;
  path: string;
  addItem: (path: string, value: any) => () => void;
  pushDetail: (params: any) => void;

  constructor(
    public navParams: NavParams,
    private ngRedux: NgRedux<JsonFormsState>
  ) {
    super();
    this.items = navParams.get('items');
    this.schema = this.navParams.get('schema');
    this.uischema = this.navParams.get('uischema');
    this.path = this.navParams.get('path');
    this.pushDetail = this.navParams.get('pushDetail');
  }

  ngOnInit() {
    const { addItem } = mapDispatchToArrayControlProps(this.ngRedux.dispatch);
    this.addItem = addItem;
  }

  onItemSelected(item: any) {
    this.pushDetail(item);
  }

  onClick() {
    this.addItem(this.path, createDefaultValue(this.schema))();
  }
}
