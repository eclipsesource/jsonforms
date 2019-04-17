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
// import { By } from '@angular/platform-browser';
// import { NgRedux } from '@angular-redux/store';
// import { MockNgRedux } from '@angular-redux/store/testing';
// import {
//   FabButton,
//   IonicModule,
//   IonicPageModule,
//   Nav,
//   Platform
// } from 'ionic-angular';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { JsonFormsOutlet } from '@jsonforms/angular';
// import { ListWithDetailControl } from '../src';
// import { mockNav, PlatformMock } from '../test-config/mocks-ionic';
// import { MasterPage } from '../src/other/list-with-detail/pages/master/master';
// import { DetailPage } from '../src/other/list-with-detail/pages/detail/detail';
// 
// describe('Master detail', () => {
//   let fixture: ComponentFixture<any>;
//   let component: any;
// 
//   const data = {
//     orders: [
//       {
//         customer: {
//           name: 'ACME'
//         },
//         title: 'Carrots'
//       }
//     ]
//   };
//   const schema = {
//     definitions: {
//       order: {
//         type: 'object',
//         properties: {
//           customer: {
//             type: 'object',
//             properties: {
//               name: { type: 'string' }
//             }
//           },
//           title: {
//             type: 'string'
//           }
//         }
//       }
//     },
//     type: 'object',
//     properties: {
//       orders: {
//         type: 'array',
//         items: {
//           $ref: '#/definitions/order'
//         }
//       }
//     }
//   };
//   const uischema = {
//     type: 'ListWithDetail',
//     scope: '#/properties/orders',
//     options: {
//       labelRef: '#/items/properties/customer/properties/name',
//       detail: {
//         type: 'VerticalLayout',
//         elements: [
//           {
//             type: 'Control',
//             scope: '#/properties/customer/properties/name'
//           }
//         ]
//       }
//     }
//   };
// 
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         JsonFormsOutlet,
//         ListWithDetailControl,
//         MasterPage,
//         DetailPage
//       ],
//       imports: [
//         IonicModule.forRoot(ListWithDetailControl),
//         IonicPageModule.forChild(MasterPage),
//         IonicPageModule.forChild(DetailPage)
//       ],
//       providers: [
//         { provide: Platform, useClass: PlatformMock },
//         { provide: NgRedux, useFactory: MockNgRedux.getInstance },
//         { provide: Nav, useValue: mockNav() }
//       ]
//     }).compileComponents();
// 
//     MockNgRedux.reset();
//     fixture = TestBed.createComponent(ListWithDetailControl);
//     component = fixture.componentInstance;
//   });
// 
//   it('should render', async(() => {
//     const mockSubStore = MockNgRedux.getSelectorStub();
//     component.uischema = uischema;
// 
//     mockSubStore.next({
//       jsonforms: {
//         core: {
//           data,
//           schema
//         }
//       }
//     });
//     component.ngOnInit();
//     mockSubStore.complete();
// 
//     fixture.detectChanges();
//     fixture.whenRenderingDone().then(() => {
//       expect(component.masterItems.length).toBe(1);
//       expect(
//         fixture.debugElement.queryAll(By.directive(MasterPage)).length
//       ).toBe(1);
//       expect(fixture.debugElement.queryAll(By.directive(Nav)).length).toBe(2);
//     });
//   }));
// 
//   it('add a master item', async(() => {
//     const mockSubStore = MockNgRedux.getSelectorStub();
//     component.uischema = uischema;
// 
//     mockSubStore.next({
//       jsonforms: {
//         core: {
//           data,
//           schema
//         }
//       }
//     });
//     component.ngOnInit();
//     mockSubStore.complete();
// 
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       const masterPage: any = fixture.debugElement.query(
//         By.directive(MasterPage)
//       );
//       spyOn(masterPage.componentInstance, 'addItem').and.callThrough();
//       const addItemButton = fixture.debugElement.query(By.directive(FabButton))
//         .nativeElement;
//       addItemButton.click();
//       fixture.detectChanges();
//       fixture.whenRenderingDone().then(() => {
//         fixture.detectChanges();
//         expect(masterPage.componentInstance.addItem).toHaveBeenCalled();
//       });
//     });
//   }));
// 
//   it('setting detail on click', async(() => {
//     const mockSubStore = MockNgRedux.getSelectorStub();
//     component.uischema = uischema;
// 
//     mockSubStore.next({
//       jsonforms: {
//         core: {
//           data,
//           schema
//         }
//       }
//     });
//     component.ngOnInit();
//     mockSubStore.complete();
// 
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       spyOn(component.detailNav, 'setRoot');
//       const select = fixture.debugElement.query(By.css('.item')).nativeElement;
//       select.click();
//       fixture.detectChanges();
//       fixture.whenStable().then(() => {
//         fixture.detectChanges();
//         expect(
//           fixture.debugElement.queryAll(By.directive(DetailPage)).length
//         ).toBe(1);
//         expect(component.detailNav.setRoot).toHaveBeenCalled();
//       });
//     });
//   }));
// });
