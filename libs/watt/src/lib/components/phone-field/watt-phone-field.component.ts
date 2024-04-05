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
import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { WattIcon, WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattFieldComponent, WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { MaskitoDirective } from '@maskito/angular';
import { MASKITO_DEFAULT_OPTIONS } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { MetadataJson, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

import { WattPhoneFieldIntlService } from './watt-phone-field-intl.service';

type Contry = {
  countryIsoCode: CountryCode;
  icon: WattIcon;
  prefix: string;
};

function phoneValidator(countryCode: CountryCode): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = isValidPhoneNumber(control.value, countryCode);

    return valid ? null : { invalidPhone: true };
  };
}

@Component({
  selector: 'watt-phone-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    WattFieldComponent,
    WattIconComponent,
    MatSelectModule,
    ReactiveFormsModule,
    MaskitoDirective,
    WattFieldErrorComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattPhoneFieldComponent),
      multi: true,
    },
  ],
  template: `<watt-field [label]="label()" [control]="formControl()">
    <div class="watt-phone-field__prefix-container">
      <mat-select
        panelWidth=""
        panelClass="watt-phone-field__select"
        hideSingleSelectionIndicator="true"
        [value]="choosenCountry().countryIsoCode"
        (selectionChange)="selectedContry($event)"
      >
        <mat-select-trigger>
          <watt-icon [name]="choosenCountry().icon" />
        </mat-select-trigger>
        @for (contry of countries; track contry; let index = $index) {
          <mat-option value="{{ contry.countryIsoCode }}">
            <watt-icon [name]="contry.icon" />
            <div>{{ getCountryName(contry.countryIsoCode) }}</div>
          </mat-option>
        }
      </mat-select>
      <input
        [attr.aria-label]="label()"
        autocomplete="tel"
        inputmode="tel"
        [value]="value"
        [formControl]="formControl()"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maskito]="mask"
        #phoneNumberInput
      />
    </div>
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    @if (formControl().hasError('invalidPhone')) {
      <watt-field-error> {{ intl.invalidPhoneNumber }} </watt-field-error>
    }
  </watt-field>`,
  styleUrl: './watt-phone-field.component.scss',
})
export class WattPhoneFieldComponent implements ControlValueAccessor, OnInit {
  /** @ignore */
  readonly countries = [
    { prefix: '+45', countryIsoCode: 'DK', icon: 'custom-flag-da' },
    { prefix: '+46', countryIsoCode: 'SE', icon: 'custom-flag-se' },
    { prefix: '+47', countryIsoCode: 'NO', icon: 'custom-flag-no' },
    { prefix: '+49', countryIsoCode: 'DE', icon: 'custom-flag-de' },
    { prefix: '+358', countryIsoCode: 'FI', icon: 'custom-flag-fi' },
    { prefix: '+48', countryIsoCode: 'PL', icon: 'custom-flag-pl' },
  ] as Contry[];

  formControl = input.required<FormControl>();
  label = input<string>();

  /** @ignore */
  choosenCountry = signal<Contry>(this.countries[0]);

  /** @ignore */
  mask = MASKITO_DEFAULT_OPTIONS;

  /** @ignore */
  intl = inject(WattPhoneFieldIntlService);

  /** @ignore */
  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  /** @ignore */
  value: string | null = null;

  /** @ignore */
  private _metadata: MetadataJson | null = null;

  /** @ignore */
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef<HTMLInputElement>;

  /** @ignore */
  async ngOnInit(): Promise<void> {
    this._metadata = await import('libphonenumber-js/min/metadata').then((m) => m.default);

    if (!this._metadata) return Promise.reject('Metadata not loaded');

    this.setup();
  }

  /** @ignore */
  writeValue(value: string): void {
    const country = this.findCountryByPrefix(value);
    if (country) {
      this.choosenCountry.set(country);
    }
    this.value = value;
  }

  /** @ignore */
  onChange: (value: string) => void = () => {
    /* noop function */
  };

  /** @ignore */
  onTouched: () => void = () => {
    /* noop function */
  };

  /** @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /** @ignore */
  async selectedContry(event: MatSelectChange): Promise<void> {
    const choosenContry = this.countries.find((contry) => contry.countryIsoCode === event.value);

    if (!choosenContry) return Promise.reject('Prefix not found');

    this.choosenCountry.set(choosenContry);

    this.formControl().reset();

    setTimeout(() => {
      this.phoneNumberInput.nativeElement.focus();
    }, 100);

    this.setup();
  }

  /** @ignore */
  onChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    this.onChange(value);
  }

  /** @ignore */
  getCountryName(countryIsoCode: CountryCode) {
    return this.intl[countryIsoCode as keyof WattPhoneFieldIntlService];
  }

  /** @ignore */
  private generatePhoneOptions(): void {
    const phoneOptions = maskitoPhoneOptionsGenerator({
      countryIsoCode: this.choosenCountry().countryIsoCode,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadata: this._metadata!,
      separator: ' ',
    });

    this.mask = phoneOptions;
  }

  private findCountryByPrefix(number: string): Contry | undefined {
    if (!number) return undefined;
    return this.countries.find((country) => number.startsWith(country.prefix));
  }

  /** @ignore */
  private setup(): void {
    this.generatePhoneOptions();
    this.setValidator();
  }

  /** @ignore */
  private setValidator() {
    const countryCode = this.choosenCountry().countryIsoCode;
    this.formControl().addValidators(phoneValidator(countryCode));
  }
}
