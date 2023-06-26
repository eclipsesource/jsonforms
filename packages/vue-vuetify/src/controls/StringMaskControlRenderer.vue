<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ isHovering }">
      <v-text-field
        v-disabled-icon-focus
        :id="control.id + '-input'"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :placeholder="appliedOptions.placeholder"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :required="control.required"
        :error-messages="control.errors"
        :maxlength="
          appliedOptions.restrict ? control.schema.maxLength : undefined
        "
        :counter="
          control.schema.maxLength !== undefined
            ? control.schema.maxLength
            : undefined
        "
        :clearable="isHovering"
        v-bind="vuetifyProps('v-text-field')"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-model="maskModel"
        v-mask="mask"
      />
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  and,
  ControlElement,
  isStringControl,
  JsonFormsRendererRegistryEntry,
  rankWith,
  Tester,
  UISchemaElement,
} from '@jsonforms/core';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue';
import isEmpty from 'lodash/isEmpty';
import { VueMaskPlugin } from 'v-mask';
import { defineComponent, DirectiveOptions, VNode, VNodeDirective } from 'vue';
import { VHover, VTextField } from 'vuetify/components';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { DisabledIconFocus } from './directives';

export interface DirectiveBinding extends Readonly<VNodeDirective> {
  readonly modifiers: { [key: string]: boolean };
}

class VueMaskPluginDirectiveCallback {
  mask: DirectiveOptions | undefined;
  directive(_id: string, definition?: DirectiveOptions) {
    this.mask = definition;
    return definition;
  }
  filter(_id: string, definition?: any) {
    return definition;
  }
}

class VueMaskPluginFilterCallback {
  mask: (value: any, inputMask: any) => any = (input, _mask) => input;

  directive(_id: string, definition?: DirectiveOptions) {
    return definition;
  }
  filter(_id: string, definition?: any) {
    this.mask = definition;
    return definition;
  }
}

class DelegateDirective implements DirectiveOptions {
  delegate: DirectiveOptions | undefined;

  bind = (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    const mask = (vnode.context as any)?.mask;
    if (mask) {
      const options = (vnode.context as any)?.maskReplacers;
      const callback = new VueMaskPluginDirectiveCallback();
      // use the vue mask plugin to initialize the mask directive since because createDirective with options is not exported module symbol
      VueMaskPlugin(callback, { placeholders: options });
      this.delegate = callback.mask;

      if (this.delegate?.bind) {
        this.delegate?.bind(el, binding, vnode, oldVnode);
      }
    }
  };

  inserted = (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    if (this.delegate?.inserted) {
      this.delegate?.inserted(el, binding, vnode, oldVnode);
    }
  };

  update = (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    if (this.delegate?.update) {
      this.delegate?.update(el, binding, vnode, oldVnode);
    }
  };

  componentUpdated = (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    if (this.delegate?.componentUpdated) {
      this.delegate?.componentUpdated(el, binding, vnode, oldVnode);
    }
  };

  unbind = (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    if (this.delegate?.unbind) {
      this.delegate?.unbind(el, binding, vnode, oldVnode);
    }
    this.delegate = undefined;
  };
}

const controlRenderer = defineComponent({
  name: 'string-mask-control-renderer',
  components: {
    ControlWrapper,
    VHover,
    VTextField,
  },
  directives: {
    DisabledIconFocus,
    Mask: new DelegateDirective(),
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const adaptValue = (value: any) => value || undefined;
    const control = useVuetifyControl(useJsonFormsControl(props), adaptValue);

    return { ...control, adaptValue };
  },
  methods: {
    maskedValue(value: string | undefined): string | undefined {
      if (!this.returnMaskedValue) {
        return this.maskFilter(value, this.mask);
      }

      return value;
    },
    unmaskedValue(value: string | undefined): string | undefined {
      if (!this.returnMaskedValue && value) {
        value = value
          .split('')
          .map((char, index) => {
            if (this.mask.length > index) {
              const replacer = this.maskReplacers[this.mask[index]];
              // #, A, N, X are default unless the replacer is null (override)
              return (['#', 'A', 'N', 'X'].includes(this.mask[index]) &&
                replacer === undefined) ||
                replacer
                ? char
                : '';
            }
            return char;
          })
          .join('');
      }
      return value;
    },
  },
  computed: {
    maskModel: {
      get(): string | undefined {
        let value = this.control.data;
        if (!this.returnMaskedValue && value) {
          value = this.maskedValue(value);
        }
        return value;
      },
      set(val: string | undefined): void {
        let value = val;

        if (!this.returnMaskedValue) {
          value = this.unmaskedValue(value);
        }
        if (this.adaptValue(value) !== this.control.data) {
          // only invoke onChange when values are different since v-mask is also listening on input which lead to loop

          this.onChange(value);
        }
      },
    },
    mask(): string {
      return this.appliedOptions.mask;
    },
    returnMaskedValue(): boolean {
      return this.appliedOptions.returnMaskedValue === true;
    },
    maskReplacers(): Record<string, RegExp> {
      const replacers =
        typeof this.appliedOptions.maskReplacers === 'object'
          ? this.appliedOptions.maskReplacers
          : {};
      Object.keys(replacers).forEach(function (key, _index) {
        if (typeof replacers[key] === 'string') {
          const value = replacers[key];
          replacers[key] = new RegExp(value);
        } else if (replacers[key] !== null) {
          // if not null then remove it
          delete replacers[key];
        }
      });
      if (replacers['?'] === undefined) {
        //remove optional support because of complications when trying to unmask the input
        replacers['?'] = null;
      }
      return replacers;
    },
    maskFilter() {
      const callback = new VueMaskPluginFilterCallback();
      VueMaskPlugin(callback, { placeholders: this.maskReplacers });
      return callback.mask;
    },
  },
});

export default controlRenderer;

const hasOption =
  (optionName: string): Tester =>
  (uischema: UISchemaElement): boolean => {
    if (isEmpty(uischema)) {
      return false;
    }

    const options = uischema.options;
    return (
      (options &&
        !isEmpty(options) &&
        typeof options[optionName] === 'string') ||
      false
    );
  };

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, and(isStringControl, hasOption('mask'))),
};
</script>
