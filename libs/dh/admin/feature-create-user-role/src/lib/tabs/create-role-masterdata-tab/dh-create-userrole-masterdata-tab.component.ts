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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { map, of, Subject, takeUntil } from 'rxjs';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattDropdownModule, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  MarketParticipantCreateUserRoleDto,
  MarketParticipantEicFunction,
} from '@energinet-datahub/dh/shared/domain';

interface UserRoleForm {
  name: FormControl<string>;
  description: FormControl<string>;
  eicFunction: FormControl<MarketParticipantEicFunction>;
}

@Component({
  selector: 'dh-create-userrole-masterdata-tab',
  templateUrl: './dh-create-userrole-masterdata-tab.component.html',
  styleUrls: ['./dh-create-userrole-masterdata-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    ReactiveFormsModule,
    FormsModule,
    WattInputModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhCreateUserroleMasterdataTabComponent implements OnInit, OnDestroy {
  userRoleForm = this.formBuilder.nonNullable.group<UserRoleForm>({
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    description: this.formBuilder.nonNullable.control('', Validators.required),
    eicFunction: this.formBuilder.nonNullable.control(
      MarketParticipantEicFunction.BalanceResponsibleParty,
      Validators.required
    ),
  });

  @Output() formReady = of(this.userRoleForm);
  @Output() eicFunctionSelected = new EventEmitter<MarketParticipantEicFunction>();
  @Output() valueChange = new EventEmitter<Partial<MarketParticipantCreateUserRoleDto>>();

  eicFunctionOptions: WattDropdownOptions = [];

  private destroy$ = new Subject<void>();

  constructor(private transloco: TranslocoService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildEicFunctionOptions();

    this.userRoleForm.valueChanges
      .pipe(
        map(
          (formValue): Partial<MarketParticipantCreateUserRoleDto> => ({
            name: formValue.name,
            description: formValue.description,
            eicFunction: formValue.eicFunction,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => this.valueChange.emit(value));

    this.userRoleForm.controls.eicFunction.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.userRoleForm.controls.eicFunction.enabled) this.eicFunctionSelected.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildEicFunctionOptions() {
    this.transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.eicFunctionOptions = Object.keys(MarketParticipantEicFunction)
            .map((entry) => {
              return {
                value: entry,
                displayValue: keys[entry],
              };
            })
            .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        },
      });
  }
}
