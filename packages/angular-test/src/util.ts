import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockNgRedux } from '@angular-redux/store/testing';
import { JsonFormsControl } from '@jsonforms/angular';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

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
