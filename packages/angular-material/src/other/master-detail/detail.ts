import { Component, Input } from '@angular/core';

@Component({
    selector: 'jsonforms-detail',
    template: `
    <div *ngIf="initialized">
        <jsonforms-outlet [renderProps]="_item"></jsonforms-outlet>
    </div>
    `
})
export class JsonFormsDetailComponent {

    _item: any;
    _schema: any;
    initialized = false;

    @Input('item')
    set item(item: any) {
        if (item) {
            this._item = item;
            this.initialized = true;
        }
    }
}
