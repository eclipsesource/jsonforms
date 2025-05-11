import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'formbuilder-editor',
  templateUrl: './formbuilder-editor.component.html',
  styleUrls: ['./formbuilder-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormbuilderEditorComponent {}
