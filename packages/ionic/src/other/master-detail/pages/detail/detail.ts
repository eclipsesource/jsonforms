import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { AbstractDetailPage } from '../AbstractDetailPage';

@IonicPage()
@Component({
  selector: 'jsonforms-master-detail-detail',
  template: `
      <ion-content padding>
          <jsonforms-outlet
                  [schema]="schema"
                  [uischema]="uischema"
                  [path]="path"
          ></jsonforms-outlet>
      </ion-content>
  `
})
export class DetailPage extends AbstractDetailPage {

  schema;
  uischema;
  path: string;

  constructor(public navParams: NavParams) {
    super();
    const item = navParams.get('item');
    this.path = item.path;
    this.schema = item.schema;
    this.uischema = item.uischema;
  }
}
