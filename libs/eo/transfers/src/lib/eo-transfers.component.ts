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
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AsyncPipe } from '@angular/common';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { translations } from '@energinet-datahub/eo/translations';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/components/ui-popup-message';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';

import { EoTransfersTableComponent } from './eo-transfers-table.component';
import {
  EoListedTransfer,
  EoTransferAgreementProposal,
  EoTransfersService,
} from './eo-transfers.service';
import { EoTransfersRespondProposalComponent } from './eo-transfers-respond-proposal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattCardComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    WattIconComponent,
    VaterStackComponent,
    EoTransfersRespondProposalComponent,
    TranslocoPipe,
    AsyncPipe,
  ],
  standalone: true,
  template: `
    @if (transferAgreements().error) {
      <eo-popup-message
        [title]="translations.transfers.error.title | transloco"
        [message]="translations.transfers.error.message | transloco"
      />
    }

    <watt-card class="watt-space-stack-m">
      <eo-transfers-table
        [enableCreateTransferAgreementProposal]="!!(hasProductionMeteringPoints | async)"
        [transfers]="transferAgreements().data"
        [loading]="transferAgreements().loading"
        [selectedTransfer]="selectedTransfer()"
        (transferSelected)="selectedTransfer.set($event)"
        (saveTransferAgreement)="onSaveTransferAgreement($event)"
        (proposalCreated)="addTransfer($event)"
        (removeProposal)="onRemoveProposal($event)"
      />
    </watt-card>

    <!-- Respond proposal modal -->
    <eo-transfers-repsond-proposal
      [proposalId]="proposalId"
      (accepted)="onAcceptedProposal($event)"
      (declined)="onRemoveProposal($event)"
    />
  `,
})
export class EoTransfersComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-proposal') proposalId!: string;

  @ViewChild(EoTransfersRespondProposalComponent, { static: true })
  respondProposal!: EoTransfersRespondProposalComponent;

  private transloco = inject(TranslocoService);
  private transfersService = inject(EoTransfersService);
  private toastService = inject(WattToastService);
  private meteringPointStore = inject(EoMeteringPointsStore);

  protected hasProductionMeteringPoints = this.meteringPointStore.hasProductionMeteringPoints$;
  protected translations = translations;
  protected transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: EoListedTransfer[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  protected selectedTransfer = signal<EoListedTransfer | undefined>(undefined);

  ngOnInit(): void {
    this.getTransfers();
    this.meteringPointStore.loadMeteringPoints();

    if (this.proposalId) {
      this.respondProposal.open();
    }
  }

  protected onRemoveProposal(id: string) {
    const proposal = this.transferAgreements().data.find((transfer) => transfer.id === id);
    if (proposal) {
      this.removeTransfer(id);
    }

    this.transfersService.deleteAgreementProposal(id).subscribe({
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.removalOfTransferAgreementProposalFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });

        if (proposal) {
          this.addTransfer(proposal);
        }
      },
    });
  }

  protected onAcceptedProposal(proposal: EoTransferAgreementProposal) {
    this.addTransferProposal(proposal);

    this.transfersService.createTransferAgreement(proposal.id).subscribe({
      error: () => {
        this.removeTransfer(proposal.id);

        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.creationOfTransferAgreementFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  onSaveTransferAgreement(values: {
    id: string;
    period: { endDate: number | null; hasEndDate: boolean };
  }) {
    const { endDate } = values.period;
    const { id } = values;

    this.updateEndDateOnTransferAgreement(id, endDate);
    this.updateSelectedTransferAgreement();
  }

  private updateEndDateOnTransferAgreement(id: string, endDate: number | null) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [
        ...this.transferAgreements().data.map((transfer) => {
          return transfer.id === id
            ? {
                ...transfer,
                endDate,
              }
            : transfer;
        }),
      ],
    });
  }

  private updateSelectedTransferAgreement() {
    this.selectedTransfer.set(
      this.transferAgreements().data.find(
        (transfer: EoListedTransfer) => transfer.id === this.selectedTransfer()?.id
      )
    );
  }

  protected addTransfer(transfer: EoListedTransfer) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [...this.transferAgreements().data, transfer],
    });
  }

  private addTransferProposal(proposal: EoTransferAgreementProposal) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: [
        ...this.transferAgreements().data,
        {
          ...proposal,
          senderName: proposal.senderCompanyName,
          senderTin: '',
          transferAgreementStatus: 'Proposal',
        },
      ],
    });
  }

  private removeTransfer(id: string) {
    this.transferAgreements.set({
      ...this.transferAgreements(),
      data: this.transferAgreements().data.filter((transfer) => transfer.id !== id),
    });
  }

  private getTransfers() {
    this.transferAgreements.set({
      loading: true,
      error: false,
      data: [],
    });
    this.transfersService.getTransfers().subscribe({
      next: (transferAgreements: EoListedTransfer[]) => {
        this.transferAgreements.set({
          loading: false,
          error: false,
          data: transferAgreements.map((transferAgreement) => {
            return {
              ...transferAgreement,
              startDate: transferAgreement.startDate * 1000,
              endDate: transferAgreement.endDate ? transferAgreement.endDate * 1000 : null,
            };
          }),
        });
      },
      error: () => {
        this.transferAgreements.set({
          loading: false,
          error: true,
          data: [],
        });
      },
    });
  }
}
