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

              <v-text-field
                v-disabled-icon-focus
                :id="control.id + '-additional-properties-input'"
                :class="styles.control.input"
                :disabled="!control.enabled"
                :label="propertyNameLabel"
                :hint="propertyNameDescription"
                :required="true"
                :error-messages="newPropertyErrors"
                :maxlength="
                  appliedOptions.restrict && propertyNameSchema
                    ? propertyNameSchema.maxLength
                    : undefined
                "
                :counter="
                  propertyNameSchema &&
                  propertyNameSchema.maxLength !== undefined
                    ? propertyNameSchema.maxLength
                    : undefined
                "
                v-model="newPropertyName"
                :clearable="control.enabled"
                v-bind="vuetifyProps('v-text-field')"
              >
              </v-text-field>
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
              v-for="(element, index) in additionalPropertyItems"
              :key="`${index}`"
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
  validate,
  type GroupLayout,
  type JsonSchema,
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  useJsonFormsControlWithDetail,
} from '@jsonforms/vue';
import Ajv, { type ValidateFunction } from 'ajv';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import startCase from 'lodash/startCase';
import { defineComponent, ref, unref, type PropType } from 'vue';
import { useDisplay } from 'vuetify';
import {
  VBtn,
  VCard,
  VCol,
  VContainer,
  VIcon,
  VRow,
  VTextField,
  VTooltip,
} from 'vuetify/components';
import { DisabledIconFocus } from '../../controls/directives';
import { useStyles } from '../../styles';
import {
  useAjv,
  useControlAppliedOptions,
  useIcons,
  useTranslator,
} from '../../util';

type Input = ReturnType<typeof useJsonFormsControlWithDetail>;
interface AdditionalPropertyType {
  propertyName: string;
  path: string;
  schema: JsonSchema | undefined;
  uischema: UISchemaElement | undefined;
}

const reuseAjvForSchema = (ajv: Ajv, schema: JsonSchema): Ajv => {
  if (
    Object.prototype.hasOwnProperty.call(schema, 'id') ||
    Object.prototype.hasOwnProperty.call(schema, '$id')
  ) {
    ajv.removeSchema(schema);
  }
  return ajv;
};

export default defineComponent({
  name: 'additional-properties',
  components: {
    DispatchRenderer,
    VCard,
    VTooltip,
    VIcon,
    VBtn,
    VTextField,
    VContainer,
    VRow,
    VCol,
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
    const reservedPropertyNames = Object.keys(
      control.value.schema.properties || {},
    );

    const additionalKeys = Object.keys(control.value.data).filter(
      (k) => !reservedPropertyNames.includes(k),
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
    const additionalPropertyItems = ref<AdditionalPropertyType[]>([]);

    additionalKeys.forEach((propName) => {
      const additionalProperty = toAdditionalPropertyType(
        propName,
        control.value.data[propName],
      );
      additionalPropertyItems.value.push(additionalProperty);
    });

    const styles = useStyles(control.value.uischema);
    const newPropertyName = ref<string | null>('');
    const ajv = useAjv();

    let propertyNameSchema: JsonSchema7 | undefined = undefined;
    let propertyNameValidator: ValidateFunction<unknown> | undefined =
      undefined;

    // TODO: create issue against jsonforms to add propertyNames into the JsonSchema interface
    // propertyNames exist in draft-6 but not defined in the JsonSchema
    if (typeof (control.value.schema as any).propertyNames === 'object') {
      propertyNameSchema = (control.value.schema as any).propertyNames;
    }

    if (
      typeof control.value.schema.additionalProperties !== 'object' &&
      typeof control.value.schema.patternProperties === 'object'
    ) {
      const matchPatternPropertiesKeys: JsonSchema7 = {
        type: 'string',
        pattern: Object.keys(control.value.schema.patternProperties).join('|'),
      };

      propertyNameSchema = propertyNameSchema
        ? { allOf: [propertyNameSchema, matchPatternPropertiesKeys] }
        : matchPatternPropertiesKeys;
    }

    if (propertyNameSchema) {
      propertyNameValidator = reuseAjvForSchema(
        ajv,
        propertyNameSchema,
      ).compile(propertyNameSchema);
    }

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

    return {
      t,
      mdAndUp,
      vuetifyProps,
      ajv,
      propertyNameValidator,
      control,
      styles,
      appliedOptions,
      additionalPropertyItems,
      toAdditionalPropertyType,
      newPropertyName,
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
        this.newPropertyErrors.length > 0 ||
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
    newPropertyErrors(): string[] {
      if (this.newPropertyName) {
        const messages = this.propertyNameValidator
          ? (validate(this.propertyNameValidator, this.newPropertyName)
              .map((error) => error.message)
              .filter((message) => message) as string[])
          : [];
        if (
          this.reservedPropertyNames.includes(this.newPropertyName) ||
          this.additionalPropertyItems.find(
            (ap) => ap.propertyName === this.newPropertyName,
          ) !== undefined
        ) {
          // already defined
          const propertyAlreadyDefined = unref(
            this.translations.propertyAlreadyDefined,
          );

          if (propertyAlreadyDefined) {
            messages.push(propertyAlreadyDefined);
          }
        }

        const invalidPropertyNameMessage = unref(
          this.translations.propertyNameInvalid!,
        );
        // JSONForms has special means for "[]." chars - those are part of the path composition so for not we can't support those without special handling
        if (
          (this.newPropertyName.includes('[') ||
            this.newPropertyName.includes(']') ||
            this.newPropertyName.includes('.')) &&
          invalidPropertyNameMessage
        ) {
          messages.push(invalidPropertyNameMessage);
        }

        return messages;
      }

      return [];
    },
    additionalPropertiesTitle(): string | undefined {
      const title = (this.control.schema.additionalProperties as JsonSchema7)
        ?.title;
      return title ? this.t(title, title) : title;
    },
    propertyNameLabel(): string | null {
      return this.propertyNameSchema?.title
        ? this.t(this.propertyNameSchema.title, this.propertyNameSchema.title)
        : unref(this.translations.propertyNameLabel!);
    },
    propertyNameDescription(): string | undefined {
      return this.propertyNameSchema?.description
        ? this.t(
            this.propertyNameSchema.description,
            this.propertyNameSchema.description,
          )
        : this.propertyNameSchema?.description;
    },
    reservedPropertyNames(): string[] {
      return Object.keys(this.control.schema.properties || {});
    },
  },
  watch: {
    'control.data': {
      handler(newData) {
        // revert back any undefined values back to the default value when the key is part of the addtional properties since we want to preserved the key
        // for example when we have a string additonal property then when we clear the text component the componet by default sets the value to undefined to remove the property from the object - for additional properties we do not want that behaviour
        if (typeof this.control.data === 'object') {
          const keys = Object.keys(newData);
          let hasChanges = false;
          this.additionalPropertyItems.forEach((ap) => {
            if (
              ap.schema &&
              (!keys.includes(ap.propertyName) ||
                newData[ap.propertyName] === undefined ||
                (newData[ap.propertyName] === null &&
                  ap.schema.type !== 'null')) // createDefaultValue will return null only when the ap.schema.type is 'null'
            ) {
              const newValue = createDefaultValue(
                ap.schema,
                this.control.rootSchema,
              );
              hasChanges = newData[ap.propertyName] !== newValue;
              newData[ap.propertyName] = newValue;
            }
          });
          if (hasChanges) {
            this.input.handleChange(this.control.path, newData);
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
          this.control.data[this.newPropertyName] = createDefaultValue(
            additionalProperty.schema,
            this.control.rootSchema,
          );
          // we need always to preserve the key even when the value is "empty"
          this.input.handleChange(this.control.path, this.control.data);
        }
      }
      this.newPropertyName = '';
    },
    removeProperty(propName: string): void {
      this.additionalPropertyItems = this.additionalPropertyItems.filter(
        (d) => d.propertyName !== propName,
      );
      if (typeof this.control.data === 'object') {
        delete this.control.data[propName];
        this.input.handleChange(this.control.path, this.control.data);
      }
    },
  },
});
</script>
