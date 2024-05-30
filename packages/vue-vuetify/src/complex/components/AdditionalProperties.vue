<template>
  <v-card v-if="control.visible" elevation="0" v-bind="vuetifyProps('v-card')">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>{{ additionalPropertiesTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
          v-disabled-icon-focus
          :required="true"
          :class="styles.control.input"
          :error-messages="newPropertyErrors"
          v-model="newPropertyName"
          :clearable="control.enabled"
          :placeholder="placeholder"
          :disabled="!control.enabled"
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
              :aria-label="addToLabel"
              v-bind="props"
              :disabled="addPropertyDisabled"
              @click="addProperty"
            >
              <v-icon>{{ icons.current.value.itemAdd }}</v-icon>
            </v-btn>
          </template>
          {{ addToLabel }}
        </v-tooltip>
      </v-toolbar>
    </v-card-title>
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
                :aria-label="deleteLabel"
                :disabled="removePropertyDisabled"
                @click="removeProperty(element.propertyName)"
              >
                <v-icon class="notranslate">{{
                  icons.current.value.itemDelete
                }}</v-icon>
              </v-btn>
            </template>
            {{ deleteLabel }}
          </v-tooltip></v-col
        >
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {
  composePaths,
  createControlElement,
  createDefaultValue,
  encode,
  Generate,
  getI18nKey,
  type GroupLayout,
  type JsonSchema,
  type JsonSchema7,
  type UISchemaElement,
  validate,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  useJsonFormsControlWithDetail,
} from '@jsonforms/vue';
import Ajv, { type ValidateFunction } from 'ajv';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import startCase from 'lodash/startCase';
import { defineComponent, type PropType, ref } from 'vue';
import {
  VBtn,
  VCard,
  VCardTitle,
  VCol,
  VContainer,
  VIcon,
  VRow,
  VSpacer,
  VTextField,
  VToolbar,
  VToolbarTitle,
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
    VToolbar,
    VIcon,
    VBtn,
    VCardTitle,
    VSpacer,
    VToolbarTitle,
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

    const t = useTranslator();
    const icons = useIcons();

    return {
      t,
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
          messages.push(
            `Property '${this.newPropertyName}' is already defined`,
          );
        }

        // JSONForms has special means for "[]." chars - those are part of the path composition so for not we can't support those without special handling
        if (this.newPropertyName.includes('[')) {
          messages.push('Property name contains invalid char: [');
        }
        if (this.newPropertyName.includes(']')) {
          messages.push('Property name contains invalid char: ]');
        }
        if (this.newPropertyName.includes('.')) {
          messages.push('Property name contains invalid char: .');
        }

        return messages;
      }

      return [];
    },
    placeholder(): string {
      return this.t(this.i18nKey('newProperty.placeholder'), 'New Property');
    },
    reservedPropertyNames(): string[] {
      return Object.keys(this.control.schema.properties || {});
    },
    additionalPropertiesTitle(): string | undefined {
      const additionalProperties = this.control.schema.additionalProperties;

      const label =
        typeof additionalProperties === 'object' &&
        Object.prototype.hasOwnProperty.call(additionalProperties, 'title')
          ? additionalProperties.title ?? 'Additional Properties'
          : 'Additional Properties';

      return this.t(this.i18nKey('title'), label);
    },
    addToLabel(): string {
      return this.t(
        this.i18nKey('btn.add'),
        'Add to ${additionalProperties.title}',
        {
          additionalProperties: {
            title: this.additionalPropertiesTitle,
          },
        },
      );
    },
    deleteLabel(): string {
      return this.t(
        this.i18nKey('btn.delete'),
        'Delete from ${additionalProperties.title}',
        {
          additionalProperties: {
            title: this.additionalPropertiesTitle,
          },
        },
      );
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
    i18nKey(key: string): string {
      return getI18nKey(
        this.control.schema,
        this.control.uischema,
        this.control.path,
        `additionalProperties.${key}`,
      );
    },
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
