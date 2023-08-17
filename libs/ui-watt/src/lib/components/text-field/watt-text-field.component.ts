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
import { NgClass } from '@angular/common';
import { Component, Input, forwardRef, ViewEncapsulation, HostBinding } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  standalone: true,
  imports: [NgClass, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextFieldComponent),
      multi: true,
    },
  ],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <input
      [attr.type]="type"
      [attr.placeholder]="placeholder"
      [value]="value"
      [(ngModel)]="model"
      [disabled]="isDisabled"
      (ngModelChange)="onChange($event)"
      [required]="required"
    />
  `,
})
export class WattTextFieldComponent implements ControlValueAccessor {
  @Input() value!: string;
  @Input() type: WattInputTypes = 'text';
  @Input() placeholder?: string;
  @Input() required = false;

  /* @ignore */
  model!: string;

  @HostBinding('class.disabled')
  isDisabled = false;

  /* @ignore */
  onChange: (value: string) => void = () => {
    /* left blank intentionally */
  };

  /* @ignore */
  onTouched: () => void = () => {
    /* left blank intentionally */
  };

  /* @ignore */
  writeValue(value: string): void {
    this.model = value;
  }

  /* @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /* @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /* @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
