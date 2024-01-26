import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsing);

export const createOnChangeHandler =
  (
    path: string,
    handleChange: (path: string, value: any) => void,
    saveFormat: string
  ) =>
  (value: dayjs.Dayjs) => {
    if (!value) {
      handleChange(path, undefined);
    } else if (value.toString() !== 'Invalid Date') {
      const formatedDate = formatDate(value, saveFormat);
      handleChange(path, formatedDate);
    }
  };

export const createOnBlurHandler =
  (
    path: string,
    handleChange: (path: string, value: any) => void,
    format: string,
    saveFormat: string,
    rerenderChild: () => void,
    onBlur: () => void
  ) =>
  (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
    const date = dayjs(e.target.value, format);
    const formatedDate = formatDate(date, saveFormat);
    if (formatedDate.toString() === 'Invalid Date') {
      handleChange(path, undefined);
      rerenderChild();
    } else {
      handleChange(path, formatedDate);
    }
    onBlur();
  };

export const formatDate = (date: dayjs.Dayjs, saveFormat: string) => {
  let formatedDate = date.format(saveFormat);
  // Workaround to address a bug in Dayjs, neglecting leading 0 (https://github.com/iamkun/dayjs/issues/1849)
  const indexOfYear = saveFormat.indexOf('YYYY');
  if (date.year() < 1000 && indexOfYear !== -1) {
    const stringUpToYear = formatedDate.slice(0, indexOfYear);
    const stringFromYear = formatedDate.slice(indexOfYear);
    if (date.year() >= 100) {
      formatedDate = [stringUpToYear, 0, stringFromYear].join('');
    } else if (date.year() >= 10) {
      formatedDate = [stringUpToYear, 0, 0, stringFromYear].join('');
    } else if (date.year() >= 1) {
      formatedDate = [stringUpToYear, 0, 0, 0, stringFromYear].join('');
    }
  }
  return formatedDate;
};

export const getData = (
  data: any,
  saveFormat: string | undefined
): dayjs.Dayjs | null => {
  if (!data) {
    return null;
  }
  const dayjsData = dayjs(data, saveFormat);
  if (dayjsData.toString() === 'Invalid Date') {
    return null;
  }
  return dayjsData;
};
