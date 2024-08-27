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
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  defaultDateFormat,
  isDateControl,
  JsonFormsState,
  RankedTester,
  rankWith,
  StatePropsOfControl,
} from '@jsonforms/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MyFormat } from '../util/date-format';
import { DayJsDateAdapter } from '../util/dayjs-date-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'DateControlRenderer',
  template: `
    <mat-form-field
      class="date-control-renderer"
      [ngStyle]="{ display: hidden ? 'none' : '' }"
    >
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        (dateChange)="onChange($event)"
        [id]="id"
        [formControl]="form"
        [matDatepicker]="datepicker"
        (focus)="focused = true"
        (focusout)="focused = false"
      />
      <mat-datepicker-toggle
        matSuffix
        [for]="datepicker"
      ></mat-datepicker-toggle>
      <mat-datepicker
        #datepicker
        (monthSelected)="monthSelected($event, datepicker)"
        (yearSelected)="yearSelected($event, datepicker)"
        [startView]="startView"
        [panelClass]="panelClass"
      ></mat-datepicker>
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
        description
      }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      DateControlRenderer {
        display: flex;
        flex-direction: row;
      }
      .date-control-renderer {
        flex: 1 1 auto;
      }
      .no-panel-navigation .mat-calendar-period-button {
        pointer-events: none;
      }
      .no-panel-navigation .mat-calendar-arrow {
        display: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: DayJsDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useClass: MyFormat,
    },
  ],
})
export class DateControlRenderer extends JsonFormsControl {
  focused = false;
  views: string[] = [];
  startView = '';
  panelClass = '';

  constructor(
    jsonformsService: JsonFormsAngularService,
    @Inject(MAT_DATE_FORMATS) private dateFormat: MyFormat,
    @Inject(DateAdapter) private dateAdapter: DayJsDateAdapter
  ) {
    super(jsonformsService);
  }

  getEventValue = (event: any) => {
    const value = event.value ? event.value : event;
    return this.dateAdapter.toSaveFormat(value);
  };

  protected mapToProps(state: JsonFormsState): StatePropsOfControl {
    const props = super.mapToProps(state);
    const saveFormat = this.uischema?.options?.dateSaveFormat
      ? this.uischema.options.dateSaveFormat
      : defaultDateFormat;
    this.views = this.uischema?.options?.views
      ? this.uischema.options.views
      : ['year', 'month', 'day'];
    this.setViewProperties();

    const dateFormat = this.uischema?.options?.dateFormat;

    if (dateFormat) {
      this.dateFormat.setDisplayFormat(dateFormat);
    }

    this.dateAdapter.setSaveFormat(saveFormat);
    if (this.jsonFormsService.getLocale()) {
      this.dateAdapter.setLocale(this.jsonFormsService.getLocale());
    }
    const date = this.dateAdapter.parseSaveFormat(props.data);
    return { ...props, data: date };
  }

  yearSelected($event: any, datepicker: MatDatepicker<DayJsDateAdapter>) {
    if (!this.views.includes('day') && !this.views.includes('month')) {
      this.onChange($event);
      datepicker.close();
    }
  }
  monthSelected($event: any, datepicker: MatDatepicker<DayJsDateAdapter>) {
    if (!this.views.includes('day')) {
      this.onChange($event);
      datepicker.close();
    }
  }

  setViewProperties() {
    if (!this.views.includes('day')) {
      this.startView = 'multi-year';
      this.panelClass = 'no-panel-navigation';
    } else {
      this.startView = 'month';
    }
  }
}

export const DateControlRendererTester: RankedTester = rankWith(
  2,
  isDateControl
);
