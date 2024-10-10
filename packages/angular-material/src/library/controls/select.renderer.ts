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
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  Actions,
  composeWithUi,
  ControlElement,
  OwnPropsOfControl,
  RankedTester,
  rankWith,
  or,
  and,
  optionIs,
  isEnumControl,
  isOneOfEnumControl,
  JsonSchema,
  resolveSchema,
  uiTypeIs,
  schemaSubPathMatches,
  hasType,
  schemaMatches,
} from '@jsonforms/core';

@Component({
  selector: 'SelectControlRenderer',
  template: `
    <mat-form-field [ngStyle]="{ display: hidden ? 'none' : '' }">
      <mat-label>{{ label }}</mat-label>
      <mat-select
        (selectionChange)="onSelect($event)"
        [id]="id"
        [formControl]="form"
        [multiple]="multiple"
        (focus)="focused = true"
        (focusout)="focused = false"
      >
        <mat-option *ngIf="!multiple"> <i>None</i> </mat-option>
        <mat-option
          *ngFor="let option of optionElements"
          [value]="option.const"
          [disabled]="option.disabled ? true : false"
        >
          {{ option.label }}
        </mat-option>
      </mat-select>
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
        description
      }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }
      mat-form-field {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectControlRenderer extends JsonFormsControl implements OnInit {
  @Input() options: OptionOfSelect[];
  multiple = false;
  optionElements: OptionOfSelect[] = [];
  focused = false;
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  getEventValue = (event: any) => event.target.value || undefined;

  ngOnInit() {
    super.ngOnInit();
    let scope: JsonSchema = this.scopedSchema;

    /* allow multiple selections for array type control */
    if (scope.items) {
      this.multiple = true;
      /* change scope to items of the array */
      scope = scope.items as JsonSchema;
    }
    console.log(scope);

    if (this.options) {
      this.optionElements = this.options;
    } else {
      /* Used for enum types */
      if (scope.enum) {
        this.optionElements = scope.enum.map((el) => {
          return { const: el, label: el };
        });
      }
      /* Used for oneOf types */
      if (scope.oneOf) {
        this.optionElements = scope.oneOf.map((el) => {
          return {
            const: el.const,
            label: el.title ? el.title : el.const,
            // disabled: el.readOnly ? true : false,
          };
        });
      }
    }
  }

  onSelect(ev: MatSelectChange) {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => ev.value));
    this.triggerValidation();
  }

  protected getOwnProps(): OwnPropsOfSelect {
    return {
      ...super.getOwnProps(),
      options: this.options,
    };
  }
}

const hasOneOfItems = (schema: JsonSchema): boolean =>
  schema.oneOf !== undefined &&
  schema.oneOf.length > 0 &&
  (schema.oneOf as JsonSchema[]).every((entry: JsonSchema) => {
    return entry.const !== undefined;
  });

const hasEnumItems = (schema: JsonSchema): boolean =>
  schema.type === 'string' && schema.enum !== undefined;

export const SelectControlRendererTester: RankedTester = rankWith(
  5,
  /* Can be used for simple Enums or OneOf, autocomplete functionallity needs autocomplete.rederer */
  or(
    and(or(isEnumControl, isOneOfEnumControl), optionIs('autocomplete', false)),
    and(
      uiTypeIs('Control'),
      and(
        schemaMatches(
          (schema) =>
            hasType(schema, 'array') &&
            !Array.isArray(schema.items) &&
            schema.uniqueItems === true
        ),
        schemaSubPathMatches('items', (schema, rootSchema) => {
          const resolvedSchema = schema.$ref
            ? resolveSchema(rootSchema, schema.$ref, rootSchema)
            : schema;
          return hasOneOfItems(resolvedSchema) || hasEnumItems(resolvedSchema);
        })
      )
    )
  )
);

interface OptionOfSelect {
  const: string;
  label?: string;
  disabled?: boolean;
}

interface OwnPropsOfSelect extends OwnPropsOfControl {
  options: OptionOfSelect[];
}
