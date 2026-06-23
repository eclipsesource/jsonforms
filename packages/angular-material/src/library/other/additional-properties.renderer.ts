/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonFormsModule, JsonFormsAngularService } from '@jsonforms/angular';
import {
  Actions,
  composePaths,
  ControlElement,
  createControlElement,
  createDefaultValue,
  Generate,
  GroupLayout,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  JsonSchema7,
  Resolve,
  UISchemaElement,
} from '@jsonforms/core';
import startCase from 'lodash/startCase';

interface AdditionalPropertyItem {
  propertyName: string;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

const ANY_TYPE: JsonSchema7['type'] = [
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
];

const toObjectSchema = (schema: JsonSchema): JsonSchema7 =>
  typeof schema === 'object' ? (schema as JsonSchema7) : {};

const hasAdditionalProperties = (schema: JsonSchema): boolean => {
  const objectSchema = toObjectSchema(schema);
  return (
    Boolean(
      objectSchema.patternProperties &&
        Object.keys(objectSchema.patternProperties).length > 0
    ) ||
    typeof objectSchema.additionalProperties === 'object' ||
    objectSchema.additionalProperties === true
  );
};

const getMatchingAdditionalPropertySchema = (
  propName: string,
  parentSchema: JsonSchema,
  rootSchema: JsonSchema
): JsonSchema => {
  const objectSchema = toObjectSchema(parentSchema);
  let propSchema: JsonSchema | undefined;

  if (objectSchema.patternProperties) {
    const matchedPattern = Object.keys(objectSchema.patternProperties).find(
      (pattern) => new RegExp(pattern).test(propName)
    );
    if (matchedPattern) {
      propSchema = objectSchema.patternProperties[matchedPattern];
    }
  }

  if (
    (!propSchema && typeof objectSchema.additionalProperties === 'object') ||
    objectSchema.additionalProperties === true
  ) {
    propSchema =
      objectSchema.additionalProperties === true
        ? { additionalProperties: true }
        : objectSchema.additionalProperties;
  }

  if (typeof propSchema === 'object' && typeof propSchema.$ref === 'string') {
    propSchema = Resolve.schema(rootSchema, propSchema.$ref, rootSchema);
  }

  propSchema = propSchema ?? {};

  if (typeof propSchema === 'object' && propSchema.type === undefined) {
    propSchema = {
      ...propSchema,
      type: ANY_TYPE,
    };
  }

  return propSchema;
};

const toAdditionalPropertyItem = (
  propName: string,
  parentPath: string,
  parentSchema: JsonSchema,
  rootSchema: JsonSchema
): AdditionalPropertyItem => {
  let propSchema = getMatchingAdditionalPropertySchema(
    propName,
    parentSchema,
    rootSchema
  );
  let propUiSchema: UISchemaElement = createControlElement('#');

  if (typeof propSchema === 'object' && propSchema.type === 'array') {
    propUiSchema = Generate.uiSchema(
      propSchema,
      'Group',
      undefined,
      rootSchema
    );
    (propUiSchema as GroupLayout).label =
      propSchema.title ?? startCase(propName);
  }

  if (typeof propSchema === 'object') {
    propSchema = {
      ...propSchema,
      title: propName,
    };
    if (propSchema.type === 'object') {
      propSchema.additionalProperties =
        propSchema.additionalProperties !== false
          ? propSchema.additionalProperties ?? true
          : false;
    } else if (propSchema.type === 'array') {
      propSchema.items = propSchema.items ?? {};
    }
  }

  return {
    propertyName: propName,
    path: composePaths(parentPath, propName),
    schema: propSchema,
    uischema: propUiSchema,
  };
};

const getPropertyNamePattern = (schema: JsonSchema): string | undefined => {
  const objectSchema = toObjectSchema(schema);
  const propertyNames = objectSchema.propertyNames as JsonSchema7 | undefined;
  if (typeof propertyNames === 'object' && propertyNames.pattern) {
    return propertyNames.pattern;
  }

  if (
    objectSchema.additionalProperties === false &&
    objectSchema.patternProperties
  ) {
    const patterns = Object.keys(objectSchema.patternProperties);
    return patterns.length > 0 ? patterns.join('|') : undefined;
  }

  return undefined;
};

@Component({
  selector: 'AdditionalPropertiesRenderer',
  template: `
    <div class="additional-properties" *ngIf="shouldShow">
      <div
        class="additional-properties-add"
        [class.additional-properties-add--with-title]="
          additionalPropertiesTitle
        "
      >
        <span
          class="additional-properties-title"
          *ngIf="additionalPropertiesTitle"
        >
          {{ additionalPropertiesTitle }}
        </span>
        <mat-form-field class="property-name-field">
          <mat-label>Property Name</mat-label>
          <input
            matInput
            [(ngModel)]="newPropertyName"
            (ngModelChange)="updatePropertyNameError()"
            (keydown.enter)="addProperty()"
          />
          <button
            mat-icon-button
            matSuffix
            type="button"
            [attr.aria-label]="
              label ? 'Add to ' + label + ' button' : 'Add button'
            "
            [disabled]="addPropertyDisabled"
            (click)="addProperty()"
            [matTooltip]="label ? 'Add to ' + label : 'Add'"
          >
            <mat-icon>add</mat-icon>
          </button>
          <mat-hint class="property-name-error" *ngIf="propertyNameError">{{
            propertyNameError
          }}</mat-hint>
        </mat-form-field>
      </div>

      <div
        class="additional-property-row"
        *ngFor="let item of additionalPropertyItems; trackBy: trackProperty"
      >
        <div class="additional-property-control">
          <jsonforms-outlet
            [uischema]="item.uischema"
            [schema]="item.schema"
            [path]="item.path"
            [preserveUndefinedAsDefault]="true"
          ></jsonforms-outlet>
        </div>
        <div class="additional-property-actions" *ngIf="enabled">
          <mat-menu
            #renameMenu="matMenu"
            xPosition="before"
            yPosition="above"
            panelClass="additional-property-rename-panel"
          >
            <div
              class="additional-property-rename-menu"
              (click)="$event.stopPropagation()"
            >
              <mat-form-field class="rename-property-name-field">
                <mat-label>Property Name</mat-label>
                <input
                  matInput
                  [(ngModel)]="renameValue"
                  (ngModelChange)="updateRenameError(item.propertyName)"
                  (keydown.enter)="
                    renameProperty(item.propertyName);
                    !renameError && renameTrigger.closeMenu()
                  "
                  (keydown.escape)="cancelRename(); renameTrigger.closeMenu()"
                />
                <mat-error *ngIf="renameError">{{ renameError }}</mat-error>
              </mat-form-field>
              <div class="additional-property-rename-actions">
                <button
                  mat-button
                  type="button"
                  [disabled]="renameDisabled(item.propertyName)"
                  (click)="
                    renameProperty(item.propertyName); renameTrigger.closeMenu()
                  "
                >
                  Rename
                </button>
                <button
                  mat-button
                  type="button"
                  (click)="cancelRename(); renameTrigger.closeMenu()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </mat-menu>
          <button
            #renameTrigger="matMenuTrigger"
            mat-icon-button
            class="additional-property-action-button"
            type="button"
            aria-label="Rename property button"
            [matMenuTriggerFor]="renameMenu"
            (menuOpened)="startRename(item.propertyName)"
            (menuClosed)="cancelRename()"
            matTooltip="Rename"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            class="additional-property-action-button"
            color="warn"
            type="button"
            aria-label="Delete button"
            [disabled]="
              removePropertyDisabled ||
              renamingPropertyName === item.propertyName
            "
            (click)="removeProperty(item.propertyName)"
            matTooltip="Delete"
          >
            <mat-icon>delete_outline</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .additional-properties {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        width: 100%;
      }
      .additional-properties-add,
      .additional-property-row {
        align-items: flex-start;
        display: grid;
        gap: 8px;
      }
      .additional-properties-add {
        grid-template-columns: minmax(0, 1fr);
      }
      .additional-properties-add--with-title {
        grid-template-columns: minmax(180px, max-content) minmax(0, 1fr);
      }
      .additional-properties-title {
        align-self: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
      }
      .property-name-field {
        min-width: 0;
        width: 100%;
      }
      .property-name-error {
        color: var(--mat-sys-error, #ba1a1a);
      }
      .additional-property-row {
        grid-template-columns: minmax(0, 1fr) auto;
        width: 100%;
      }
      .additional-property-control {
        min-width: 0;
        width: 100%;
      }
      .additional-property-actions {
        align-items: center;
        display: inline-flex;
        flex-direction: column;
        gap: 0;
        opacity: 0.72;
        transition: opacity 120ms ease;
      }
      .additional-property-row:hover .additional-property-actions {
        opacity: 1;
      }
      .additional-property-action-button.mat-mdc-icon-button {
        --mdc-icon-button-state-layer-size: 24px;
        height: 24px;
        padding: 2px;
        width: 24px;
      }
      .additional-property-action-button mat-icon {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        width: 16px;
      }
      .additional-property-rename-menu {
        box-sizing: border-box;
        max-width: 100%;
        overflow: hidden;
        padding: 12px;
        width: 280px;
      }
      .additional-property-rename-actions {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .rename-property-name-field {
        width: 100%;
      }
      .additional-property-rename-panel.mat-mdc-menu-panel {
        max-width: min(320px, calc(100vw - 32px));
        min-width: 0;
        overflow-x: hidden;
      }
      .additional-property-rename-panel .mat-mdc-menu-content {
        overflow-x: hidden;
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    JsonFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
  ],
})
export class AdditionalPropertiesRenderer implements OnChanges {
  @Input() cells?: JsonFormsCellRendererRegistryEntry[];
  @Input() config?: any;
  @Input() data: any;
  @Input() enabled: boolean;
  @Input() label: string;
  @Input() path: string;
  @Input() renderers?: JsonFormsRendererRegistryEntry[];
  @Input() rootSchema: JsonSchema;
  @Input() schema: JsonSchema;
  @Input() uischema: ControlElement;

  additionalKeys: string[] = [];
  additionalPropertyItems: AdditionalPropertyItem[] = [];
  additionalPropertiesTitle: string | undefined;
  newPropertyName = '';
  propertyNameError: string | undefined;
  renamingPropertyName: string | undefined;
  renameValue = '';
  renameError: string | undefined;
  shouldShow = false;

  private additionalPropertyItemCache = new Map<
    string,
    AdditionalPropertyItem
  >();
  private jsonFormsService = inject(JsonFormsAngularService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.schema || changes.rootSchema || changes.path) {
      this.additionalPropertyItemCache.clear();
    }
    this.updateItems();
  }

  get addPropertyDisabled(): boolean {
    return (
      !this.enabled ||
      Boolean(this.propertyNameError) ||
      !this.newPropertyName ||
      (this.config?.restrict && this.maxPropertiesReached)
    );
  }

  get removePropertyDisabled(): boolean {
    return (
      !this.enabled || (this.config?.restrict && this.minPropertiesReached)
    );
  }

  get maxPropertiesReached(): boolean {
    const objectSchema = toObjectSchema(this.schema);
    return (
      objectSchema.maxProperties !== undefined &&
      this.data &&
      Object.keys(this.data).length >= objectSchema.maxProperties
    );
  }

  get minPropertiesReached(): boolean {
    const objectSchema = toObjectSchema(this.schema);
    return (
      objectSchema.minProperties !== undefined &&
      this.data &&
      Object.keys(this.data).length <= objectSchema.minProperties
    );
  }

  addProperty(): void {
    this.propertyNameError = this.validatePropertyName(this.newPropertyName);
    if (this.addPropertyDisabled) {
      return;
    }

    const additionalProperty = toAdditionalPropertyItem(
      this.newPropertyName,
      this.path,
      this.schema,
      this.rootSchema
    );
    const updatedData =
      typeof this.data === 'object' &&
      this.data !== null &&
      !Array.isArray(this.data)
        ? { ...this.data }
        : {};

    updatedData[this.newPropertyName] = createDefaultValue(
      additionalProperty.schema,
      this.rootSchema
    );
    this.jsonFormsService.updateCore(
      Actions.update(this.path, () => updatedData)
    );
    this.newPropertyName = '';
    this.propertyNameError = undefined;
  }

  updatePropertyNameError(): void {
    this.propertyNameError = this.validatePropertyName(this.newPropertyName);
  }

  removeProperty(propertyName: string): void {
    if (
      this.removePropertyDisabled ||
      typeof this.data !== 'object' ||
      this.data === null
    ) {
      return;
    }

    const updatedData = { ...this.data };
    delete updatedData[propertyName];
    this.jsonFormsService.updateCore(
      Actions.update(this.path, () => updatedData)
    );
  }

  startRename(propertyName: string): void {
    this.renamingPropertyName = propertyName;
    this.renameValue = propertyName;
    this.renameError = undefined;
  }

  cancelRename(): void {
    this.renamingPropertyName = undefined;
    this.renameValue = '';
    this.renameError = undefined;
  }

  renameDisabled(propertyName: string): boolean {
    const trimmed = this.renameValue.trim();
    return (
      !this.enabled ||
      !trimmed ||
      trimmed === propertyName ||
      Boolean(this.validatePropertyName(trimmed, propertyName))
    );
  }

  updateRenameError(propertyName: string): void {
    this.renameError = this.validatePropertyName(
      this.renameValue.trim(),
      propertyName
    );
  }

  renameProperty(propertyName: string): void {
    const trimmed = this.renameValue.trim();
    this.renameError = this.validatePropertyName(trimmed, propertyName);

    if (
      this.renameError ||
      !trimmed ||
      trimmed === propertyName ||
      typeof this.data !== 'object' ||
      this.data === null ||
      Array.isArray(this.data)
    ) {
      return;
    }

    const updatedData = Object.fromEntries(
      Object.entries(this.data).map(([key, value]) => [
        key === propertyName ? trimmed : key,
        value,
      ])
    );
    this.jsonFormsService.updateCore(
      Actions.update(this.path, () => updatedData)
    );
    this.cancelRename();
  }

  trackProperty(_index: number, item: AdditionalPropertyItem): string {
    return item.propertyName;
  }

  private updateItems(): void {
    const objectSchema = toObjectSchema(this.schema);
    const reservedPropertyNames = Object.keys(objectSchema.properties ?? {});
    this.additionalKeys = Object.keys(this.data ?? {}).filter(
      (key) => !reservedPropertyNames.includes(key)
    );
    this.additionalPropertyItems = this.additionalKeys.map((propertyName) =>
      this.getAdditionalPropertyItem(propertyName)
    );
    const additionalKeySet = new Set(this.additionalKeys);
    Array.from(this.additionalPropertyItemCache.keys()).forEach(
      (propertyName) => {
        if (!additionalKeySet.has(propertyName)) {
          this.additionalPropertyItemCache.delete(propertyName);
        }
      }
    );
    const allowIfMissing =
      this.config?.allowAdditionalPropertiesIfMissing === true &&
      objectSchema.additionalProperties === undefined;
    this.shouldShow =
      hasAdditionalProperties(this.schema) ||
      allowIfMissing ||
      this.additionalKeys.length > 0;
    this.additionalPropertiesTitle = toObjectSchema(
      objectSchema.additionalProperties as JsonSchema
    ).title;
    this.propertyNameError = this.validatePropertyName(this.newPropertyName);
  }

  private getAdditionalPropertyItem(
    propertyName: string
  ): AdditionalPropertyItem {
    const cached = this.additionalPropertyItemCache.get(propertyName);
    if (cached) {
      return cached;
    }

    const item = toAdditionalPropertyItem(
      propertyName,
      this.path,
      this.schema,
      this.rootSchema
    );
    this.additionalPropertyItemCache.set(propertyName, item);
    return item;
  }

  private validatePropertyName(
    propertyName: string,
    currentPropertyName?: string
  ): string | undefined {
    if (!propertyName) {
      return undefined;
    }

    if (
      typeof this.data === 'object' &&
      this.data !== null &&
      Object.prototype.hasOwnProperty.call(this.data, propertyName)
    ) {
      if (propertyName === currentPropertyName) {
        return undefined;
      }
      return `Property '${propertyName}' already defined`;
    }

    if (
      propertyName.includes('[') ||
      propertyName.includes(']') ||
      propertyName.includes('.')
    ) {
      return `Property name '${propertyName}' is invalid`;
    }

    const pattern = getPropertyNamePattern(this.schema);
    if (pattern && !new RegExp(pattern).test(propertyName)) {
      return `Property name must match pattern: ${pattern}`;
    }

    return undefined;
  }
}
