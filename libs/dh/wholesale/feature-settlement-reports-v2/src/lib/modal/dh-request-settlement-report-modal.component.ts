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
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Observable, combineLatest, map, tap } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import { CalculationType, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { dhStartDateIsNotBeforeDateValidator } from '../util/dh-start-date-is-not-before-date.validator';
import { dhIsPeriodOneMonthOrLonger } from '../util/dh-is-period-one-month-or-longer';

type DhFormType = FormGroup<{
  calculationType: FormControl<string | null>;
  includeBasisData: FormControl<boolean>;
  period: FormControl<WattRange<string> | null>;
  includeMonthlySum: FormControl<boolean>;
  energySupplier?: FormControl<string | null>;
  gridAreas: FormControl<string[] | null>;
  combineResultsInOneFile: FormControl<boolean>;
}>;

@Component({
  selector: 'dh-request-settlement-report-modal',
  standalone: true,
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattCheckboxComponent,
    WattDatepickerComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,

    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      display: block;
    }

    #request-settlement-report-form {
      margin-top: var(--watt-space-ml);
    }

    .items-group > * {
      width: 85%;
    }
  `,
  templateUrl: './dh-request-settlement-report-modal.component.html',
})
export class DhRequestSettlementReportModalComponent extends WattTypedModal {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly permissionService = inject(PermissionService);

  minDate = dayjs().startOf('month').subtract(6, 'months').subtract(1, 'year').toDate();

  form: DhFormType = this.formBuilder.group({
    calculationType: new FormControl<string | null>(null, Validators.required),
    includeBasisData: new FormControl<boolean>(false, { nonNullable: true }),
    period: new FormControl<WattRange<string> | null>(null, [
      Validators.required,
      dhStartDateIsNotBeforeDateValidator(this.minDate),
    ]),
    includeMonthlySum: new FormControl<boolean>(false, { nonNullable: true }),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    combineResultsInOneFile: new FormControl<boolean>(false, { nonNullable: true }),
  });

  calculationTypeOptions = dhEnumToWattDropdownOptions(CalculationType, null, [
    CalculationType.Aggregation,
  ]);
  gridAreaOptions$ = getGridAreaOptions();
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);
  isFas$ = this.permissionService.isFas().pipe(
    tap((isFas) => {
      if (isFas) {
        this.form.addControl(
          'energySupplier',
          new FormControl<string | null>(null, Validators.required)
        );
      }
    })
  );

  showMonthlySumCheckbox$ = this.shouldShowMonthlySumCheckbox();

  miltipleGridAreasSelected$: Observable<boolean> = this.form.controls.gridAreas.valueChanges.pipe(
    map((gridAreas) => (gridAreas?.length ? gridAreas.length > 1 : false)),
    tap((moreThanOneGridAreas) => {
      if (!moreThanOneGridAreas) {
        this.form.controls.combineResultsInOneFile.setValue(false);
      }
    })
  );

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
  }

  private shouldShowMonthlySumCheckbox(): Observable<boolean> {
    return combineLatest([
      this.form.controls.calculationType.valueChanges,
      this.form.controls.period.valueChanges,
    ]).pipe(
      map(([calculationType, period]) => {
        if (calculationType == null || period == null) {
          return false;
        }

        const isSpecificCalculationType = [
          CalculationType.WholesaleFixing,
          CalculationType.FirstCorrectionSettlement,
          CalculationType.SecondCorrectionSettlement,
          CalculationType.ThirdCorrectionSettlement,
        ].includes(calculationType as CalculationType);

        return isSpecificCalculationType && dhIsPeriodOneMonthOrLonger(period);
      }),
      tap((shouldShow) => {
        if (!shouldShow) {
          this.form.controls.includeMonthlySum.setValue(false);
        }
      })
    );
  }
}
