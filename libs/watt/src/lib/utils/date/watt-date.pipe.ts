/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattRange } from './watt-date-range';

const formatStrings = {
  monthYear: 'MMMM YYYY',
  short: 'DD-MM-YYYY',
  long: 'DD-MM-YYYY, HH:mm',
  longAbbr: 'DD-MMM-YYYY HH:mm',
  time: 'HH:mm',
  longAbbrWithSeconds: 'DD-MMM-YYYY HH:mm:ss',
};

@Pipe({
  name: 'wattDate',
  standalone: true,
})
export class WattDatePipe implements PipeTransform {
  /**
   * @param input WattDateRange or string in ISO 8601 format or unix timestamp number
   */
  transform(
    input?: WattRange<Date> | WattRange<string> | Date | string | number | null,
    format: keyof typeof formatStrings = 'short',
    timeZone = 'Europe/Copenhagen'
  ): string | null {
    if (!input) return null;

    if (input instanceof Date || typeof input === 'string') {
      return dayjs(input).tz(timeZone).format(formatStrings[format]);
    } else if (typeof input === 'number') {
      return dayjs(new Date(input)).tz(timeZone).format(formatStrings[format]);
      // Treat year 1000 as `null` in the UI
      // Needed because in some cases `input.end` is set to a value that is far into the future
      // in order to signify that the value is not defined
    } else if (
      dayjs(input.start).isSame(dayjs(input.end), 'day') ||
      dayjs(input.end).tz(timeZone).year() === 10000
    ) {
      return this.transform(input.start, format);
    } else {
      return `${this.transform(input.start, format)} ― ${this.transform(input.end, format)}`;
    }
  }
}
