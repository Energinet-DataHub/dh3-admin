//#region License
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
//#endregion
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { WattRange, dayjs } from '@energinet-datahub/watt/date';

export const dhStartDateAndEndDateHaveSameMonthValidator =
  () =>
  (control: AbstractControl<WattRange<string> | null>): ValidationErrors | null => {
    const range = control.value;

    if (range === null) {
      return null;
    }

    const startDate = dayjs(range.start);
    const endDate = dayjs(range.end);

    if (startDate.month() !== endDate.month() || startDate.year() !== endDate.year()) {
      return { startDateAndEndDateHaveDifferentMonth: true };
    }

    return null;
  };
