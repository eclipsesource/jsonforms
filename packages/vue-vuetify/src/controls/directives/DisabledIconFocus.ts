export const DisabledIconFocus = {
  updated(el: HTMLElement): void {
    el.querySelectorAll('.v-input__icon button').forEach((x) =>
      x.setAttribute('tabindex', '-1')
    );
  },
};

export default DisabledIconFocus;
