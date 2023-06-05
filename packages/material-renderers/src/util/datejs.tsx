import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsing);

export const createOnChangeHandler =
  (
    path: string,
    handleChange: (path: string, value: any) => void,
    saveFormat: string | undefined
  ) =>
  (time: dayjs.Dayjs) => {
    if (!time) {
      handleChange(path, undefined);
      return;
    }
    const result = dayjs(time).format(saveFormat);
    handleChange(path, result);
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
