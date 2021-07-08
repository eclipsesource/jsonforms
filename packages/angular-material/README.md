# JSON Forms - More Forms. Less Code

*Complex forms in the blink of an eye*

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Angular Material Renderers Package

This is the JSONForms Angular Material renderers package. This package only contains renderers and must be combined with [JSON Forms Angular](https://github.com/eclipsesource/jsonforms/blob/master/packages/angular).

See the official [documentation](https://jsonforms.io/docs/integrations/angular) and the JSON Forms Angular [seed repository](https://github.com/eclipsesource/jsonforms-angular-seed) for examples on how to integrate JSON Forms with your application.

Check <https://www.npmjs.com/search?q=%40jsonforms> for all published JSON Forms packages.

### Quick start

Install JSON Forms Core, Angular and Angular Material Renderers

```bash
npm i --save @jsonforms/core @jsonforms/angular @jsonforms/angular-material
```

Use the `json-forms` component for each form you want to render and hand over the renderer set.

Example component file `app.component.ts`:

```ts
import { Component } from "@angular/core";
import { angularMaterialRenderers } from "@jsonforms/angular-material";

@Component({
  selector: "app-root",
  template: `<jsonforms
    [data]="data"
    [schema]="schema"
    [uischema]="uischema"
    [renderers]="renderers"
  ></jsonforms>`,
})
export class AppComponent {
  renderers = angularMaterialRenderers;
  data = {};
}
```

Example module file:

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JsonFormsModule } from "@jsonforms/angular";
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
  ],
  schemas: [],
  bootstrap: [AppComponent],
})

```

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Roadmap

Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

## Feedback, Help and Support

JSON Forms is developed by [EclipseSource](https://eclipsesource.com).

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.
