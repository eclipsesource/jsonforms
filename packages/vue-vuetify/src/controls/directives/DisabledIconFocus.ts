export const DisabledIconFocus = {
  updated(el: HTMLElement): void {
    el.querySelectorAll('.v-field__clearable i').forEach((x) =>
      x.setAttribute('tabindex', '-1'),
    );
  },
};

export default DisabledIconFocus;
