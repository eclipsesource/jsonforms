import { Injectable } from '@angular/core';

@Injectable()
export class MyFormat {
  displayFormat = 'M/D/YYYY';

  setDisplayFormat(displayFormat: string) {
    this.displayFormat = displayFormat;
  }

  get display() {
    return {
      monthYearLabel: 'YYYY-MM',
      dateA11yLabel: 'YYYY-MM-DD',
      monthYearA11yLabel: 'YYYY-MM',
      dateInput: this.displayFormat,
    };
  }
  get parse() {
    return {
      dateInput: this.displayFormat,
    };
  }
}
