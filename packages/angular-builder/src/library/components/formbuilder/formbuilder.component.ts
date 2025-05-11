import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'formbuilder',
  styleUrls: ['./formbuilder.component.scss'],
  templateUrl: './formbuilder.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonformsBuilderComponent {
  /**
   * The schema for the form. This is a JSON schema that defines the structure of the form.
   */
  @Input() schema: any;

  /**
   * The UI schema for the form. This is a JSON schema that defines the UI elements of the form.
   */
  @Input() uiSchema: any;

  /**
   * The form data. This is the data that will be used to populate the form.
   */
  @Input() formData: any;

  private _renderers: any = [];

  /**
   * Components that will be used to render the form.
   */
  @Input() set renderers(renderers: any) {
    this._renderers = renderers;
  }
  get renderers() {
    return this._renderers;
  }
}
