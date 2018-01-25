export const REGISTER_STYLE = 'REGISTER_STYLE';
export const REGISTER_STYLES = 'REGISTER_STYLES';
export const UNREGISTER_STYLE = 'UNREGISTER_STYLE';

export const registerStyle = (styleName: string, classNames: string[]) => ({
  type: REGISTER_STYLE,
  name: styleName,
  classNames
});

export const unregisterStyle = (styleName: string) => ({
  type: UNREGISTER_STYLE,
  name: styleName
});

export const registerStyles = (styleDefs: { name: string, classNames: string[] }[]) => ({
  type: REGISTER_STYLES,
  styles: styleDefs
});

