import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import type { Styles } from './styles';

export const classes = (
  strings: TemplateStringsArray,
  ...variables: any[]
): string => {
  return strings
    .reduce((acc, curr, index) => {
      return `${acc}${curr}${variables[index] || ''}`;
    }, '')
    .trim();
};

/**
 * Helper function to merge two styles definitions. The contained classes will be combined, not overwritten.
 *
 * Example usage:
 * ```ts
 * const myStyles = mergeStyles(defaultStyles, { control: { root: 'mycontrol' } });
 * ```
 */
export const mergeStyles = (
  stylesA: Partial<Styles>,
  stylesB: Partial<Styles>,
): Partial<Styles> => {
  const styles = cloneDeep(stylesA);
  mergeWith(styles, stylesB, (aValue, bValue) => {
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return `${aValue} ${bValue}`;
    }
    return undefined;
  });
  return styles;
};
