import { JsonFormsOutlet, UnknownRenderer } from '@jsonforms/angular';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgRedux } from '@angular-redux/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';

export const beforeEachLayoutTest =
    <LAYOUT>(
        Renderer: any,
        { declarations = [], imports = [], providers = []}: any = {}
    ): ComponentFixture<LAYOUT> => {
        TestBed.configureTestingModule({
            declarations: [
                Renderer,
                UnknownRenderer,
                JsonFormsOutlet,
                ...declarations
            ],
            imports,
            providers: [
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                ...providers
            ]
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    UnknownRenderer
                ]
            }
        }).compileComponents();
        MockNgRedux.reset();
        return TestBed.createComponent(Renderer);
    };
