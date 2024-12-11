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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { translations } from '@energinet-datahub/eo/translations';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import { EoTransfersFormComponent } from './form/eo-transfers-form.component';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';

// TODO: MOVE THIS TO DOMAIN
export interface EoTransferAgreementsWithRecipient {
  startDate: number;
  endDate: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [
    EoTransfersFormComponent,
    WATT_MODAL,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    TranslocoPipe,
  ],
  standalone: true,
  template: `
      <watt-modal
        #modal
        [title]="translations.createTransferAgreementProposal.title | transloco"
        [closeLabel]="translations.createTransferAgreementProposal.closeLabel | transloco"
        (closed)="onClosed()"
        minHeight="634px"
        size="large"
      >
        <!-- We don't use the build-in loading state for the modal, since it wont update properly -->
        @if (creatingTransferAgreementProposal) {
          <div class="watt-modal__spinner" style="z-index: 2;">
            <watt-spinner />
          </div>
        }

        <eo-transfers-form
          [senderTin]="authService.user()?.profile?.org_cvr"
          [transferAgreements]="transferAgreements"
          [generateProposalFailed]="creatingTransferAgreementProposalFailed"
          [proposalId]="proposalId"
          (submitted)="createAgreementProposal($event)"
          (canceled)="modal.close(false)"
        />
      </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent {
  @Input() transferAgreements: EoListedTransfer[] = [];
  @Output() proposalCreated = new EventEmitter<EoListedTransfer>();

  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected authService = inject(EoAuthService);
  private service = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  protected translations = translations;
  protected recipientTins: string[] = [];

  protected creatingTransferAgreementProposal = false;
  protected creatingTransferAgreementProposalFailed = false;
  protected isFormValid = false;
  protected opened = false;
  protected proposalId: null | string = null;

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.creatingTransferAgreementProposal = false;
    this.creatingTransferAgreementProposalFailed = false;
    this.isFormValid = false;
    this.opened = false;
  }

  createAgreementProposal(transferAgreement: {
    receiverTin: string;
    period: { startDate: number; endDate: number | null; hasEndDate: boolean };
  }) {
    const { period, receiverTin } = transferAgreement;
    const { startDate, endDate } = period;

    if (!startDate) return;

    this.creatingTransferAgreementProposal = true;
    this.proposalId = null;
    const proposal = {
      receiverTin,
      startDate,
      endDate,
      transferAgreementStatus: 'Proposal' as EoListedTransfer['transferAgreementStatus'],
    };
    this.service.createAgreementProposal(proposal).subscribe({
      next: (proposalId) => {
        this.proposalId = proposalId;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = false;
        this.proposalCreated.emit({
          ...proposal,
          id: proposalId,
          senderTin: this.authService.user()?.profile.org_cvr as string,
          senderName: this.authService.user()?.profile.name as string,
        });
        this.cd.detectChanges();
      },
      error: () => {
        this.proposalId = null;
        this.creatingTransferAgreementProposal = false;
        this.creatingTransferAgreementProposalFailed = true;
        this.cd.detectChanges();
      },
    });
  }
}
