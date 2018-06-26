import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { MasterDetailNavService } from '../../master-detail-nav.service';
import { DetailPage } from '../detail/detail';
import { AbstractMasterPage } from '../AbstractMasterPage';

@IonicPage()
@Component({
  selector: 'jsonforms-master-detail-master',
  template: `
      <ion-content>
          <ion-list>
              <button ion-item *ngFor="let item of items" (click)="onItemSelected(item)">
                  <h2>
                      {{ item.label }}
                  </h2>
              </button>
          </ion-list>
      </ion-content>
  `
})
export class MasterPage extends AbstractMasterPage {

  items: any[];

  constructor(
    public navParams: NavParams,
    private navProxy: MasterDetailNavService
  ) {
    super();
    this.items = navParams.get('items');
  }

  onItemSelected(item) {
    this.navProxy.pushDetail(DetailPage, { addToNavStack: true, item });
  }
}
