import dayjs, { type UnitType } from 'dayjs';
import customParsingPlugin from 'dayjs/plugin/customParseFormat';
import durationPlugin from 'dayjs/plugin/duration';
import timezonePlugin from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utcPlugin from 'dayjs/plugin/utc';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsingPlugin);
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(durationPlugin);

export const dynamic = (args: any) => {
  let func: string | undefined = undefined;
  if (args?.func && typeof args.func === 'string') {
    func = args?.func;
  }

  if (func) {
    try {
      const fn = new Function(
        'args',
        `const func = ${func}; return func(args);`,
      );
      return () => {
        try {
          return fn(args);
        } catch (e) {
          console.error(`Error at dynamicDefaults 'dynamic': ${e}`);
        }
      };
    } catch (e) {
      console.error(`Error at dynamicDefaults 'dynamic': ${e}`);
    }
  }

  throw new Error(`missing argument 'func' for dynamicDefaults func 'dynamic'`);
};

export const searchParams = (args: any) => {
  let paramName: string | undefined = undefined;
  if (args?.param && typeof args.param === 'string') {
    paramName = args?.param;
  }

  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;

  let result: string | undefined = undefined;
  if (paramName) {
    if (params.has(paramName)) {
      result = params.get(paramName)!;
    } else {
      // try from the hash #
      const hash = url.hash;
      const index = hash.indexOf('?');
      if (index > 0 && index < hash.length - 1) {
        const hashSearchParams = new URLSearchParams(hash.substring(index + 1));
        if (hashSearchParams.has(paramName)) {
          result = hashSearchParams.get(paramName)!;
        }
      }
    }
  }

  return () => result;
};

export const datetimeOffset = (args: any) => {
  const dateTime = nowOffset(args);
  let result: string | undefined = undefined;

  if (dateTime.isValid()) {
    const datetimeLocalFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';

    result = dateTime.local().format(datetimeLocalFormat);
  }

  return () => result;
};

export const timeOffset = (args: any) => {
  const dateTime = nowOffset(args);
  let result: string | undefined = undefined;

  if (dateTime.isValid()) {
    const datetimeLocalFormat = 'HH:mm:ss.SSS';

    result = dateTime.local().format(datetimeLocalFormat);
  }

  return () => result;
};

export const dateOffset = (args: any) => {
  const date = nowOffset(args);
  let result: string | undefined = undefined;

  if (date.isValid()) {
    result = date.local().format('YYYY-MM-DD');
  }

  return () => result;
};

export const dateUnit = (args: any) => {
  const date = nowOffset(args);
  let result: number | undefined = undefined;

  if (date.isValid()) {
    let unit: UnitType = 'millisecond';
    if (args?.unit && typeof args.unit === 'string') {
      unit = args?.unit;
    }

    result = date.local().get(unit);
  }

  return () => result;
};

const nowOffset = (args: any) => {
  let duration: string | undefined = undefined;
  if (args?.duration && typeof args.duration === 'string') {
    duration = args?.duration;
  }
  let date: string | Date | undefined = new Date();
  if (args?.date && typeof args.date === 'string') {
    if (args.date !== 'now') {
      // only assign if not the string now
      date = args?.date;
    }
  }
  let operation: 'add' | 'substract' = 'add';
  if (args?.op && args.op === 'substract') {
    operation = 'substract';
  }

  let dateObj = dayjs(date);

  if (dateObj.isValid() && duration) {
    const offset = dayjs.duration(duration);

    dateObj =
      operation == 'add' ? dateObj.add(offset) : dateObj.subtract(offset);
  }

  return dateObj;
};
