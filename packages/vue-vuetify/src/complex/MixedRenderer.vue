<template>
  <div class="prefixed-input" v-if="control.visible">
    <template v-if="valueType === 'array' || valueType === 'object'">
      <v-expansion-panels accordion flat v-model="currentlyExpanded">
        <v-expansion-panel>
          <v-expansion-panel-title class="py-0 px-0">
            <v-container class="py-0">
              <v-row>
                <v-col align-self="center" class="pl-0"
                  ><v-select
                    v-if="mixedRenderInfos"
                    v-disabled-icon-focus
                    :id="control.id + '-input-selector'"
                    :disabled="!control.enabled"
                    :readonly="control.readonly"
                    :label="computedLabel"
                    :required="control.required"
                    :error-messages="control.errors"
                    :items="mixedRenderInfos"
                    :clearable="control.enabled && !control.readonly"
                    @update:model-value="handleSelectChange"
                    :item-title="
                      (item: SchemaRenderInfo) => t(item.label, item.label)
                    "
                    item-value="index"
                    v-model="selectedIndex"
                    v-bind="vuetifyProps('v-select')"
                    @click.stop
                    @focus="handleFocus"
                    @blur="handleBlur"
                  >
                  </v-select
                ></v-col>
                <v-col cols="3" align-self="center" class="text-truncate">{{
                  computedLabel
                }}</v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <dispatch-renderer
              class="input"
              v-if="schema && !(nullable && control.data === null)"
              :schema="schema"
              :uischema="uischema"
              :path="path"
              :renderers="control.renderers"
              :cells="control.cells"
              :enabled="control.enabled"
              :readonly="control.readonly"
            >
            </dispatch-renderer>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-else>
      <v-select
        class="select"
        v-if="mixedRenderInfos"
        v-disabled-icon-focus
        :id="control.id + '-input-selector'"
        :disabled="!control.enabled"
        :readonly="control.readonly"
        :label="computedLabel"
        :required="control.required"
        :error-messages="control.errors"
        :items="mixedRenderInfos"
        :clearable="control.enabled && !control.readonly"
        @update:model-value="handleSelectChange"
        :item-title="(item: SchemaRenderInfo) => t(item.label, item.label)"
        item-value="index"
        v-model="selectedIndex"
        v-bind="vuetifyProps('v-select')"
        @click.stop
        @focus="handleFocus"
        @blur="handleBlur"
      >
      </v-select>
      <dispatch-renderer
        class="input"
        v-if="schema && !(nullable && control.data === null)"
        :schema="schema"
        :uischema="uischema"
        :path="path"
        :renderers="control.renderers"
        :cells="control.cells"
        :enabled="control.enabled"
        :readonly="control.readonly"
      >
      </dispatch-renderer>
    </template>
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
  type JsonSchema7,
  type UISchemaElement,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControl,
  type RendererProps,
} from '@jsonforms/vue';
import { computed, defineComponent, provide, ref, watch } from 'vue';
import {
  VCol,
  VContainer,
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VRow,
  VSelect,
} from 'vuetify/components';
import { DisabledIconFocus } from '../controls';
import {
  IsDynamicPropertyContext,
  useCombinatorTranslations,
  useIcons,
  useJsonForms,
  useTranslator,
  useVuetifyControl,
} from '../util';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

interface SchemaRenderInfo {
  schema: JsonSchema;
  resolvedSchema: JsonSchema;
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
  parentSchema: JsonSchema,
  schema: JsonSchema,
  rootSchema: JsonSchema,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[],
): SchemaRenderInfo[] => {
  let resolvedSchemas: JsonSchema[] = [];

  if (typeof schema.type === 'string') {
    resolvedSchemas.push(schema);
  } else {
    const types = getSchemaTypesAsArray(schema);

    types.forEach((type) => {
      resolvedSchemas.push({
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

  return resolvedSchemas.map((resolvedSchema) => {
    if (resolvedSchema.type === 'array') {
      resolvedSchema.items = resolvedSchema.items ?? {};
      if ((resolvedSchema.items as any) === true) {
        resolvedSchema.items = {
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
      } else if (
        typeof (resolvedSchema.items as JsonSchema7).type !== 'string' &&
        !Array.isArray((resolvedSchema.items as JsonSchema7).type)
      ) {
        (resolvedSchema.items as JsonSchema7).type = [
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
    cleanSchema(resolvedSchema);

    const detailsForSchema = control.options
      ? control.options[resolvedSchema.type + '-detail']
      : undefined;

    const schemaControl = detailsForSchema
      ? {
          ...control,
          options: { ...control.options, detail: detailsForSchema },
        }
      : control;

    const _resolvedSchema = resolvedSchema;

    if (
      control.scope &&
      (resolvedSchema.type === 'object' || resolvedSchema.type === 'array')
    ) {
      const segments = control.scope.split('/');
      const startFromRoot = segments[0] === '#' || segments[0] === '';
      const startIndex = startFromRoot ? 1 : 0;

      if (segments.length > startIndex) {
        // for object schema the object renderer expects to get the parent schema
        const schemaPath = segments.slice(startIndex).join('.');
        if (schemaPath && isEqual(get(parentSchema, schemaPath), schema)) {
          // double check that the schema that we are going to replace is the schema that is with the mixed type
          const newSchema = cloneDeep(parentSchema);
          set(newSchema, schemaPath, resolvedSchema);
          resolvedSchema = newSchema;
        }
      }
    }

    const uischema = findUISchema(
      uischemas,
      resolvedSchema,
      control.scope,
      path,
      () => createControlElement(control.scope ?? '#'),
      schemaControl,
      rootSchema,
    );

    return {
      schema: resolvedSchema,
      resolvedSchema: _resolvedSchema,
      uischema,
      label: `${_resolvedSchema.type}`,
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
    VSelect,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VContainer,
    VRow,
    VCol,
  },
  directives: {
    DisabledIconFocus,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const path = props.path;
    const parentSchema = props.schema;
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
        parentSchema,
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
      mixedRenderInfos.value.some(
        (info) => info.resolvedSchema.type === 'null',
      ),
    );

    const matchingSchema = computed(() => {
      let result = mixedRenderInfos.value.find(
        (entry) => entry.resolvedSchema.type === valueType.value,
      );
      if (!result) {
        result = mixedRenderInfos.value.find(
          (entry) =>
            entry.resolvedSchema.type === 'number' &&
            valueType.value === 'integer',
        );
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
    const resolvedSchema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value].resolvedSchema
        : undefined,
    );

    const uischema = computed(() =>
      selectedIndex.value !== null && selectedIndex.value !== undefined
        ? mixedRenderInfos.value[selectedIndex.value].uischema
        : undefined,
    );

    const currentlyExpanded = ref<number | null>(null);
    // use the default value since all properties are dynamic so preserve the property key
    provide(IsDynamicPropertyContext, true);

    return {
      ...useCombinatorTranslations(useVuetifyControl(input)),
      nullable,
      mixedRenderInfos,
      selectedIndex,
      t,
      valueType,
      schema,
      resolvedSchema,
      uischema,
      path,
      icons,
      currentlyExpanded,
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
              this.mixedRenderInfos[newIndex].resolvedSchema,
              this.control.rootSchema,
            )
          : undefined;

      this.handleChange(this.control.path, newData);
      this.selectedIndex = newIndex;

      const type = newIndex
        ? this.mixedRenderInfos[newIndex]?.resolvedSchema?.type
        : null;
      this.valueType = type as string | null; // we know that this should be either a string or null

      this.currentlyExpanded = 0;
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

.select {
  flex-shrink: 0;
}

.input {
  flex-grow: 1;
  width: 100%;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0px;
}
</style>
