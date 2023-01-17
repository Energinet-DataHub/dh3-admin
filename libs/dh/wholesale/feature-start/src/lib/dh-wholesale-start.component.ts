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
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PushModule } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import {
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt/dropdown';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { CommonModule } from '@angular/common';

interface CreateBatchFormValues {
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<{
    start: string;
    end: string;
  } | null>;
}

@Component({
  selector: 'dh-wholesale-start',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattDatepickerModule,
    WattDropdownModule,
    WattFormFieldModule,
  ],
})
export class DhWholesaleStartComponent implements OnInit, OnDestroy {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  loadingCreatingBatch$ = this.store.loadingCreatingBatch$;

  createBatchForm = new FormGroup<CreateBatchFormValues>({
    gridAreas: new FormControl(null, { validators: Validators.required }),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
    }),
  });

  optionsGridAreas: WattDropdownOption[] = [
    '351',
    '512',
    '533',
    '543',
    '584',
    '805',
    '806',
  ].map((gridAreaCode) => ({
    displayValue: gridAreaCode,
    value: gridAreaCode,
  }));

  ngOnInit(): void {
    // Close toast on navigation
    this.router.events
      .pipe(first((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.toast.dismiss();
      });

    this.store.creatingBatchSuccessTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onBatchCreatedSuccess());

    this.store.creatingBatchErrorTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onBatchCreatedError());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createBatch() {
    const { gridAreas, dateRange } = this.createBatchForm.getRawValue();
    if (
      this.createBatchForm.invalid ||
      gridAreas === null ||
      dateRange === null
    )
      return;

    this.store.createBatch({ gridAreas, dateRange });

    this.toast.open({
      type: 'loading',
      message: this.transloco.translate('wholesale.startBatch.creatingBatch'),
    });
  }

  private onBatchCreatedSuccess() {
    this.toast.update({
      type: 'success',
      message: this.transloco.translate(
        'wholesale.startBatch.creatingBatchSuccess'
      ),
    });
  }

  private onBatchCreatedError() {
    this.toast.update({
      type: 'danger',
      message: this.transloco.translate(
        'wholesale.startBatch.creatingBatchError'
      ),
    });
  }
}
