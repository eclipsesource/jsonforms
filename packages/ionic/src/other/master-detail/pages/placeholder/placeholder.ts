import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AbstractDetailPage } from '../AbstractDetailPage';

@IonicPage()
@Component({
  selector: 'page-placeholder',
  template: `
      <ion-content padding>
      </ion-content>
  `
})
export class PlaceholderPage extends AbstractDetailPage {

}
