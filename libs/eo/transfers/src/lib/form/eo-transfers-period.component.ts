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
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, FormGroupDirective } from '@angular/forms';
import { add, isAfter } from 'date-fns';
import { CommonModule, NgClass, NgIf, NgSwitch } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { EoExistingTransferAgreement } from '../eo-transfers.store';
import { EoTransfersDateTimeComponent } from './eo-transfers-date-time.component';
import { EoTransferFormPeriod } from './eo-transfers-form.component';
import { EoTransferErrorsComponent } from './eo-transfers-errors.component';

interface EoTransfersPeriodForm extends EoTransferFormPeriod {
  hasEndDate: FormControl<boolean>;
}

@Component({
  selector: 'eo-transfers-form-period',
  standalone: true,
  imports: [
    CommonModule,
    EoTransfersDateTimeComponent,
    NgClass,
    NgIf,
    NgSwitch,
    ReactiveFormsModule,
    WattDatePipe,
    WattRadioComponent,
    WattFieldErrorComponent,
    EoTransferErrorsComponent,
  ],
  styles: [
    `
      .start-date {
        position: relative;
      }

      .watt-label {
        width: 100%;
      }

      .end-date {
        position: relative;

        .radio-buttons-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        watt-form-field .mat-placeholder-required.mat-form-field-required-marker {
          display: none;
        }

        .end-date-label {
          margin-bottom: var(--watt-space-s);
        }

        .end-by-container {
          position: relative;
          watt-radio {
            margin-right: var(--watt-space-m);
            height: 80px;
          }
        }

        .end-by-container,
        .end-by-container watt-radio {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
      }

      .asterisk {
        color: var(--watt-color-primary);
      }

      .has-error {
        --watt-radio-color: var(--watt-color-state-danger);

        p,
        p .asterisk {
          color: var(--watt-color-state-danger);
        }
      }
    `,
  ],
  template: `
    <ng-container [formGroup]="form">
      <!-- Start of period -->
      <fieldset class="start-date" [ngClass]="{ 'has-error': form.controls.startDate.errors }">
        <eo-transfers-datetime
          formControlName="startDate"
          label="Start of period"
          [min]="minStartDate"
          [existingTransferAgreements]="existingTransferAgreements"
        />
        <eo-transfers-errors
          [showError]="
            (form.controls.startDate.touched || form.controls.startDate.dirty) &&
            !!form.controls.startDate.errors
          "
        >
          <watt-field-error [style.opacity]="form.controls.startDate.errors?.['required'] ? 1 : 0">
            The start of the period is required
          </watt-field-error>
          <watt-field-error
            [style.opacity]="form.controls.startDate.errors?.['nextHourOrLater'] ? 1 : 0"
          >
            The start of the period must be at least the next hour from now
          </watt-field-error>
          <watt-field-error
            [style.opacity]="form.controls.startDate.errors?.['overlapping']?.start ? 1 : 0"
          >
            <ng-container *ngIf="form.controls.startDate.errors?.['overlapping']?.start; let error">
              Chosen period overlaps with an existing agreement: <br />{{
                error.startDate | wattDate : 'long'
              }}
              - {{ (error.endDate | wattDate : 'long') || 'no end of period' }}
            </ng-container>
          </watt-field-error>
        </eo-transfers-errors>
      </fieldset>

      <!-- End of period -->
      <fieldset
        class="end-date"
        [ngClass]="{ 'has-error': form.controls.endDate.errors || form.controls.hasEndDate.errors }"
      >
        <p class="watt-label end-date-label">End of period <span class="asterisk">*</span></p>
        <div class="radio-buttons-container">
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="false"
            >No end date</watt-radio
          >
          <div class="end-by-container">
            <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="true"
              >End by</watt-radio
            >
            <eo-transfers-datetime
              formControlName="endDate"
              *ngIf="form.value.hasEndDate"
              [min]="minEndDate"
              [existingTransferAgreements]="existingTransferAgreements"
            ></eo-transfers-datetime>

            <eo-transfers-errors
              [showError]="!!form.controls.endDate.errors || !!form.controls.hasEndDate.errors"
            >
              <watt-field-error
                [style.opacity]="form.controls.endDate.errors?.['minToday'] ? 1 : 0"
              >
                The end of the period must be today or later
              </watt-field-error>
              <watt-field-error
                [style.opacity]="form.controls.endDate.errors?.['endDateMustBeLaterThanStartDate'] ? 1 : 0"
              >
                The end of the period must be later than the start of the period
              </watt-field-error>
              <watt-field-error
                [style.opacity]="form.controls.hasEndDate.errors?.['overlapping']?.end ? 1 : 0"
              >
                <ng-container
                  *ngIf="form.controls.hasEndDate.errors?.['overlapping']?.end; let error"
                >
                  Because you haven't chosen an end date, the period overlaps with an existing
                  agreement:
                  {{ error.startDate | wattDate : 'long' }} -
                  {{ (error.endDate | wattDate : 'long') || 'no end of period' }}
                </ng-container>
              </watt-field-error>
              <watt-field-error
                [style.opacity]="form.controls.endDate.errors?.['overlapping']?.end ? 1 : 0"
              >
                <ng-container *ngIf="form.controls.endDate.errors?.['overlapping']?.end; let error">
                  End by overlaps with an existing agreement:<br />
                  {{ error.startDate | wattDate : 'long' }} -
                  {{ (error.endDate | wattDate : 'long') || 'no end of period' }}
                </ng-container>
              </watt-field-error>
            </eo-transfers-errors>
          </div>
        </div>
      </fieldset>
    </ng-container>
  `,
})
export class EoTransfersPeriodComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];

  protected form!: FormGroup<EoTransfersPeriodForm>;
  protected minStartDate: Date = new Date();
  protected minEndDate: Date = new Date();

  private destroy$: Subject<void> = new Subject();
  private rootFormGroup = inject(FormGroupDirective);

  ngOnInit() {
    this.initForm();
    this.subscribeStartDateChanges();
    this.subscribeHasEndDateChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetHours(date: number): number {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  private initForm() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.form.addControl(
      'hasEndDate',
      new FormControl(
        {
          value: !!this.form.controls.endDate.value,
          disabled: this.form.controls.endDate.disabled,
        },
        { nonNullable: true }
      )
    );
  }

  private subscribeStartDateChanges() {
    if (this.form.controls.startDate.enabled) {
      this.form.controls['startDate'].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((startDate) => {
          const today = new Date();

          this.minEndDate =
            startDate && isAfter(new Date(startDate), today) ? new Date(startDate) : new Date();
        });
    }
  }

  private subscribeHasEndDateChanges() {
    this.form.controls['hasEndDate'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasEndDate) => {
        this.setEndDateAndTimeBasedOnStartDateAndTime(hasEndDate);
      });
  }

  private setEndDateAndTimeBasedOnStartDateAndTime(hasEndDate: boolean) {
    if (hasEndDate && this.form.controls['startDate'].value) {
      const nextDay = add(new Date(this.form.controls['startDate'].value), {
        days: 1,
      });

      this.form.controls['endDate'].setValue(
        isAfter(nextDay, this.minEndDate) ? nextDay.getTime() : this.minEndDate.getTime()
      );
    } else {
      this.form.controls['endDate'].setValue(null);
    }
  }
}
