//#region License
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
//#endregion
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_STEPPER, WattStep } from '@energinet-datahub/watt/stepper';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { translations } from '@energinet-datahub/eo/translations';

import {
  endDateMustBeLaterThanStartDateValidator,
  minTodayValidator,
  nextHourOrLaterValidator,
  overlappingTransferAgreementsValidator,
} from '../validations';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { EoTransfersPeriodComponent } from './eo-transfers-period.component';
import { EoTransfersDateTimeComponent } from './eo-transfers-date-time.component';
import { EoTransferErrorsComponent } from './eo-transfers-errors.component';
import { EoTransferInvitationLinkComponent } from './eo-invitation-link';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { EoListedTransfer } from '../eo-transfers.service';
import { EoExistingTransferAgreement } from '../existing-transfer-agreement';
import { EoReceiverInputComponent } from './eo-receiver-input.component';
import { EoSenderInputComponent, Sender } from './eo-sender-input.component';
import { Actor } from '@energinet-datahub/eo/auth/domain';

export interface EoTransfersFormInitialValues {
  senderTin?: string;
  receiverTin?: string;
  startDate?: number;
  endDate?: number | null;
}

export interface EoTransferFormPeriod {
  startDate: FormControl<number | null | undefined>;
  endDate: FormControl<number | null | undefined>;
}

export interface EoTransfersForm {
  senderTin: FormControl<string | null>;
  receiverTin: FormControl<string | null>;
  period: FormGroup<EoTransferFormPeriod>;
}

export interface EoTransfersFormValues {
  receiverTin: string;
  period: { startDate: number; endDate: number | null; hasEndDate: boolean };
}

type FormField = 'senderTin' | 'receiverTin' | 'startDate' | 'endDate';
export type FormMode = 'create' | 'edit';

@Component({
  selector: 'eo-transfers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WattModalActionsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    EoTransfersPeriodComponent,
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    NgClass,
    WattDatePipe,
    CommonModule,
    EoTransfersDateTimeComponent,
    EoTransferErrorsComponent,
    WATT_STEPPER,
    EoTransferInvitationLinkComponent,
    VaterStackComponent,
    WattFieldHintComponent,
    TranslocoPipe,
    EoReceiverInputComponent,
    EoSenderInputComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-transfers-form .fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      eo-transfers-form form {
        height: 100%;
      }

      eo-transfers-form watt-stepper-content-wrapper {
        min-height: 341px;
      }

      eo-transfers-form .receiver,
      eo-transfers-form .timeframe-step {
        gap: var(--watt-space-l);
        display: flex;
        flex-direction: column;
      }

      eo-transfers-form .descriptor {
        color: var(--watt-color-neutral-grey-700);
        font-size: 14px;
        font-weight: normal;
      }

      eo-transfers-form .sender .watt-field-wrapper {
        max-width: 330px;
      }

      eo-transfers-form .receiver .watt-field-wrapper {
        max-width: 330px;
      }
    `,
  ],
  template: `
    <!-- Create -->
    @if (mode() === 'create') {
      <form [formGroup]="form">
        <watt-stepper (completed)="onClose()" class="watt-modal-content--full-width">
          <!-- Parties -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.parties.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.parties.nextLabel | transloco
            "
            [stepControl]="form.controls.receiverTin"
          >
            @if (actors().length > 1) {
              <h3 class="watt-headline-2">
                {{ translations.createTransferAgreementProposal.parties.titleBetween | transloco }}
              </h3>
            } @else {
              <h3 class="watt-headline-2">
                {{ translations.createTransferAgreementProposal.parties.titleTo | transloco }}
              </h3>
            }
            <p>
              {{ translations.createTransferAgreementProposal.parties.description | transloco }}
            </p>
            <eo-sender-input
              class="sender"
              [senders]="senders()"
              (onSenderChange)="onSenderTinChange($event)"
              formControlName="senderTin"
            />
            <eo-receiver-input
              class="receiver"
              formControlName="receiverTin"
              [formControl]="form.controls.receiverTin"
              [mode]="mode()"
              [filteredReceiverTins]="filteredReceiversTin()"
              [selectedCompanyName]="selectedCompanyName()"
              (selectedCompanyNameChange)="selectedCompanyName.set($event)"
              (searchChange)="onSearch($event)"
              (tinChange)="form.controls.receiverTin.setValue($event)"
            />
          </watt-stepper-step>
          <!-- Timeframe -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.timeframe.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.timeframe.nextLabel | transloco
            "
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.timeframe.previousLabel | transloco
            "
            (entering)="onEnteringTimeframeStep()"
            (leaving)="onLeavingTimeframeStep()"
            [stepControl]="form.controls.period"
          >
            <div class="timeframe-step">
              <h2>
                {{ translations.createTransferAgreementProposal.timeframe.title | transloco }}
              </h2>
              <p>
                {{ translations.createTransferAgreementProposal.timeframe.description | transloco }}
              </p>

              <eo-transfers-form-period
                formGroupName="period"
                [existingTransferAgreements]="existingTransferAgreements()"
              />
            </div>
          </watt-stepper-step>
          <!-- Volume -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.volume.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.volume.nextLabel | transloco
            "
            [disableNextButton]="generateProposalFailed()"
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.volume.previousLabel | transloco
            "
            (entering)="onSubmit()"
            (leaving)="onLeaveInvitationStep($event)"
          >
          </watt-stepper-step>
          <!-- Summary -->
          <!-- Invitation -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.summary.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.summary.invitation.nextLabel | transloco
            "
            [disableNextButton]="generateProposalFailed()"
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.summary.previousLabel | transloco
            "
            (entering)="onSubmit()"
            (leaving)="onLeaveInvitationStep($event)"
          >
            <vater-stack direction="column" gap="l" align="flex-start">
              @if (!generateProposalFailed()) {
                <h2>
                  {{
                    translations.createTransferAgreementProposal.summary.invitation.title.success
                      | transloco
                  }}
                </h2>
                <div
                  [innerHTML]="
                    translations.createTransferAgreementProposal.summary.invitation.description
                      .success | transloco
                  "
                ></div>
              } @else {
                <h2>
                  {{
                    translations.createTransferAgreementProposal.summary.invitation.title.error
                      | transloco
                  }}
                </h2>
                <div
                  [innerHTML]="
                    translations.createTransferAgreementProposal.summary.invitation.description
                      .error | transloco
                  "
                ></div>
              }
              <eo-transfers-invitation-link
                [proposalId]="proposalId()"
                [hasError]="generateProposalFailed()"
                (retry)="onSubmit()"
                #invitationLink
              />
            </vater-stack>
          </watt-stepper-step>
        </watt-stepper>
      </form>
      <!-- Edit -->
    } @else {
      <form [formGroup]="form">
        <eo-receiver-input
          [formControl]="form.controls.receiverTin"
          [mode]="mode()"
          [filteredReceiverTins]="filteredReceiversTin()"
          [selectedCompanyName]="selectedCompanyName()"
        />

        <eo-transfers-form-period
          mode="edit"
          formGroupName="period"
          [existingTransferAgreements]="existingTransferAgreements()"
        />

        <watt-modal-actions>
          <watt-button
            variant="secondary"
            data-testid="close-new-agreement-button"
            (click)="onCancel()"
          >
            {{ cancelButtonText() }}
          </watt-button>
          <watt-button data-testid="create-new-agreement-button" (click)="onSubmit()">
            {{ submitButtonText() }}
          </watt-button>
        </watt-modal-actions>
      </form>
    }
  `,
})
export class EoTransfersFormComponent implements OnInit {
  transferId = input<string | undefined>(''); // used in edit mode
  mode = input<FormMode>('create');
  submitButtonText = input<string>('');
  cancelButtonText = input<string>('');
  initialValues = input<EoTransfersFormInitialValues>({
    senderTin: '',
    receiverTin: '',
    startDate: new Date().setHours(new Date().getHours() + 1, 0, 0, 0),
    endDate: null,
  });
  editableFields = input<FormField[]>(['senderTin', 'receiverTin', 'startDate', 'endDate']);

  transferAgreements = input<EoListedTransfer[]>([]);
  actors = input.required<Actor[]>();
  proposalId = input<string | null>(null);
  generateProposalFailed = input<boolean>(false);

  submitted = output<EoTransfersFormValues>();
  canceled = output();

  @ViewChild('invitationLink') invitationLink!: EoTransferInvitationLinkComponent;

  protected translations = translations;
  protected form!: FormGroup<EoTransfersForm>;
  protected filteredReceiversTin = signal<string[]>([]);
  protected senders = signal<Sender[]>([]);
  protected existingTransferAgreements = signal<EoExistingTransferAgreement[]>([]);
  protected selectedCompanyName = signal<string | undefined>(undefined);

  private transloco = inject(TranslocoService);
  private recipientTins = signal<string[]>([]);

  onEnteringTimeframeStep() {
    this.setExistingTransferAgreements();
    this.form.controls.period.setValidators(this.getPeriodValidators());
    this.form.controls.period.updateValueAndValidity();
  }

  onLeavingTimeframeStep() {
    this.existingTransferAgreements.set([]);
  }

  constructor() {
    this.initForm();

    effect(
      () => {
        if (this.existingTransferAgreements()) {
          this.form.controls.period.setValidators(this.getPeriodValidators());
          this.form.controls.period.updateValueAndValidity();
        }
        this.recipientTins.set(this.getRecipientTins(this.transferAgreements()));
        this.onSearch('');
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(
      () => {
        const actors = this.actors();
        this.senders.set(
          actors.map((actor) => ({
            tin: actor.tin,
            name: actor.org_name,
          }))
        );
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(
      () => {
        const initialValues = this.initialValues();
        this.form.controls.senderTin.setValue(initialValues.senderTin ?? '', { emitEvent: false });
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    if (this.mode() === 'edit') {
      this.setExistingTransferAgreements();
    }
  }

  protected onSearch(query: string) {
    const senderTin = this.form.controls.senderTin.value ?? '';
    this.setFilteredReceiversTin(query, senderTin);
  }

  setFilteredReceiversTin(query: string, senderTin: string) {
    this.filteredReceiversTin.set(
      this.recipientTins().filter((tin) => {
        const searchMatches = tin.includes(query);
        const senderTinIsEmpty = senderTin === '';
        const senderTinDiffersFromReceiverTin = !tin.includes(senderTin);
        return (
          (searchMatches && senderTinIsEmpty) || (searchMatches && senderTinDiffersFromReceiverTin)
        );
      })
,    );
  }

  onSenderTinChange(senderTin: string) {
    this.setFilteredReceiversTin('', senderTin);
    if (this.form.controls.receiverTin.value === senderTin) {
      this.form.controls.receiverTin.reset();
    }
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onClose() {
    this.invitationLink.copy();
    this.onCancel();
  }

  protected onSubmit() {
    const formValue = this.form.value;
    const eoTransfersFormValues: EoTransfersFormValues = {
      receiverTin: formValue.receiverTin as string,
      period: {
        startDate: formValue.period?.startDate as number,
        endDate: formValue.period?.endDate as number | null,
        hasEndDate: formValue.period?.endDate !== null,
      },
    };
    this.submitted.emit(eoTransfersFormValues);
  }

  onLeaveInvitationStep(step: WattStep) {
    step.reset();
  }

  private setExistingTransferAgreements() {
    const recipient = this.form.controls.receiverTin.value;
    if (!recipient) this.existingTransferAgreements.set([]);

    this.existingTransferAgreements.set(
      this.transferAgreements()
        .filter((transfer) => transfer.id !== this.transferId()) // used in edit mode
        .filter((transfer) => transfer.receiverTin === recipient)
        .map((transfer) => {
          return { startDate: transfer.startDate, endDate: transfer.endDate };
        })
        // Filter out transfers that have ended
        .filter((transfer) => transfer.endDate === null || transfer.endDate > new Date().getTime())
        // TODO: CONSIDER MOVING THE SORTING
        .sort((a, b) => {
          if (a.endDate === null) return 1; // a is lesser if its endDate is null
          if (b.endDate === null) return -1; // b is lesser if its endDate is null
          return a.endDate - b.endDate;
        })
    );
  }

  private getRecipientTins(transferAgreements: EoListedTransfer[]) {
    const fallbackCompanyName = this.transloco.translate(
      this.translations.createTransferAgreementProposal.parties.unknownParty
    );
    const tins = transferAgreements.reduce((acc, transfer) => {
      if (transfer.receiverTin !== this.form.controls.senderTin.value) {
        acc.push(`${transfer.receiverTin} - ${transfer.receiverName ?? fallbackCompanyName}`);
      }
      if (transfer.senderTin !== this.form.controls.senderTin.value) {
        acc.push(`${transfer.senderTin} - ${transfer.senderName ?? fallbackCompanyName}`);
      }
      return acc;
    }, [] as string[]);

    return [...new Set(tins)];
  }

  private initForm() {
    const { senderTin, receiverTin, startDate, endDate } = this.initialValues();

    this.form = new FormGroup<EoTransfersForm>({
      senderTin: new FormControl(
        {
          value: senderTin ?? '',
          disabled: !this.editableFields().includes('senderTin'),
        }
      ),
      receiverTin: new FormControl(
        {
          value: receiverTin ?? '',
          disabled: !this.editableFields().includes('receiverTin'),
        }
      ),
      period: new FormGroup(
        {
          startDate: new FormControl(
            {
              value: startDate,
              disabled: !this.editableFields().includes('startDate'),
            },
            {
              validators: [Validators.required, nextHourOrLaterValidator()],
            }
          ),
          endDate: new FormControl(
            {
              value: endDate,
              disabled: !this.editableFields().includes('endDate'),
            },
            { validators: [minTodayValidator()] }
          ),
        },
        {
          validators: this.getPeriodValidators(),
        }
      ),
    });
  }

  getPeriodValidators() {
    return [
      endDateMustBeLaterThanStartDateValidator(),
      overlappingTransferAgreementsValidator(this.existingTransferAgreements()),
    ];
  }
}
