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
