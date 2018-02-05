import { Injectable } from '@angular/core';

export interface DataService {
    handleChange(path: string, value: any): void;
}
export interface JsonFormsService {
    update(path: string, value: any): string[];
}

@Injectable
export class DataServiceImpl implements DataService {
    constructor(private services: JsonFormsService[]) {}
    handleChange(path: string, value: any): void {
        this.services.map(s => s.update(path, value)).reduce((acc,rs) => r.forEach(r => if(acc.indexOf(r) === -1) { acc.push(r); }), []);
    }
}
