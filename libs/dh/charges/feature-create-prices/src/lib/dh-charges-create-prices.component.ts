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
import { CommonModule } from '@angular/common';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { ChargeTypes, Resolution } from '@energinet-datahub/dh/charges/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { DhMarketParticipantDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';

@Component({
  selector: 'dh-charges-create-prices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-charges-create-prices.component.html',
  styleUrls: ['./dh-charges-create-prices.component.scss'],
  providers: [DhMarketParticipantDataAccessApiStore],
})
export class DhChargesCreatePricesComponent implements OnInit, OnDestroy {
  chargeTypeOptions: WattDropdownOptions = [];
  resolutionOptions: WattDropdownOptions = [];
  marketParticipantsOptions: WattDropdownOptions = [];

  charge = new FormGroup({
    priceId: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    chargeType: new FormControl('', Validators.required),
    priceName: new FormControl('', Validators.required),
    priceDescription: new FormControl('', Validators.required),
    priceOwner: new FormControl('', Validators.required),
    resolution: new FormControl('', Validators.required),
    effectiveDate: new FormControl(undefined, Validators.required),
    vatClassification: new FormControl(true, Validators.required),
    transparentInvoicing: new FormControl(true, Validators.required),
    taxIndicator: new FormControl(false, Validators.required),
  });

  isTariff = false;
  marketParticipants = this.marketParticipantStore.all$;

  private destroy$ = new Subject<void>();

  constructor(
    private translocoService: TranslocoService,
    private marketParticipantStore: DhMarketParticipantDataAccessApiStore
  ) {}

  ngOnInit() {
    this.marketParticipantStore.loadMarketParticipants();

    this.buildMarketParticipantOptions();
    this.buildChargeTypeOptions();
    this.buildValidityOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  chargeTypeChanged(chargeType: number) {
    this.isTariff = chargeType == Number(ChargeTypes.Tariff);

    this.enableFormGroup();

    switch (Number(chargeType)) {
      case ChargeTypes.Tariff: {
        console.log('Tariff!');
        // Resolution dropdown should only have "Hour" and "Day".
        break;
      }
      case ChargeTypes.Subscription: {
        this.disableResolutionWithValue();
        this.disableTaxIndicator();
        break;
      }
      case ChargeTypes.Fee: {
        this.disableTaxIndicator();
        this.disableTransparentInvoicing();
        this.disableResolutionWithValue();
        break;
      }
      default:
        break;
    }
  }

  createPrice() {
    if (!this.charge.valid) return;

    console.log('VALID!');
  }

  enableFormGroup() {
    this.charge.controls['resolution'].enable();
    this.charge.controls['taxIndicator'].enable();
    this.charge.controls['transparentInvoicing'].enable();
  }

  disableTaxIndicator() {
    this.charge.controls['taxIndicator'].setValue(false);
    this.charge.controls['taxIndicator'].disable();
  }

  disableTransparentInvoicing() {
    this.charge.controls['transparentInvoicing'].setValue(false);
    this.charge.controls['transparentInvoicing'].disable();
  }

  disableResolutionWithValue() {
    this.charge.controls['resolution'].setValue(
      Number(Resolution.P1M).toString()
    );
    this.charge.controls['resolution'].disable();
  }

  private buildMarketParticipantOptions() {
    this.marketParticipants.pipe(takeUntil(this.destroy$)).subscribe({
      next: (marketParticipants) => {
        if (marketParticipants == null) return;
        this.marketParticipantsOptions = marketParticipants.map((mp) => {
          return {
            value: mp.id,
            displayValue: mp.marketParticipantId || '',
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

  private buildValidityOptions() {
    this.translocoService
      .selectTranslateObject('charges.resolutionType')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.resolutionOptions = Object.keys(Resolution)
            .filter(
              (key) =>
                (Resolution[Number(key)] != null &&
                  Number(key) != Resolution.Unknown &&
                  Number(key) != Resolution.PT15M) ||
                (this.isTariff && Number(key) != Resolution.P1M)
            )
            .map((chargeTypeKey) => {
              return {
                value: chargeTypeKey,
                displayValue:
                  translationKeys[Resolution[Number(chargeTypeKey)]],
              };
            });
        },
      });
  }
}

@NgModule({
  declarations: [DhChargesCreatePricesComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    ReactiveFormsModule,
    WattButtonModule,
    WattCardModule,
    WattCheckboxModule,
    WattDatepickerModule,
    WattFormFieldModule,
    WattInputModule,
    WattDropdownModule,
  ],
})
export class DhChargesCreatePricesScam {}
