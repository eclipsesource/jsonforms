import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';

import type { MaskTokens, MaskType } from 'maska';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

export const expandLocaleFormat = (format: string): string => {
  return format.replace(/\b(LT|LTS|L{1,4})\b/g, function (match, p1) {
    // Replace each captured value with a specific value
    switch (p1) {
      case 'LT':
      case 'LTS':
      case 'L':
      case 'LL':
      case 'LLL':
      case 'LLLL':
        return dayjs.localeData().longDateFormat(p1);
      default:
        return match; // Return the match unchanged if not in the set
    }
  });
};

export const parseDateTime = (
  data: string | number | dayjs.Dayjs | Date | null | undefined,
  format: string | string[] | undefined,
): dayjs.Dayjs | null => {
  if (!data) {
    return null;
  }
  const dayjsData = dayjs(data, format);
  if (!dayjsData.isValid()) {
    return null;
  }
  return dayjsData;
};

export const convertDayjsToMaskaFormat = (
  dayjsFormat: string,
): { mask: MaskType; tokens: MaskTokens } => {
  function* nextKey(preservedKeys: string): Generator<string> {
    let currentCharCode = 'A'.charCodeAt(0);

    while (currentCharCode <= 65535) {
      // Unicode character range
      const currentChar = String.fromCharCode(currentCharCode);
      if (!preservedKeys.includes(currentChar)) {
        yield currentChar;
      }
      currentCharCode++;
    }
  }

  function RegExpLiteral(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  class Tokens {
    private tokens: MaskTokens;
    private charGenerator;

    constructor(preservedKeys: string) {
      this.tokens = {};
      this.charGenerator = nextKey(preservedKeys);
    }

    public getTokens(): MaskTokens {
      return this.tokens;
    }

    public getTokenKey(token: MaskTokens[keyof MaskTokens]): string {
      const entry = Object.entries(this.tokens).find(
        (entry) =>
          entry[1].pattern.toString() === token.pattern.toString() &&
          entry[1].optional === token.optional,
      );
      if (entry) {
        return entry[0];
      }

      throw new Error(
        'Key for pattern ' + token.pattern.toString() + ' not found.',
      );
    }

    public registerToken(token: MaskTokens[keyof MaskTokens]): string {
      const entry = Object.entries(this.tokens).find(
        (entry) =>
          entry[1].pattern.toString() === token.pattern.toString() &&
          entry[1].optional === token.optional,
      );
      if (entry) {
        return entry[0];
      }

      const key = this.charGenerator.next().value;

      this.tokens[key] = token;
      return key;
    }
  }

  // defintions from - https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens
  const dayjsTokens = [
    'YYYY', // Four-digit year - example: 2001
    'YY', //Two-digit year - example: 01
    'M', // Month, beginning at 1 - example: 1-12
    'MM', // Month, 2-digits - example: 01-12
    'MMM', // The abbreviated month name - example: Jan-Dec
    'MMMM', // The full month name - example: January-December
    'D', // Day of month - example: 1-31
    'DD', // Day of month, 2-digits - example: 01-31
    'H', // Hours - example: 0-23
    'HH', // Hours, 2-digits - example: 00-23
    'h', // Hours, 12-hour clock - example: 1-12
    'hh', // Hours, 12-hour clock, 2-digits - example: 01-12
    'm', // Minutes - example: 0-59
    'mm', // Minutes, 2-digits - example: 00-59
    's', // Seconds - example: 0-59
    'ss', // Seconds, 2-digits - example: 00-59
    'S', // Hundreds of milliseconds, 1-digit - example: 0-9
    'SS', // Tens of milliseconds, 2-digits - example: 00-99
    'SSS', // Milliseconds, 3-digits - example: 000-999
    'Z', // Offset from UTC - example: -05:00
    'ZZ', // Compact offset from UTC, 2-digits - example: -0500
    'A', // Post or ante meridiem, upper-case - example: AM PM
    'a', // Post or ante meridiem, lower-case - example: am pm,
    'X', // Unix timestamp - example 1410715640.579,
    'x', // Unix ms timestamp - example 1410715640579
  ].sort((a, b) => b.length - a.length);

  const parts = dayjsFormat
    .split(new RegExp(`(${dayjsTokens.join('|')})`))
    .filter(Boolean);

  const reservedChars = parts
    .filter((part) => !dayjsTokens.includes(part))
    .join('');
  const tokens = new Tokens(reservedChars);

  // need to prebuild all keys to tokens are are going to be used in tokenFunction
  tokens.registerToken({ pattern: /[0-9]/ });
  tokens.registerToken({ pattern: /1/ });
  tokens.registerToken({ pattern: /[0-2]/ });
  tokens.registerToken({ pattern: /[0-2]/, optional: true });
  tokens.registerToken({ pattern: /[0-1]/ });
  tokens.registerToken({ pattern: /[1-9]/ });

  let escapedMonths = dayjs.monthsShort().map((month) => RegExpLiteral(month));
  let regexPattern = `\\b(${escapedMonths.join('|')})\\b`;
  tokens.registerToken({ pattern: new RegExp(regexPattern, 'i') });

  escapedMonths = dayjs.months().map((month) => RegExpLiteral(month));
  regexPattern = `\\b(${escapedMonths.join('|')})\\b`;

  tokens.registerToken({ pattern: new RegExp(regexPattern, 'i') });
  tokens.registerToken({ pattern: /[1-3]/ });
  tokens.registerToken({ pattern: /[0-1]/, optional: true });
  tokens.registerToken({ pattern: /[0-9]/, optional: true });
  tokens.registerToken({ pattern: /[0-3]/ });
  tokens.registerToken({ pattern: /[0-3]/, optional: true });
  tokens.registerToken({ pattern: /[0-5]/ });
  tokens.registerToken({ pattern: /[ap]/ });
  tokens.registerToken({ pattern: /m/ });
  tokens.registerToken({ pattern: /[AP]/ });
  tokens.registerToken({ pattern: /M/ });
  tokens.registerToken({ pattern: /[+-]/ });
  tokens.registerToken({ pattern: /[0-4]/ });
  tokens.registerToken({ pattern: /:/ });
  tokens.registerToken({ pattern: /[.]/ });
  tokens.registerToken({ pattern: /[.]/, optional: true });

  const tokenFunction = (value: string): string => {
    let index = 0;

    const result: (string | MaskTokens[keyof MaskTokens])[] = [];
    for (const part of parts) {
      if (!part || part === '') {
        continue;
      }
      if (index > value.length) {
        break;
      }

      if (part === 'YYYY') {
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        index += 4;
      } else if (part === 'YY' || part == 'SS') {
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        index += 2;
      } else if (part === 'M') {
        result.push({ pattern: /1/ });
        if (value.charAt(index) === '1') {
          if (/[0-2]/.test(value.charAt(index + 1))) {
            result.push({ pattern: /[0-2]/ });
            index += 1;
          } else if (value.charAt(index + 1) === '') {
            result.push({ pattern: /[0-2]/, optional: true });
          }
        }
        index += 1;
      } else if (part === 'MM' || part == 'hh') {
        result.push({ pattern: /[0-1]/ });
        result.push(
          value.charAt(index) === '0'
            ? { pattern: /[1-9]/ }
            : { pattern: /[0-2]/ },
        );
        index += 2;
      } else if (part === 'MMM') {
        const escapedMonths = dayjs
          .monthsShort()
          .map((month) => RegExpLiteral(month));
        const regexPattern = `\\b(${escapedMonths.join('|')})\\b`;

        result.push({ pattern: new RegExp(regexPattern, 'i') });
        let monthSpecified = false;

        for (const month of dayjs.monthsShort()) {
          if (
            index < value.length &&
            value.substring(index).startsWith(month)
          ) {
            index += month.length;
            monthSpecified = true;
            break;
          }
        }
        if (!monthSpecified) {
          // can't continue until the months is not matched
          break;
        }
      } else if (part === 'MMMM') {
        const escapedMonths = dayjs
          .months()
          .map((month) => RegExpLiteral(month));
        const regexPattern = `\\b(${escapedMonths.join('|')})\\b`;

        result.push({ pattern: new RegExp(regexPattern, 'i') });
        let monthSpecified = false;

        for (const month of dayjs.months()) {
          if (
            index < value.length &&
            value.substring(index).startsWith(month)
          ) {
            index += month.length;
            monthSpecified = true;
            break;
          }
        }
        if (!monthSpecified) {
          // can't continue until the months is not matched
          break;
        }
      } else if (part === 'D') {
        result.push({ pattern: /[1-9]/ });
        if (/[1-3]/.test(value.charAt(index))) {
          if (value.charAt(index) === '3') {
            if (/[0-1]/.test(value.charAt(index + 1))) {
              result.push({ pattern: /[0-1]/ });
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push({ pattern: /[0-1]/, optional: true });
            }
          } else {
            if (/\d/.test(value.charAt(index + 1))) {
              result.push({ pattern: /[0-9]/ });
              index += 1;
            } else if (value.charAt(index + 1) === '') {
              result.push({ pattern: /[0-9]/, optional: true });
            }
          }
        }
        index += 1;
      } else if (part === 'DD') {
        result.push({ pattern: /[0-3]/ });
        if (value.charAt(index) === '3') {
          result.push({ pattern: /[0-1]/ });
        } else if (value.charAt(index) === '0') {
          result.push({ pattern: /[1-9]/ });
        } else {
          result.push({ pattern: /[0-9]/ });
        }
        index += 2;
      } else if (part == 'H') {
        result.push({ pattern: /[0-9]/ });
        if (value.charAt(index) === '2') {
          if (/[0-3]/.test(value.charAt(index + 1))) {
            result.push({ pattern: /[0-3]/ });
            index += 1;
          } else if (value.charAt(index + 1) === '') {
            result.push({ pattern: /[0-3]/, optional: true });
          }
        } else if (value.charAt(index) === '1') {
          if (/\d/.test(value.charAt(index + 1))) {
            result.push({ pattern: /[0-9]/ });
            index += 1;
          } else if (value.charAt(index + 1) === '') {
            result.push({ pattern: /[0-9]/, optional: true });
          }
        }
        index += 1;
      } else if (part == 'HH') {
        result.push({ pattern: /[0-2]/ });
        if (/[0-1]/.test(value.charAt(index))) {
          result.push({ pattern: /[0-9]/ });
        } else if (value.charAt(index) === '2') {
          result.push({ pattern: /[0-3]/ });
        }
        index += 2;
      } else if (part == 'h') {
        result.push({ pattern: /[1-9]/ });
        if (value.charAt(index) === '1') {
          if (/[0-2]/.test(value.charAt(index + 1))) {
            result.push({ pattern: /[0-2]/ });
            index += 1;
          } else if (value.charAt(index + 1) === '') {
            result.push({ pattern: /[0-2]/, optional: true });
          }
        }
        index += 1;
      } else if (part == 'm' || part == 's') {
        result.push({ pattern: /[0-9]/ });
        if (/[1-5]/.test(value.charAt(index))) {
          if (/\d/.test(value.charAt(index + 1))) {
            result.push({ pattern: /[0-9]/ });
            index += 1;
          } else if (value.charAt(index + 1) === '') {
            result.push({ pattern: /[0-9]/, optional: true });
          }
        }
        index += 1;
      } else if (part == 'mm' || part == 'ss') {
        result.push({ pattern: /[0-5]/ });
        result.push({ pattern: /[0-9]/ });
        index += 2;
      } else if (part == 'a') {
        result.push({ pattern: /[ap]/ });
        result.push({ pattern: /m/ });
        index += 2;
      } else if (part == 'A') {
        result.push({ pattern: /[AP]/ });
        result.push({ pattern: /M/ });
        index += 2;
      } else if (part == 'Z' || part == 'ZZ') {
        //GMT-12 to GMT+14
        result.push({ pattern: /[+-]/ });
        result.push({ pattern: /[0-1]/ });

        if (value.charAt(index + 1) === '0') {
          result.push({ pattern: /[0-9]/ });
        } else if (value.charAt(index + 1) === '1') {
          result.push(
            value.charAt(index) === '+'
              ? { pattern: /[0-4]/ }
              : { pattern: /[0-2]/ },
          );
        }
        if (part === 'Z') {
          result.push({ pattern: /:/ });
          index += 1;
        }
        result.push({ pattern: /[0-5]/ });
        result.push({ pattern: /[0-9]/ });
        index += 5;
      } else if (part == 'S') {
        result.push({ pattern: /[0-9]/ });
        index += 1;
      } else if (part == 'SSS') {
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        result.push({ pattern: /[0-9]/ });
        index += 3;
      } else if (part == 'X') {
        // number of digits 13
        const times = 13;
        for (let i = 0; i < times; i++) {
          result.push({ pattern: /[0-9]/ });
        }
        index += times;
      } else if (part == 'x') {
        // number of digits 10 for seconds
        const times = 10;
        for (let i = 0; i < times; i++) {
          result.push({ pattern: /[0-9]/ });
        }

        if (value.charAt(index + times) === '.') {
          result.push({ pattern: /[.]/ });
          index += 1;

          // check for optional 3 digits after .
          for (let i = 0; i < 3; i++) {
            if (/\d/.test(value.charAt(index + times + 1 + i))) {
              result.push({ pattern: /[0-9]/ });
              index += 1;
            } else if (value.charAt(index + times + 1 + i) === '') {
              result.push({ pattern: /[0-9]/, optional: true });
              break;
            }
          }
        } else if (value.charAt(index + times) === '') {
          result.push({ pattern: /[.]/, optional: true });
        }

        index += times;
      } else {
        result.push(part);
        index += part.length;
      }
    }

    const mask = result
      .map((part) =>
        typeof part === 'string' ? part : tokens.getTokenKey(part),
      )
      .join('');

    return mask;
  };

  return { mask: tokenFunction, tokens: tokens.getTokens() };
};
