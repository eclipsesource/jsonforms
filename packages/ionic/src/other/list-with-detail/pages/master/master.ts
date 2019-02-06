import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { AbstractMasterPage } from '../AbstractMasterPage';
import { MasterItem } from '../../list-with-detail-control';
import {
  ControlElement,
  JsonFormsState,
  JsonSchema,
  mapDispatchToArrayControlProps
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';

@IonicPage()
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
  createDefaultValue: () => void;

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
    this.createDefaultValue = this.navParams.get('createDefaultValue');
  }

  ngOnInit() {
    const { addItem } = mapDispatchToArrayControlProps(this.ngRedux.dispatch);
    this.addItem = addItem;
  }

  onItemSelected(item: any) {
    this.pushDetail(item);
  }

  onClick() {
    this.addItem(this.path, this.createDefaultValue())();
  }
}
