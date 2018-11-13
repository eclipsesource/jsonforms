/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { By } from '@angular/platform-browser';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { IonicModule, Item, NavParams, Platform, TextInput } from 'ionic-angular';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { JsonFormsOutlet } from '@jsonforms/angular';
import {
    StringControlRenderer,
    stringControlTester,
    VerticalLayoutRenderer,
    verticalLayoutTester
} from '../src';
import { PlatformMock, } from '../test-config/mocks-ionic';
import { DetailPage } from '../src/other/list-with-detail/pages/detail/detail';

describe('Master detail', () => {

    let fixture: ComponentFixture<any>;

    const data = {
        orders: [
            {
                customer: {
                    name: 'ACME'
                },
                title: 'Carrots'
            }
        ]
    };
    const schema = {
        definitions: {
            order: {
                type: 'object',
                properties: {
                    customer: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' }
                        }
                    },
                    title: {
                        type: 'string'
                    }
                }
            }
        },
        type: 'object',
        properties: {
            orders: {
                type: 'array',
                items: {
                    $ref: '#/definitions/order'
                }
            }
        }
    };

    const pageData = {
        get() {
            return {
                label: 'ACME',
                data: {
                    customer: {
                        name: 'ACME'
                    },
                    title: 'Carrots'
                },
                path: 'orders.0',
                schema: schema.definitions.order,
                uischema: {
                    type: 'Control',
                    scope: '#/properties/customer/properties/name',
                    rule: {
                        effect: 'HIDE',
                        condition: {
                            scope: '#/properties/customer/properties/name',
                            schema: {
                                const: 'ACME'
                            }
                        }
                    }
                }
            };
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                JsonFormsOutlet,
                StringControlRenderer,
                DetailPage
            ],
            imports: [IonicModule.forRoot(DetailPage)],
            providers: [
                {provide: Platform, useClass: PlatformMock},
                {provide: NgRedux, useFactory: MockNgRedux.getInstance},
                {provide: NavParams, useValue: pageData },
            ],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [StringControlRenderer]
            }
        }).compileComponents();

        MockNgRedux.reset();
        fixture = TestBed.createComponent(DetailPage);
    });

    it('should render detail page with inactive rule', fakeAsync(() => {
        const mockSubStore = MockNgRedux.getSelectorStub();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: {
                        orders: [
                            {
                                customer: {
                                    name: 'foo'
                                },
                                title: 'Carrots'
                            }
                        ]
                    },
                    schema: schema.definitions.order,
                },
                renderers: [
                    { tester: stringControlTester, renderer: StringControlRenderer },
                    { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer }
                ]
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const textInputs = fixture.debugElement.queryAll(By.directive(TextInput));
        const items = fixture.debugElement.queryAll(By.directive(Item));
        expect(textInputs.length).toBe(1);
        expect(items[0].nativeElement.hidden).toBe(false);
    }));

    it('should render detail page with active rule', fakeAsync(() => {
        const mockSubStore = MockNgRedux.getSelectorStub();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema: schema.definitions.order,
                },
                renderers: [
                    { tester: stringControlTester, renderer: StringControlRenderer },
                    { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer }
                ]
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const textInputs = fixture.debugElement.queryAll(By.directive(TextInput));
        const items = fixture.debugElement.queryAll(By.directive(Item));
        expect(textInputs.length).toBe(1);
        expect(items[0].nativeElement.hidden).toBe(true);
    }));
});
