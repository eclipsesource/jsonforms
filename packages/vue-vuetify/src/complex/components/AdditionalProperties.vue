<template>
  <v-card v-if="control.visible" v-bind="vuetifyProps('v-card')" flat>
    <v-container class="py-0">
      <v-row no-gutters>
        <v-col v-if="mdAndUp && additionalPropertiesTitle">
          {{ additionalPropertiesTitle }}</v-col
        >
        <v-col>
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
            :readonly="!control.enabled"
            :validation-mode="validationMode"
            :i18n="i18n"
            :ajv="ajv"
            :middleware="middleware"
            @change="propertyNameChange"
          ></json-forms
        ></v-col>
        <v-tooltip bottom>
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
      </v-row>
    </v-container>
    <v-container v-bind="vuetifyProps('v-container')" class="py-0">
      <v-row
        no-gutters
        v-for="element in additionalPropertyItems"
        :key="`${element.propertyName}`"
      >
        <v-col class="flex-shrink-0 flex-grow-1">
          <dispatch-renderer
            v-if="element.schema && element.uischema"
            :schema="element.schema"
            :uischema="element.uischema"
            :path="element.path"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
        /></v-col>
        <v-col v-if="control.enabled" class="flex-shrink-1 flex-grow-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                elevation="0"
                small
                :aria-label="translations.removeAriaLabel"
                :disabled="removePropertyDisabled"
                @click="removeProperty(element.propertyName)"
              >
                <v-icon class="notranslate">{{
                  icons.current.value.itemDelete
                }}</v-icon>
              </v-btn>
            </template>
            {{ translations.removeTooltip }}
          </v-tooltip></v-col
        >
      </v-row>
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
  encode,
  getI18nKeyPrefix,
  type GroupLayout,
  type JsonSchema,
  type JsonSchema4,
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  JsonForms,
  useJsonFormsControlWithDetail,
  type JsonFormsChangeEvent,
} from '@jsonforms/vue';
import type { ErrorObject } from 'ajv';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import startCase from 'lodash/startCase';

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
  VCol,
  VContainer,
  VIcon,
  VRow,
  VTooltip,
} from 'vuetify/components';
import { DisabledIconFocus } from '../../controls/directives';
import { useStyles } from '../../styles';
import {
  useControlAppliedOptions,
  useIcons,
  useJsonForms,
  useTranslator,
} from '../../util';
import { IsDynamicPropertyContext } from '@/util/inject';

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
    VContainer,
    VRow,
    VCol,
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
        propSchema = Resolve.schema(propSchema, propSchema.$ref, rootSchema);
      }

      if (!propSchema && propValue !== undefined) {
        // can't find the propertySchema so use the schema based on the value
        // this covers case where the data in invalid according to the schema
        propSchema = Generate.jsonSchema(
          { prop: propValue },
          {
            additionalProperties: true,
            required: (_props: { [property: string]: JsonSchema4 }) => false,
          },
        ).properties?.prop;
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
        propUiSchema = createControlElement('#/' + encode(propName));
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
      icons,
      propertyNameSchema,
      translations,
    };
  },
  computed: {
    addPropertyDisabled(): boolean {
      return (
        // add is disabled because the overall control is disabled
        !this.control.enabled ||
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
        !this.control.enabled ||
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
        function isEqualIgnoringKeys(
          obj1: Record<string, any>,
          obj2: Record<string, any>,
          keysToIgnore: string[],
        ) {
          // Omit the specified keys from both objects
          const filteredObj1 = omit(obj1, keysToIgnore);
          const filteredObj2 = omit(obj2, keysToIgnore);

          // Perform a deep comparison
          // return isEqual(filteredObj1, filteredObj2);

          // compare with property order as well
          return JSON.stringify(filteredObj1) === JSON.stringify(filteredObj2);
        }

        if (
          !isEqualIgnoringKeys(newData, oldData, this.reservedPropertyNames)
        ) {
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
