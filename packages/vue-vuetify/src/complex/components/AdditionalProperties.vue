<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="control.visible" v-bind="vuetifyProps('v-card')" flat>
          <v-container>
            <v-row>
              <v-col v-if="mdAndUp && additionalPropertiesTitle">
                {{ additionalPropertiesTitle }}</v-col
              >
              <v-col>
                <json-forms
                  :data="newPropertyName"
                  :uischema="
                    {
                      type: 'Control',
                      scope: '#/',
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
          <v-container v-bind="vuetifyProps('v-container')">
            <v-row
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { additionalPropertiesDefaultTranslations } from '@/i18n/additionalPropertiesTranslations';
import { getAdditionalPropertiesTranslations } from '@/i18n/i18nUtil';
import {
  Generate,
  composePaths,
  createControlElement,
  createDefaultValue,
  encode,
  getI18nKeyPrefix,
  type GroupLayout,
  type JsonSchema,
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
import isPlainObject from 'lodash/isPlainObject';
import startCase from 'lodash/startCase';
import isEqual from 'lodash/isEqual';
import {
  computed,
  defineComponent,
  markRaw,
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
import { AdditionalPropertiesTranslationEnum } from '@/i18n';

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
      Object.keys(control.value.data).filter(
        (k) => !reservedPropertyNames.value.includes(k),
      ),
    );

    const toAdditionalPropertyType = (
      propName: string,
      propValue: any,
    ): AdditionalPropertyType => {
      let propSchema: JsonSchema | undefined = undefined;
      let propUiSchema: UISchemaElement | undefined = undefined;

      if (control.value.schema.patternProperties) {
        const matchedPattern = Object.keys(
          control.value.schema.patternProperties,
        ).find((pattern) => new RegExp(pattern).test(propName));
        if (matchedPattern) {
          propSchema = control.value.schema.patternProperties[matchedPattern];
        }
      }

      if (
        !propSchema &&
        typeof control.value.schema.additionalProperties === 'object'
      ) {
        propSchema = control.value.schema.additionalProperties;
      }

      if (!propSchema && propValue !== undefined) {
        // can't find the propertySchema so use the schema based on the value
        // this covers case where the data in invalid according to the schema
        propSchema = Generate.jsonSchema(
          { prop: propValue },
          {
            additionalProperties: false,
            required: () => false,
          },
        ).properties?.prop;
      }

      if (propSchema) {
        if (propSchema.type === 'object' || propSchema.type === 'array') {
          propUiSchema = Generate.uiSchema(propSchema, 'Group');
          (propUiSchema as GroupLayout).label =
            propSchema.title ?? startCase(propName);
        } else {
          propUiSchema = createControlElement(
            control.value.path + '/' + encode(propName),
          );
        }
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
        toAdditionalPropertyType(propName, control.value.data[propName]),
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
      toAdditionalPropertyType,
      newPropertyName,
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
      handler(newData) {
        // revert back any undefined values back to the default value when the key is part of the addtional properties since we want to preserved the key
        // for example when we have a string additonal property then when we clear the text component the componet by default sets the value to undefined to remove the property from the object - for additional properties we do not want that behaviour
        if (typeof newData === 'object' && newData) {
          const keys = Object.keys(newData);
          let hasChanges = false;
          const updatedData = { ...newData };

          this.additionalPropertyItems.forEach((ap) => {
            if (
              ap.schema &&
              (!keys.includes(ap.propertyName) ||
                updatedData[ap.propertyName] === undefined ||
                (updatedData[ap.propertyName] === null &&
                  ap.schema.type !== 'null')) // createDefaultValue will return null only when the ap.schema.type is 'null'
            ) {
              const newValue = createDefaultValue(
                ap.schema,
                this.control.rootSchema,
              );
              hasChanges = updatedData[ap.propertyName] !== newValue;

              updatedData[ap.propertyName] = newValue;
            }
          });
          if (hasChanges) {
            this.input.handleChange(this.control.path, updatedData);
          }
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
