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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';

import { WattFormChipDirective } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { GetESettOutgoingMessagesQueryVariables } from '../dh-outgoing-messages-filters';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<GetESettOutgoingMessagesQueryVariables>;

/** Helper function for creating form control with `nonNullable` based on value. */
const makeFormControl = <T>(value: T = null as T) =>
  new FormControl(value, { nonNullable: Boolean(value) });

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
  ],
  selector: 'dh-outgoing-messages-filters',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="m"
      tabindex="-1"
      [formGroup]="formGroup"
      *transloco="let t; read: 'eSett.outgoingMessages.filters'"
    >
      <watt-date-range-chip formControlName="period">{{ t('period') }}</watt-date-range-chip>

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhOutgoingMessagesFiltersComponent implements OnInit {
  @Input() initial?: GetESettOutgoingMessagesQueryVariables;
  @Output() filter = new EventEmitter<GetESettOutgoingMessagesQueryVariables>();

  formGroup!: FormGroup<Filters>;

  ngOnInit() {
    this.formGroup = new FormGroup<Filters>({
      period: makeFormControl(this.initial?.period),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value));
  }
}
