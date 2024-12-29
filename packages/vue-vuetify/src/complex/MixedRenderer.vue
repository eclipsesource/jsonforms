<template>
  <div
    :class="[
      'prefixed-input',
      { 'vertical-layout': valueType === 'object' || valueType === 'array' },
    ]"
    v-if="control.visible"
  >
    <v-select
      v-if="mixedRenderInfos && mixedRenderInfos.length > 1"
      :class="['prefix']"
      v-disabled-icon-focus
      :id="control.id + '-input-selector'"
      :disabled="!control.enabled"
      :label="computedLabel"
      :required="control.required"
      :error-messages="control.errors"
      :items="mixedRenderInfos"
      :clearable="control.enabled"
      @update:model-value="handleSelectChange"
      :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
      item-value="index"
      v-model="selectedIndex"
      v-bind="vuetifyProps('v-select')"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    </v-select>
    <dispatch-renderer
      :class="['input']"
      v-if="schema && !(nullable && control.data === null)"
      :schema="schema"
      :uischema="uischema"
      :path="path"
      :renderers="control.renderers"
      :cells="control.cells"
      :enabled="control.enabled"
    >
    </dispatch-renderer>
  </div>
</template>

<script lang="ts">
import {
  createControlElement,
  createDefaultValue,
  findUISchema,
  type ControlElement,
  type JsonFormsUISchemaRegistryEntry,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { VSelect, VBtn } from 'vuetify/components';
import { DisabledIconFocus } from '../controls';
import {
  useCombinatorTranslations,
  useIcons,
  useJsonForms,
  useTranslator,
  useVuetifyControl,
} from '../util';

interface SchemaRenderInfo {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

function cleanSchema(schema: JsonSchema) {
  // Define valid keywords for each JSON Schema type
  const validKeywords: Record<string, string[]> = {
    array: ['items', 'minItems', 'maxItems', 'uniqueItems', 'contains'],
    object: [
      'properties',
      'required',
      'additionalProperties',
      'minProperties',
      'maxProperties',
      'patternProperties',
      'dependencies',
      'propertyNames',
    ],
    string: ['minLength', 'maxLength', 'pattern', 'format'],
    number: [
      'minimum',
      'maximum',
      'exclusiveMinimum',
      'exclusiveMaximum',
      'multipleOf',
    ],
    integer: [
      'minimum',
      'maximum',
      'exclusiveMinimum',
      'exclusiveMaximum',
      'multipleOf',
    ],
    boolean: [],
    null: [],
  };

  // Function to remove invalid keywords based on type
  function clean(schema: JsonSchema) {
    for (const validType in validKeywords) {
      if (validType !== schema.type) {
        const keywords = validKeywords[validType];
        keywords.forEach((key) => {
          delete (schema as any)[key];
        });
      }
    }
  }

  return clean(schema);
}

function getSchemaTypesAsArray(schema: JsonSchema): string[] {
  if (typeof schema.type === 'string') {
    return [schema.type];
  }

  if (Array.isArray(schema.type)) {
    return schema.type;
  }

  if (Array.isArray(schema.enum)) {
    const enumTypes = new Set(
      schema.enum.map((value) => getJsonDataType(value)),
    );
    if (!enumTypes.has(null)) {
      // return only if we were able to determine all types, otherwise return the default
      return Array.from(enumTypes).filter((type) => type !== null) as string[];
    }
  }

  // return any
  return ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];
}

const createMixedRenderInfos = (
  schema: JsonSchema,
  rootSchema: JsonSchema,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[],
): SchemaRenderInfo[] => {
  let schemas: JsonSchema[] = [];

  if (typeof schema.type === 'string') {
    schemas.push(schema);
  } else {
    const types = getSchemaTypesAsArray(schema);

    types.forEach((type) => {
      schemas.push({
        ...schema,
        type,
        default:
          schema.default !== undefined &&
          type === getJsonDataType(schema.default)
            ? schema.default
            : undefined,
      });
    });
  }

  return schemas.map((schema) => {
    if (schema.type === 'object') {
      schema.additionalProperties =
        schema.additionalProperties !== false
          ? (schema.additionalProperties ?? true)
          : false;
    } else if (schema.type === 'array') {
      schema.items = schema.items ?? {};
      if (!(schema.items as any)) {
        (schema.items as any).type = [
          'array',
          'boolean',
          'integer',
          'null',
          'number',
          'object',
          'string',
        ];
      }
    }

    // help determining the correct renders by removing keywords not appropriate for the type
    cleanSchema(schema);

    const detailsForSchema = control.options
      ? control.options[schema.type + '-detail']
      : undefined;

    const schemaControl = detailsForSchema
      ? {
          ...control,
          options: { ...control.options, detail: detailsForSchema },
        }
      : control;

    return {
      schema,
      uischema: findUISchema(
        uischemas,
        schema,
        control.scope,
        path,
        () => createControlElement(control.scope),
        schemaControl,
        rootSchema,
      ),
      label: `${schema.type}`,
    };
  });
};

export function getJsonDataType(value: any): string | null {
  if (typeof value === 'string') {
    return 'string';
  } else if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (value === null) {
    return 'null';
  } else if (typeof value === 'object') {
    return 'object';
  }

  return null;
}

const controlRenderer = defineComponent({
  name: 'mixed-renderer',
  components: {
    DispatchRenderer,
    VBtn,
    VSelect,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const path = props.path;
    const input = useJsonFormsControl(props);

    const control = input.control.value;
    const valueType = ref(getJsonDataType(control.data));
    const jsonforms = useJsonForms();
    const icons = useIcons();

    watch(
      () => input.control.value.data,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          const oldValueType = valueType.value;
          valueType.value = getJsonDataType(newValue);

          if (oldValueType !== valueType.value) {
            // adjust the index
            selectedIndex.value = matchingSchema.value?.index;
          }
        }
      },
      { deep: false },
    );

    const mixedRenderInfos = computed<
      (SchemaRenderInfo & {
        index: number;
      })[]
    >(() => {
      const result = createMixedRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        control.schema,
        control.rootSchema,
        control.uischema,
        control.path,
        jsonforms.uischemas || [],
      );

      return result
        .filter((info) => info.uischema)
        .map((info, index) => ({ ...info, index: index }));
    });

    const nullable = computed(() =>
      mixedRenderInfos.value.some((info) => info.schema.type === 'null'),
    );

    const matchingSchema = computed(() => {
      let result = mixedRenderInfos.value.find(
        (entry) => entry.schema.type === valueType.value,
      );
      if (!result) {
        result = mixedRenderInfos.value.find(
          (entry) =>
            entry.schema.type === 'number' && valueType.value === 'integer',
        );
      }
      if (!result && mixedRenderInfos.value.length === 1) {
        result = mixedRenderInfos.value[0];
      }
      return result;
    });

    const selectedIndex = ref<number | undefined | null>(
      matchingSchema.value?.index,
    );

    const t = useTranslator();

    const schema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value].schema
        : undefined,
    );
    const uischema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value].uischema
        : undefined,
    );

    return {
      ...useCombinatorTranslations(useVuetifyControl(input)),
      nullable,
      mixedRenderInfos,
      selectedIndex,
      t,
      valueType,
      schema,
      uischema,
      path,
      icons,
    };
  },
  methods: {
    setToNull(): void {
      this.handleChange(this.control.path, null);
    },
    handleSelectChange(newIndex: number): void {
      const newData =
        newIndex != null
          ? createDefaultValue(
              this.mixedRenderInfos[newIndex].schema,
              this.control.rootSchema,
            )
          : undefined;

      this.handleChange(this.control.path, newData);
      this.selectedIndex = newIndex;

      const type = newIndex
        ? this.mixedRenderInfos[newIndex]?.schema?.type
        : null;
      this.valueType = type as string | null; // we know that this should be either a string or null
    },
  },
});

export default controlRenderer;
</script>
<style scoped>
.prefixed-input {
  display: flex;
  align-items: center;
}

.vertical-layout {
  flex-direction: column;
  align-items: flex-start;
}

.prefix {
}

.input {
  flex-grow: 1;
  width: 100%;
}
</style>
