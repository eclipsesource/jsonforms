export interface Options {
  showUnfocusedDescription?: boolean;
  hideRequiredAsterisk?: boolean;
  focus?: boolean;
  step?: number;
}

export const optionsInit = () => ({
  showUnfocusedDescription: null,
  hideRequiredAsterisk:null,
  focus: null,
  step: null
})
