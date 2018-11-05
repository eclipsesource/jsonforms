import { Type } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockNgRedux } from '@angular-redux/store/testing';
import { JsonFormsControl } from '@jsonforms/angular';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Subject } from 'rxjs';

export interface ErrorTestExpectation {
    errorInstance: Type<any>;
    numberOfElements: number;
    indexOfElement: number;
}
export interface TestConfig<C extends JsonFormsControl> {
    imports: any[];
    providers: any[];
    componentUT: Type<C>;
}

export const baseSetup = <C extends JsonFormsControl>(testConfig: TestConfig<C>) => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [testConfig.componentUT],
            imports: testConfig.imports,
            providers: testConfig.providers
        }).compileComponents();

        MockNgRedux.reset();
    });
};

export interface TestData {
    data: any;
    schema: JsonSchema;
    uischema: UISchemaElement;
}

export const setupMockStore =
    (fixture: ComponentFixture<any>, testData: TestData): Subject<any> => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        const component = fixture.componentInstance;
        component.uischema = testData.uischema;
        component.schema = testData.schema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: testData.data,
                    schema: testData.schema,
                }
            }
        });
        return mockSubStore;
    };

export const initComponent = (fixture: ComponentFixture<any>, mockSubStore: Subject<any>) => {
    mockSubStore.complete();
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
};
