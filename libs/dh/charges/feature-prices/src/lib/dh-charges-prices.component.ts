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
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import {
  ChargeTypes,
  ValidityOptions,
} from '@energinet-datahub/dh/charges/domain';

import {
  WattButtonModule,
  WattFormFieldModule,
  WattInputModule,
  WattCheckboxModule,
  WattBadgeModule,
  WattDropdownModule,
  WattSpinnerModule,
  WattDropdownOptions,
  WattDatepickerModule,
} from '@energinet-datahub/watt';
import { PushModule } from '@rx-angular/template';
import { DhChargesPricesResultScam } from './search-result/dh-charges-prices-result.component';
import { DhChargesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import { SearchCriteriaV1Dto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-charges-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-prices.component.html',
  styleUrls: ['./dh-charges-prices.component.scss'],
  providers: [DhChargesDataAccessApiStore],
})
export class DhChargesPricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = [];
  validityOptions: WattDropdownOptions = [];
  validityOption: string | undefined;
  searchCriteria: SearchCriteriaV1Dto = {};

  all$ = this.store.all$;
  isLoading$ = this.store.isLoading$;
  hasLoadingError$ = this.store.hasGeneralError$;

  private destroy$ = new Subject<void>();

  constructor(
    private translocoService: TranslocoService,
    private store: DhChargesDataAccessApiStore
  ) {}

  ngOnInit() {
    this.buildChargeTypeOptions();
    this.buildValidityOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private buildValidityOptions() {
    this.translocoService
      .selectTranslateObject('charges.prices.validityOptions')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.validityOptions = Object.keys(ValidityOptions).map((entry) => {
            return {
              value: entry[0],
              displayValue: keys[entry[0]],
            };
          });
        },
      });
  }

  private buildChargeTypeOptions() {
    this.translocoService
      .selectTranslateObject('charges.prices.chargeTypes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.chargeTypeOptions = Object.keys(ChargeTypes)
            .filter((key) => ChargeTypes[Number(key)] != null)
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue:
                  translationKeys[ChargeTypes[Number(chargeTypeKey)]],
              };
            });
        },
      });
  }

  onSubmit() {
    this.store.searchCharges(this.searchCriteria);
  }

  resetSearchCriteria() {
    console.log('reset');
  }
}

@NgModule({
  declarations: [DhChargesPricesComponent],
  imports: [
    CommonModule,
    WattButtonModule,
    WattFormFieldModule,
    WattInputModule,
    WattCheckboxModule,
    WattBadgeModule,
    WattDropdownModule,
    WattSpinnerModule,
    TranslocoModule,
    FormsModule,
    DhChargesPricesResultScam,
    WattDatepickerModule,
    PushModule,
  ],
})
export class DhChargesPricesScam {}
