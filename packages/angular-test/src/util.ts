import { Type } from '@angular/core';

export interface ErrorTestInformation {
    errorInstance: Type<any>;
    numberOfElements: number;
    indexOfElement: number;
}
