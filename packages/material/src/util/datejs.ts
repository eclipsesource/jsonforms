import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';
import { useState, useMemo, FormEvent, FormEventHandler } from 'react';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsing);

export const createOnChangeHandler = (
  path: string,
  handleChange: (path: string, value: any) => void,
  saveFormat: string | undefined
) => (time: dayjs.Dayjs, textInputValue: string) => {
  if (!time) {
    handleChange(path, undefined);
    return;
  }
  const result = dayjs(time).format(saveFormat);
  handleChange(path, result === 'Invalid Date' ? textInputValue : result);
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

type DateInputFormEvent = FormEvent<HTMLInputElement | HTMLTextAreaElement>;

/**
 * Improves the UX of date fields by controlling the rendered input value.
 * When a user enters a date value that ends up being different than the
 * the value of `data`, then on blur we sync the rendered input value.
 *
 * @param data The parsed date value.
 * @param onBlur Additional handler to run after input value is sync'd.
 * @returns Props to pass to the rendered input element.
 */
export const useParsedDateSynchronizer = (props: {
  data: any;
  onBlur: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}) => {
  const [value, setValue] = useState(props.data);

  const onBlur = useMemo(
    () => (event: DateInputFormEvent) => {
      setValue(props.data);
      if (props.onBlur) props.onBlur(event);
    },
    [props.data, props.onBlur]
  );

  const createOnChangeHandler = (
    onChange: (event: DateInputFormEvent) => void
  ) => (event: DateInputFormEvent) => {
    setValue((event.target as HTMLInputElement | HTMLTextAreaElement).value);
    if (onChange) onChange(event);
  };

  return { value, onBlur, createOnChangeHandler };
};
