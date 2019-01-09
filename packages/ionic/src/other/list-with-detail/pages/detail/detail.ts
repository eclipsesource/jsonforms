import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { AbstractDetailPage } from '../AbstractDetailPage';

@IonicPage()
@Component({
  selector: 'jsonforms-master-detail-detail',
  template: `
    <ion-header *ngIf="!isSplit"> <ion-navbar></ion-navbar> </ion-header>
    <ion-content padding>
      <div *ngIf="item">
        <jsonforms-outlet
          [schema]="item.schema"
          [uischema]="item.uischema"
          [path]="item.path"
        ></jsonforms-outlet>
      </div>
      <div *ngIf="!item">Please select an item first</div>
    </ion-content>
  `
})
export class DetailPage extends AbstractDetailPage {
  item: any = {};
  isSplit: boolean;

  constructor(public navParams: NavParams) {
    super();
    this.item = navParams.get('item');
    this.isSplit =
      this.item && this.item.isSplit !== undefined ? this.item.isSplit : true;
  }

  goBack() {
    if (this.item) {
      this.item.goBack();
    }
  }
}
