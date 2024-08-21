import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin

// required for the custom save formats in the date, time and date-time pickers
dayjs.extend(customParsing);
dayjs.extend(utc);
dayjs.extend(timezone);

export const parseDateTime = (
  data: string | null | undefined,
  format: string | string[] | undefined
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
