<template>
  <v-card
    v-if="control.visible"
    class="additional-properties-card"
    v-bind="vuetifyProps('v-card')"
    flat
  >
    <v-container class="py-0">
      <div
        class="additional-properties-add"
        :class="{
          'additional-properties-add--with-title':
            mdAndUp && additionalPropertiesTitle,
        }"
      >
        <div
          v-if="mdAndUp && additionalPropertiesTitle"
          class="additional-properties-title"
        >
          {{ additionalPropertiesTitle }}
        </div>
        <div class="additional-properties-add-field">
          <json-forms
            :data="newPropertyName"
            :uischema="
              {
                type: 'Control',
                scope: '#',
                label: propertyNameLabel,
              } as UISchemaElement
            "
            :schema="propertyNameSchema"
            :additionalErrors="additionalErrors"
            :renderers="control.renderers"
            :cells="control.cells"
            :config="control.config"
            :readonly="!isControlEditable(control)"
            :validation-mode="validationMode"
            :i18n="i18n"
            :ajv="ajv"
            :middleware="middleware"
            @change="propertyNameChange"
          ></json-forms>
        </div>
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              elevation="0"
              small
              :aria-label="translations.addAriaLabel"
              v-bind="props"
              :disabled="addPropertyDisabled"
              @click="addProperty"
            >
              <v-icon>{{ icons.current.value.itemAdd }}</v-icon>
            </v-btn>
          </template>
          {{ translations.addTooltip }}
        </v-tooltip>
      </div>
    </v-container>
    <v-container
      v-bind="vuetifyProps('v-container')"
      class="additional-properties-items py-0"
    >
      <div
        :class="additionalPropertyRowClasses(element)"
        v-for="element in additionalPropertyItems"
        :key="`${element.propertyName}`"
      >
        <div class="additional-property-content">
          <dispatch-renderer
            v-if="element.schema && element.uischema"
            :schema="element.schema"
            :uischema="element.uischema"
            :path="element.path"
            :enabled="control.enabled"
            :readonly="control.readonly"
            :renderers="control.renderers"
            :cells="control.cells"
          />
        </div>
        <div v-if="control.enabled" class="additional-property-actions">
          <v-menu
            :model-value="renamingPropertyName === element.propertyName"
            :close-on-content-click="false"
            location="top end"
            @update:model-value="
              (open) =>
                open ? startRename(element.propertyName) : cancelRename()
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="additional-property-action-button"
                icon
                variant="text"
                elevation="0"
                :aria-label="'Rename property ' + element.propertyName"
                :title="'Rename property ' + element.propertyName"
              >
                <v-icon class="notranslate">{{
                  icons.current.value.itemEdit
                }}</v-icon>
              </v-btn>
            </template>
            <v-card class="additional-property-rename-menu" elevation="8">
              <v-text-field
                v-model="renameValue"
                density="compact"
                hide-details="auto"
                autofocus
                :label="propertyNameLabel"
                :error-messages="renameError ? [renameError] : []"
                v-bind="vuetifyProps('v-text-field')"
                @update:model-value="updateRenameError(element.propertyName)"
                @keydown.enter="renameProperty(element.propertyName)"
                @keydown.esc="cancelRename"
              />
              <div class="additional-property-rename-actions">
                <v-btn
                  variant="text"
                  size="small"
                  :disabled="renamePropertyDisabled(element.propertyName)"
                  @click="renameProperty(element.propertyName)"
                >
                  Rename
                </v-btn>
                <v-btn variant="text" size="small" @click="cancelRename">
                  Cancel
                </v-btn>
              </div>
            </v-card>
          </v-menu>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="additional-property-action-button"
                icon
                variant="text"
                elevation="0"
                :aria-label="translations.removeAriaLabel"
                :disabled="
                  removePropertyDisabled ||
                  renamingPropertyName === element.propertyName
                "
                @click="removeProperty(element.propertyName)"
              >
                <v-icon class="notranslate">{{
                  icons.current.value.itemDelete
                }}</v-icon>
              </v-btn>
            </template>
            {{ translations.removeTooltip }}
          </v-tooltip>
        </div>
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { AdditionalPropertiesTranslationEnum } from '@/i18n';
import { additionalPropertiesDefaultTranslations } from '@/i18n/additionalPropertiesTranslations';
import { getAdditionalPropertiesTranslations } from '@/i18n/i18nUtil';
import {
  Generate,
  Resolve,
  composePaths,
  createControlElement,
  createDefaultValue,
  getI18nKeyPrefix,
  type GroupLayout,
  type JsonSchema,
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  JsonForms,
  useJsonForms,
  useJsonFormsControlWithDetail,
  useTranslator,
  type JsonFormsChangeEvent,
} from '@jsonforms/vue';
import type { ErrorObject } from 'ajv';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import startCase from 'lodash/startCase';

import { IsDynamicPropertyContext } from '@/util/inject';
import {
  computed,
  defineComponent,
  markRaw,
  provide,
  ref,
  unref,
  type PropType,
} from 'vue';
import { useDisplay } from 'vuetify';
import {
  VBtn,
  VCard,
  VContainer,
  VIcon,
  VMenu,
  VTextField,
  VTooltip,
} from 'vuetify/components';
import { DisabledIconFocus } from '../../controls/directives';
import { useStyles } from '../../styles';
import {
  isControlEditable,
  useControlAppliedOptions,
  useIcons,
} from '../../util';

type Input = ReturnType<typeof useJsonFormsControlWithDetail>;
interface AdditionalPropertyType {
  propertyName: string;
  path: string;
  schema: JsonSchema | undefined;
  uischema: UISchemaElement | undefined;
}

export default defineComponent({
  name: 'additional-properties',
  components: {
    DispatchRenderer,
    VCard,
    VTooltip,
    VIcon,
    VBtn,
    VMenu,
    VContainer,
    VTextField,
    JsonForms,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    input: {
      type: Object as PropType<Input>,
      required: true,
    },
  },
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const control = props.input.control;
    const reservedPropertyNames = computed(() =>
      Object.keys(control.value.schema.properties || {}),
    );

    const additionalKeys = computed(() =>
      Object.keys(control.value.data || {}).filter(
        (k) => !reservedPropertyNames.value.includes(k),
      ),
    );

    const toAdditionalPropertyType = (
      propName: string,
      propValue: any,
      parentSchema: JsonSchema,
      rootSchema: JsonSchema,
    ): AdditionalPropertyType => {
      let propSchema: JsonSchema | undefined = undefined;
      let propUiSchema: UISchemaElement | undefined = undefined;

      if (parentSchema.patternProperties) {
        const matchedPattern = Object.keys(parentSchema.patternProperties).find(
          (pattern) => new RegExp(pattern).test(propName),
        );
        if (matchedPattern) {
          propSchema = parentSchema.patternProperties[matchedPattern];
        }
      }

      if (
        (!propSchema &&
          typeof parentSchema.additionalProperties === 'object') ||
        parentSchema.additionalProperties === true
      ) {
        propSchema =
          parentSchema.additionalProperties === true
            ? { additionalProperties: true }
            : parentSchema.additionalProperties;
      }

      if (typeof propSchema?.$ref === 'string') {
        propSchema = Resolve.schema(rootSchema, propSchema.$ref, rootSchema);
      }

      propSchema = propSchema ?? {};

      if (propSchema.type === undefined) {
        propSchema = {
          ...propSchema,
          type: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ],
        };
      }

      if (propSchema.type === 'array') {
        propUiSchema = Generate.uiSchema(
          propSchema,
          'Group',
          undefined,
          control.value.rootSchema,
        );
        (propUiSchema as GroupLayout).label =
          propSchema.title ?? startCase(propName);
      } else {
        propUiSchema = createControlElement('#');
      }

      propSchema = {
        ...propSchema,
        title: propName,
      };
      if (propSchema.type === 'object') {
        propSchema.additionalProperties =
          propSchema.additionalProperties !== false
            ? (propSchema.additionalProperties ?? true)
            : false;
      } else if (propSchema.type === 'array') {
        propSchema.items = propSchema.items ?? {};
      }

      return {
        propertyName: propName,
        path: composePaths(control.value.path, propName),
        schema: propSchema,
        uischema: propUiSchema,
      };
    };

    const appliedOptions = useControlAppliedOptions(props.input);
    const additionalPropertyItems = ref<AdditionalPropertyType[]>(
      additionalKeys.value.map((propName) =>
        toAdditionalPropertyType(
          propName,
          control.value.data[propName],
          control.value.schema,
          control.value.rootSchema,
        ),
      ),
    );

    const styles = useStyles(control.value.uischema);
    const newPropertyName = ref<string | null>('');
    const newPropertyErrors = ref<ErrorObject[] | undefined>(undefined);
    const additionalErrors = ref<ErrorObject[]>([]);
    const renamingPropertyName = ref<string | null>(null);
    const renameValue = ref('');
    const renameError = ref<string | null>(null);

    const propertyNameSchema = computed<JsonSchema7>(() => {
      let result: JsonSchema7 = {
        type: 'string',
      };
      // TODO: create issue against jsonforms to add propertyNames into the JsonSchema interface
      // propertyNames exist in draft-6 but not defined in the JsonSchema
      if (typeof (control.value.schema as any).propertyNames === 'object') {
        result = {
          ...(control.value.schema as any).propertyNames,
          ...result,
        };
      } else if (
        (control.value.schema as any).additionalProperties === false &&
        typeof (control.value.schema as any).patternProperties === 'object'
      ) {
        // check if additionalProperties explicitly set to false then the only valid property names will be derived from patternProperties

        const patterns = Object.keys(
          (control.value.schema as any).patternProperties,
        );
        if (patterns.length > 0) {
          result = {
            pattern: patterns.join('|'),
            ...result,
          };
        }
      }
      return result;
    });

    const propertyNameChange = (event: JsonFormsChangeEvent) => {
      newPropertyName.value = typeof event.data === 'string' ? event.data : '';
      let newAdditionalErrors: ErrorObject[] = [];

      if (
        typeof control.value.data === 'object' &&
        control.value.data &&
        Object.keys(control.value.data).find((e) => e === newPropertyName.value)
      ) {
        newAdditionalErrors = [
          {
            data: newPropertyName.value,
            instancePath: '',
            keyword: '',
            message: unref(
              translations[
                AdditionalPropertiesTranslationEnum.propertyAlreadyDefined
              ],
            )!,
            params: { propertyName: newPropertyName.value },
            schemaPath: '',
          },
        ];
      }

      // JSONForms has special means for "[]." chars - those are part of the path composition so for not we can't support those without special handling
      if (
        newPropertyName.value.includes('[') ||
        newPropertyName.value.includes(']') ||
        newPropertyName.value.includes('.')
      ) {
        newAdditionalErrors = [
          {
            data: newPropertyName.value,
            instancePath: '',
            keyword: '',
            message: unref(
              translations[
                AdditionalPropertiesTranslationEnum.propertyNameInvalid
              ],
            )!,
            params: { propertyName: newPropertyName.value },
            schemaPath: '',
          },
        ];
      }

      if (!isEqual(additionalErrors.value, newAdditionalErrors)) {
        // only change the additional errors if different to prevent recursive calls
        additionalErrors.value = newAdditionalErrors;
      }
      newPropertyErrors.value = [...(event.errors ?? [])];
    };

    const vuetifyProps = (path: string) => {
      const props = get(appliedOptions.value?.vuetify, path);

      return props && isPlainObject(props) ? props : {};
    };

    const icons = useIcons();
    const t = useTranslator();

    const i18nAdditionalPropertiesPrefix = getI18nKeyPrefix(
      control.value.schema,
      control.value.uischema,
      control.value.path + '.additionalProperties',
    );

    const translations = getAdditionalPropertiesTranslations(
      t.value,
      additionalPropertiesDefaultTranslations,
      i18nAdditionalPropertiesPrefix,
      control.value.label,
      newPropertyName,
    );

    const propertyNameLabel =
      translations[AdditionalPropertiesTranslationEnum.propertyNameLabel];

    const { mdAndUp } = useDisplay();

    const {
      validationMode: parentValidationMode,
      i18n,
      middleware,
      ajv,
    } = useJsonForms();

    // if the new property name is not specified then hide any errors
    const validationMode = computed(() =>
      newPropertyName.value ? parentValidationMode : 'ValidateAndHide',
    );

    // use the default value since all properties are dynamic so preserve the property key
    provide(IsDynamicPropertyContext, true);

    return {
      validationMode: validationMode,
      i18n: i18n ? markRaw(i18n) : i18n,
      middleware: middleware ? markRaw(middleware) : middleware,
      t,
      mdAndUp,
      vuetifyProps,
      ajv: ajv ? markRaw(ajv) : ajv,
      control,
      styles,
      appliedOptions,
      additionalPropertyItems,
      reservedPropertyNames,
      toAdditionalPropertyType,
      additionalKeys,
      newPropertyName,
      propertyNameLabel,
      propertyNameChange,
      newPropertyErrors,
      additionalErrors,
      renamingPropertyName,
      renameValue,
      renameError,
      icons,
      isControlEditable,
      propertyNameSchema,
      translations,
    };
  },
  computed: {
    addPropertyDisabled(): boolean {
      return (
        // add is disabled because the overall control is disabled
        !this.isControlEditable(this.control) ||
        // add is disabled because of contraints
        (this.appliedOptions.restrict && this.maxPropertiesReached) ||
        // add is disabled because there are errors for the new property name or it is not specified
        (this.newPropertyErrors && this.newPropertyErrors.length > 0) ||
        (this.additionalErrors && this.additionalErrors.length > 0) ||
        !this.newPropertyName
      );
    },
    maxPropertiesReached(): boolean {
      return (
        this.control.schema.maxProperties !== undefined && // we have maxProperties constraint
        this.control.data && // we have data to check
        // the current number of properties in the object is greater or equals to the maxProperties
        Object.keys(this.control.data).length >=
          this.control.schema.maxProperties
      );
    },
    removePropertyDisabled(): boolean {
      return (
        // add is disabled because the overall control is disabled
        !this.isControlEditable(this.control) ||
        // add is disabled because of contraints
        (this.appliedOptions.restrict && this.minPropertiesReached)
      );
    },
    minPropertiesReached(): boolean {
      return (
        this.control.schema.minProperties !== undefined && // we have minProperties constraint
        this.control.data && // we have data to check
        // the current number of properties in the object is less or equals to the minProperties
        Object.keys(this.control.data).length <=
          this.control.schema.minProperties
      );
    },
    additionalPropertiesTitle(): string | undefined {
      const title = (this.control.schema.additionalProperties as JsonSchema7)
        ?.title;
      return title ? this.t(title, title) : title;
    },
  },
  watch: {
    'control.data': {
      handler(newData, oldData) {
        const additionalKeys = (data: Record<string, any> | undefined) =>
          Object.keys(data || {}).filter(
            (k) => !this.reservedPropertyNames.includes(k),
          );

        if (!isEqual(additionalKeys(newData), additionalKeys(oldData))) {
          this.additionalPropertyItems = this.additionalKeys.map((propName) =>
            this.toAdditionalPropertyType(
              propName,
              newData[propName],
              this.control.schema,
              this.control.rootSchema,
            ),
          );
        }
      },
      deep: true,
    },
  },
  methods: {
    composePaths,
    additionalPropertyRowClasses(element: AdditionalPropertyType): string[] {
      const schemaType = element.schema?.type;
      const classes = ['additional-property-row'];

      if (Array.isArray(schemaType)) {
        classes.push('additional-property-row--mixed');
      } else if (schemaType === 'object') {
        classes.push('additional-property-row--object');
      } else if (schemaType === 'array') {
        classes.push('additional-property-row--array');
      } else {
        classes.push('additional-property-row--primitive');
      }

      return classes;
    },
    validatePropertyName(
      propertyName: string,
      currentPropertyName?: string,
    ): string | null {
      if (!propertyName) {
        return null;
      }

      if (
        typeof this.control.data === 'object' &&
        this.control.data &&
        Object.prototype.hasOwnProperty.call(this.control.data, propertyName)
      ) {
        if (propertyName === currentPropertyName) {
          return null;
        }
        return (
          unref(
            this.translations[
              AdditionalPropertiesTranslationEnum.propertyAlreadyDefined
            ],
          ) ?? `Property '${propertyName}' already defined`
        );
      }

      if (
        propertyName.includes('[') ||
        propertyName.includes(']') ||
        propertyName.includes('.')
      ) {
        return (
          unref(
            this.translations[
              AdditionalPropertiesTranslationEnum.propertyNameInvalid
            ],
          ) ?? `Property name '${propertyName}' is invalid`
        );
      }

      const pattern = this.propertyNameSchema.pattern;
      if (pattern && !new RegExp(pattern).test(propertyName)) {
        return `Property name must match pattern: ${pattern}`;
      }

      return null;
    },
    startRename(propName: string): void {
      this.renamingPropertyName = propName;
      this.renameValue = propName;
      this.renameError = null;
    },
    cancelRename(): void {
      this.renamingPropertyName = null;
      this.renameValue = '';
      this.renameError = null;
    },
    renamePropertyDisabled(propName: string): boolean {
      const trimmed = this.renameValue.trim();
      return (
        !this.isControlEditable(this.control) ||
        !trimmed ||
        trimmed === propName ||
        Boolean(this.validatePropertyName(trimmed, propName))
      );
    },
    updateRenameError(propName: string): void {
      this.renameError = this.validatePropertyName(
        this.renameValue.trim(),
        propName,
      );
    },
    renameProperty(propName: string): void {
      const trimmed = this.renameValue.trim();
      this.renameError = this.validatePropertyName(trimmed, propName);
      if (
        this.renameError ||
        !trimmed ||
        trimmed === propName ||
        typeof this.control.data !== 'object' ||
        this.control.data === null ||
        Array.isArray(this.control.data)
      ) {
        return;
      }

      const updatedData = Object.fromEntries(
        Object.entries(this.control.data).map(([key, value]) => [
          key === propName ? trimmed : key,
          value,
        ]),
      );
      this.input.handleChange(this.control.path, updatedData);
      this.cancelRename();
    },
    addProperty() {
      if (this.newPropertyName) {
        const additionalProperty = this.toAdditionalPropertyType(
          this.newPropertyName,
          undefined,
          this.control.schema,
          this.control.rootSchema,
        );
        if (additionalProperty) {
          this.additionalPropertyItems = [
            ...this.additionalPropertyItems,
            additionalProperty,
          ];
        }

        if (
          typeof this.control.data === 'object' &&
          additionalProperty.schema
        ) {
          const updatedData = { ...this.control.data };

          updatedData[this.newPropertyName] = createDefaultValue(
            additionalProperty.schema,
            this.control.rootSchema,
          );

          // we need always to preserve the key even when the value is "empty"
          this.input.handleChange(this.control.path, updatedData);
        }
      }
      this.newPropertyName = '';
    },
    removeProperty(propName: string): void {
      this.additionalPropertyItems = this.additionalPropertyItems.filter(
        (d) => d.propertyName !== propName,
      );
      if (typeof this.control.data === 'object') {
        const updatedData = { ...this.control.data };
        delete updatedData[propName];
        this.input.handleChange(this.control.path, updatedData);
      }
    },
  },
});
</script>

<style scoped>
.additional-properties-card {
  margin-top: 8px;
}

.additional-properties-items {
  width: 100%;
}

.additional-properties-add {
  align-items: flex-start;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
}

.additional-properties-add--with-title {
  grid-template-columns: minmax(180px, max-content) minmax(0, 1fr) auto;
}

.additional-properties-title {
  padding-top: 10px;
}

.additional-properties-add-field {
  min-width: 0;
}

.additional-property-row {
  align-items: flex-start;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;
  min-width: 0;
  width: 100%;
}

.additional-property-content {
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

.additional-property-action-button {
  height: 24px;
  width: 24px;
}

.additional-property-action-button :deep(.v-icon) {
  font-size: 16px;
}

.additional-property-rename-menu {
  min-width: 280px;
  padding: 12px;
}

.additional-property-rename-actions {
  align-items: flex-start;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
