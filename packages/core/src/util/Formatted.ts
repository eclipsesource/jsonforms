/**
 * Interface for mapping a given type to a formatted string and back.
 */
export interface Formatted<A> {
  /**
   * Format the given value
   *
   * @param {A} value the value to be formatted
   * @returns {string} the formatted string
   */
  toFormatted(value: A): string;

  /**
   * Retrieve a value from a given string.
   *
   * @param {string} formatted the format string from which to obtain a value
   * @returns {A} the obtained value
   */
  fromFormatted(formatted: string): A;
}
