import { TextField, TextFieldProps } from '@mui/material';
import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';
import React, { useRef} from 'react';

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


interface InputRef {
  lastInput: string;
  toShow: string;
}

type ResettableTextFieldProps = TextFieldProps & {
  rawValue: any;
  dayjsValueIsValid: boolean;
  valueInInputFormat: string;
  focused: boolean;
}

/**
 * The dayjs formatter/parser is very lenient and for example ignores additional digits and/or characters.
 * In these cases the input text can look vastly different than the actual value stored in the data.
 * The 'ResettableTextField' component adjusts the text field to reflect the actual value stored in the data
 * once it's no longer 'focused', i.e. when the user stops editing.
 */
export const ResettableTextField: React.FC<ResettableTextFieldProps> = ({ rawValue, dayjsValueIsValid, valueInInputFormat, focused, inputProps, ...props }) => {
  const value = useRef<InputRef>({ lastInput: inputProps?.value, toShow: inputProps?.value });
  if (!focused) {
    // The input text is not focused, therefore let's show the value actually stored in the data
    if (!dayjsValueIsValid) {
      // pass through the "raw" value in case it can't be formatted by dayjs
      value.current.toShow = typeof rawValue === 'string' || rawValue === null || rawValue === undefined ? rawValue : JSON.stringify(rawValue)
    } else {
      // otherwise use the specified format
      value.current.toShow = valueInInputFormat;
    }
  }
  if (focused && inputProps?.value !== value.current.lastInput) {
    // Show the current text the user is typing into the text input
    value.current.lastInput = inputProps?.value;
    value.current.toShow = inputProps?.value;
  }
  return <TextField {...props} inputProps={{ ...inputProps, value: value.current.toShow || '' }} />
}
