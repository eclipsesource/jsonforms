import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1>{{title}}</h1>
    <jsonforms-outlet></jsonforms-outlet>
  `
})
export class AppComponent {
  title = 'Tour of Heroes';
}
