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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoTransfersService } from './eo-transfers.service';
import { EoExistingTransferAgreement, EoTransfersStore } from './eo-transfers.store';
import { EoTransfersFormComponent } from './form/eo-transfers-form.component';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';
import { Observable, of } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [WATT_MODAL, WattValidationMessageComponent, NgIf, EoTransfersFormComponent, RxPush],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="New transfer agreement"
      [size]="'small'"
      closeLabel="Close modal"
      [loading]="creatingTransferAgreement"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <watt-validation-message
        *ngIf="creatingTransferAgreementFailed"
        label="Oops!"
        message="Something went wrong. Please try again."
        icon="danger"
        type="danger"
        size="compact"
      ></watt-validation-message>

      <eo-transfers-form
        [senderTin]="authStore.getTin$ | push"
        [existingTransferAgreements]="existingTransferAgreements$ | push"
        (receiverTinChanged)="onReceiverTinChange($event)"
        (submitted)="createAgreement($event)"
        (canceled)="modal.close(false)"
      ></eo-transfers-form>
    </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected creatingTransferAgreement = false;
  protected creatingTransferAgreementFailed = false;
  protected isFormValid = false;
  protected opened = false;
  protected existingTransferAgreements$: Observable<EoExistingTransferAgreement[]> = of([]);

  constructor(
    private service: EoTransfersService,
    private store: EoTransfersStore,
    private cd: ChangeDetectorRef,
    protected authStore: EoAuthStore
  ) {}

  open() {
    /**
     * This is a workaround for "lazy loading" the modal content
     */
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.opened = false;
    this.existingTransferAgreements$ = of([]);
  }

  onReceiverTinChange(receiverTin: string | null) {
    this.existingTransferAgreements$ = this.store.getExistingTransferAgreements$(receiverTin);
  }

  createAgreement(transferAgreement: {
    receiverTin: string;
    base64EncodedWalletDepositEndpoint: string;
    period: { startDate: number; endDate: number | null; hasEndDate: boolean };
  }) {
    const { receiverTin, base64EncodedWalletDepositEndpoint, period } = transferAgreement;
    const { startDate, endDate } = period;

    if (!receiverTin || !startDate) return;

    this.creatingTransferAgreement = true;
    this.service
      .createAgreement({ receiverTin, base64EncodedWalletDepositEndpoint, startDate, endDate })
      .subscribe({
        next: (transfer) => {
          this.store.addTransfer(transfer);
          this.creatingTransferAgreement = false;
          this.creatingTransferAgreementFailed = false;
          this.cd.detectChanges();
          this.modal.close(true);
        },
        error: () => {
          this.creatingTransferAgreement = false;
          this.creatingTransferAgreementFailed = true;
          this.cd.detectChanges();
        },
      });
  }
}
