import { dayjs } from './dayjs';
import { WattRange } from './watt-date-range';

export const formatStrings = {
  monthYear: 'MMMM YYYY',
  short: 'DD-MM-YYYY',
  shortAbbr: 'DD. MMM YYYY',
  long: 'DD-MM-YYYY, HH:mm',
  longAbbr: 'DD. MMM YYYY HH:mm',
  time: 'HH:mm',
  longAbbrWithSeconds: 'DD-MMM YYYY HH:mm:ss',
};

export function wattFormatDate(
  input?: WattRange<Date> | WattRange<string> | Date | string | number | null,
  format: keyof typeof formatStrings = 'short',
  timeZone = 'Europe/Copenhagen'
): string | null {
  if (!input) return null;

  if (input instanceof Date || typeof input === 'string') {
    return dayjs(input).tz(timeZone).format(formatStrings[format]);
  } else if (typeof input === 'number') {
    return dayjs(new Date(input)).tz(timeZone).format(formatStrings[format]);
  } else {
    return transformRange(input, format);
  }
}

function transformRange(
  input: WattRange<Date | string>,
  format: keyof typeof formatStrings
): string | null {
  if (dayjs(input.start).isSame(dayjs(input.end), 'day') || input.end === null) {
    return wattFormatDate(input.start, format);
  } else {
    return `${wattFormatDate(input.start, format)} ― ${wattFormatDate(input.end, format)}`;
  }
}
