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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { JsonFormsModule } from '@jsonforms/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JsonformsBuilderComponent } from './components/formbuilder/formbuilder.component';
import { FormbuilderToolbarComponent } from './components/formbuilder-toolbar/formbuilder-toolbar.component';
import { FormbuilderEditorComponent } from './components/formbuilder-editor/formbuilder-editor.component';
import { FormbuilderPreviewComponent } from './components/formbuilder-preview/formbuilder-preview.component';

@NgModule({
  imports: [
    CommonModule,
    // JsonFormsModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    DragDropModule,
  ],
  declarations: [
    JsonformsBuilderComponent,
    FormbuilderToolbarComponent,
    FormbuilderEditorComponent,
    FormbuilderPreviewComponent,
  ],
  exports: [CommonModule],
  schemas: [],
  providers: [],
})
export class JsonFormsAngularBuilderModule {}
