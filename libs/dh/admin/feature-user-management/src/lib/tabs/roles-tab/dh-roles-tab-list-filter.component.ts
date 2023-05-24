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
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { DhSharedUiSearchComponent } from '@energinet-datahub/dh/shared/ui-search';

@Component({
  selector: 'dh-roles-tab-list-filter',
  standalone: true,
  templateUrl: './dh-roles-tab-list-filter.component.html',
  styles: [
    `
      :host {
        display: flex;
        width: 50%;
        gap: var(--watt-space-m);
      }
    `,
  ],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    TranslocoModule,
    WattDropdownComponent,
    WATT_FORM_FIELD,
    ReactiveFormsModule,
    DhSharedUiSearchComponent,
  ],
})
export class DhRolesTabListFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Output() statusChanged = new EventEmitter<MarketParticipantUserRoleStatus | null>();
  @Output() eicFunctionChanged = new EventEmitter<MarketParticipantEicFunction[] | null>();
  @Output() searchTermChanged = new EventEmitter<string | null>();

  statusFormControl = new FormControl<MarketParticipantUserRoleStatus | null>(null);
  eicFunctionFormControl = new FormControl<MarketParticipantEicFunction[] | null>(null);

  constructor(private trans: TranslocoService) {}

  statusListOptions: WattDropdownOption[] = [];
  eicFunctionListListOptions: WattDropdownOption[] = [];

  ngOnInit(): void {
    this.buildStatusListOptions();
    this.buildMarketRoleListOptions();

    this.statusFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.statusChanged.emit(e));

    this.eicFunctionFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.eicFunctionChanged.emit(e));

    this.statusFormControl.setValue(
      this.statusListOptions[0].value as MarketParticipantUserRoleStatus
    );
  }

  search(searchTerm: string | null): void {
    this.searchTermChanged.emit(searchTerm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildStatusListOptions() {
    this.trans
      .selectTranslateObject('admin.userManagement.roleStatus')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.statusListOptions = Object.keys(MarketParticipantUserRoleStatus).map((entry) => {
            return {
              value: entry,
              displayValue: keys[entry.toLowerCase()],
            };
          });
        },
      });
  }

  private buildMarketRoleListOptions() {
    this.trans
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.eicFunctionListListOptions = Object.keys(MarketParticipantEicFunction).map(
            (entry) => {
              return {
                value: entry,
                displayValue: keys[entry],
              };
            }
          );
        },
      });
  }
}
