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
import { CommonModule, FormatWidth, getLocaleDateFormat } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  Optional,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatCalendarCellClassFunction,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WattFieldComponent } from '@energinet-datahub/watt/field';
import { endOfDay, endOfMonth, isValid, parse, parseISO, startOfMonth } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Observable, combineLatest, fromEvent, map, merge, startWith, takeUntil, tap } from 'rxjs';

import { MaskitoModule } from '@maskito/angular';
import { MaskitoOptions } from '@maskito/core';
import { maskitoDateOptionsGenerator, maskitoDateRangeOptionsGenerator } from '@maskito/kit';
import { WattDateRange } from '../../../utils/date';
import { WattButtonComponent } from '../../button';
import { WattPlaceholderMaskComponent } from "../shared/placeholder-mask/watt-placeholder-mask.component";
import { WattPickerBase } from '../shared/watt-picker-base';
import { WattPickerValue } from '../shared/watt-picker-value';
import { WattRangeInputService } from '../shared/watt-range-input.service';

const dateShortFormat = 'dd-MM-yyyy';
const danishLocaleCode = 'da';
const datePlaceholder = 'dd-mm-åååå';
const rangeSeparator = ' - ';
const rangePlaceholder = datePlaceholder + rangeSeparator + datePlaceholder;
export const danishTimeZoneIdentifier = 'Europe/Copenhagen';

/**
 * Usage:
 * `import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';`
 *
 * IMPORTANT:
 * The styling is calculated based on our monospaced font.
 */
@Component({
    selector: 'watt-datepicker-v2',
    templateUrl: './watt-datepicker-v2.component.html',
    styleUrls: ['./watt-datepicker.component.scss'],
    providers: [
        WattRangeInputService,
        { provide: MatFormFieldControl, useExisting: WattDatepickerV2Component },
        MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatDatepickerModule,
        MatInputModule,
        WattButtonComponent,
        CommonModule,
        WattFieldComponent,
        MaskitoModule,
        WattPlaceholderMaskComponent,
    ]
})
export class WattDatepickerV2Component extends WattPickerBase {
  @Input() max: Date | null = null;
  @Input() min: Date | null = null;
  @Input() startAt = new Date();
  @Input() rangeMonthOnlyMode = false;
  @Input() label = '';

  /**
   * @ignore
   */
  @ViewChild(MatDatepickerInput)
  matDatepickerInput!: MatDatepickerInput<Date | null>;

  @ViewChild(MatDateRangePicker)
  matDateRangePicker!: MatDateRangePicker<Date | null>;

  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<Date | null>;

  /**
   * @ignore
   */
  @ViewChild(MatStartDate)
  matStartDate!: MatStartDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild(MatEndDate)
  matEndDate!: MatEndDate<Date | null>;

  /**
   * @ignore
   */
  @ViewChild('actualInput')
  actualInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('dateInput')
  input!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('startDateInput')
  startInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endDateInput')
  endInput!: ElementRef;
  /**
   * @ignore
   */
  protected _placeholder = this.getPlaceholder(this.getInputFormat());

  @Input() dateClass: MatCalendarCellClassFunction<Date> = () => '';

  inputMask: MaskitoOptions =  maskitoDateOptionsGenerator({mode: 'dd/mm/yyyy', separator: '-'});
  rangeInputMask: MaskitoOptions = maskitoDateRangeOptionsGenerator({mode: 'dd/mm/yyyy', dateSeparator:'-'});
  /**
   * @ignore
   */
  constructor(
    protected override elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl,
    @Inject(LOCALE_ID) private locale: string,
    private cdr: ChangeDetectorRef
  ) {
    super(
      `watt-datepicker-v2-${WattDatepickerV2Component.nextId++}`,
      elementRef,
      cdr,
      ngControl
    );
  }

  protected initSingleInput() {
    return;
  }

  inputChanged(value: string) {
    const dateString = value.slice(0, datePlaceholder.length);
    if (dateString.length !== datePlaceholder.length) {
      return;
    }
    const date = this.parseDateShortFormat(dateString);
    this.control?.setValue(this.formatDateFromViewToModel(date));
  }

  datepickerClosed() {
    this.input.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  onMonthSelected(date: Date) {
    if (this.rangeMonthOnlyMode && date) {
      this.matDateRangePicker.select(startOfMonth(date));
      this.matDateRangePicker.select(endOfMonth(date));
      this.matDateRangePicker.close();
    }
  }

  /**
   * @ignore
   */
  protected initRangeInput() {
    return;
  }

  rangeInputChanged(value: string) {
    const startDateString = value.slice(0, datePlaceholder.length);
    if (startDateString.length !== datePlaceholder.length) {
      return;
    }
    const start = this.parseDateShortFormat(startDateString);
    if (value.length < (rangePlaceholder.length)) {
      this.control?.setValue({ start, end: start });
      return;
    }
    const endDateString = value.slice(datePlaceholder.length + rangeSeparator.length);
    let end = this.setEndDateToDanishTimeZone(endDateString);
    if (end !== null) {
      end = this.setToEndOfDay(end);
      this.control?.setValue({ start, end});
    }
  }

  rangePickerClosed() {
    if (this.matDateRangeInput.value?.start && this.matDateRangeInput.value.end) {
      (this.actualInput.nativeElement as HTMLInputElement).value = this.formatDateTimeFromModelToView(this.formatDateFromViewToModel(this.matDateRangeInput.value?.start)) + '-' + this.formatDateTimeFromModelToView(this.formatDateFromViewToModel(this.matDateRangeInput.value.end));
      this.control?.setValue({ start: this.formatDateFromViewToModel(this.matDateRangeInput.value.start), end: this.formatDateFromViewToModel(this.matDateRangeInput.value.end)});
    } else {
      (this.actualInput.nativeElement as HTMLInputElement).value = '';
      this.control?.setValue(null);
    }
    this.actualInput.nativeElement.dispatchEvent(new InputEvent('input'));
  }

  /**
   * @ignore
   */
  protected setSingleValue(
    value: Exclude<WattPickerValue, WattDateRange>,
    input: HTMLInputElement
  ) {
    this.setValueToInput(value, input, this.matDatepickerInput);
  }

  /**
   * @ignore
   */
  protected setRangeValue(
    value: WattDateRange | null,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value ?? {};

    this.setValueToInput(start, startInput, this.matStartDate);
    this.setValueToInput(end, endInput, this.matEndDate);
  }

  /**
   * @ignore
   */
  private getInputFormat(): string {
    const localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);

    return localeDateFormat
      .toLowerCase()
      .replace(/d+/, 'dd')
      .replace(/m+/, 'mm')
      .replace(/y+/, 'yyyy')
      .replace(/\./g, '-'); // seperator
  }

  /**
   * @ignore
   */
  private getPlaceholder(inputFormat: string): string {
    return this.locale === danishLocaleCode ? inputFormat.split('y').join('å') : inputFormat;
  }

  /**
   * @ignore
   */
  private parseDateShortFormat(value: string): Date {
    return parse(value, dateShortFormat, new Date());
  }

    /**
   * @ignore
   */
  private parseISO8601Format(value: string): Date {
    return parseISO(value);
  }

  /**
   * @ignore
   */
  private setValueToInput<D extends { value: Date | null }>(
    value: string | null | undefined,
    nativeInput: HTMLInputElement,
    matDateInput: D
  ): void {
    nativeInput.value = value ? this.formatDateTimeFromModelToView(value) : '';
    matDateInput.value = value ? zonedTimeToUtc(value, danishTimeZoneIdentifier) : null;
  }

  /**
   * @ignore
   * Formats Date to full ISO 8601 format (e.g. `2022-08-31T22:00:00.000Z`)
   */
  private formatDateFromViewToModel(value: Date): string {
    return zonedTimeToUtc(value, danishTimeZoneIdentifier).toISOString();
  }

  /**
   * @ignore
   */
  private formatDateTimeFromModelToView(value: string): string {
    return formatInTimeZone(value, danishTimeZoneIdentifier, dateShortFormat);
  }

    /**
   * @ignore
   */
    private toDanishTimeZone(value: Date): Date {
      return utcToZonedTime(value.toISOString(), danishTimeZoneIdentifier);
    }


  /**
   * @ignore
   */
  private setToEndOfDay(value: Date): Date {
    return endOfDay(value);
  }

    /**
   * @ignore
   */
    private setEndDateToDanishTimeZone(value: string): Date | null {
      const dateBasedOnShortFormat = this.parseDateShortFormat(value);
      const dateBasedOnISO8601Format = this.parseISO8601Format(value);

      let maybeDateInDanishTimeZone: Date | null = null;

      if (isValid(dateBasedOnShortFormat)) {
        maybeDateInDanishTimeZone = this.toDanishTimeZone(dateBasedOnShortFormat);
      } else if (isValid(dateBasedOnISO8601Format)) {
        maybeDateInDanishTimeZone = this.toDanishTimeZone(dateBasedOnISO8601Format);
      }

      return maybeDateInDanishTimeZone;
    }
}
