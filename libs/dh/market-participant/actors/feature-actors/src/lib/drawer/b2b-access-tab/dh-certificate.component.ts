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
import { Component, Input, OnChanges, computed, effect, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { DhMarketParticipantCredentialsStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhRemoveCertificateModalComponent } from './dh-remove-certificate-modal.component';

const certificateExt = '.cer';
const certificateMimeType = 'application/x-x509-ca-cert';

type DhCertificateTableRow = {
  translationKey: string;
  value?: string;
  valueIsDate?: boolean;
  showActionButton?: boolean;
};

@Component({
  selector: 'dh-certificate',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      h4 {
        margin-top: 0;
      }

      .certificate-input {
        display: none;
      }
    `,
  ],
  templateUrl: './dh-certificate.component.html',
  imports: [
    NgIf,
    TranslocoDirective,
    TranslocoPipe,

    WattButtonComponent,
    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    WattValidationMessageComponent,
    WattSpinnerComponent,
    WattDatePipe,
    WATT_TABLE,

    DhEmDashFallbackPipe,
  ],
  viewProviders: [DhMarketParticipantCredentialsStore],
})
export class DhCertificateComponent implements OnChanges {
  private readonly store = inject(DhMarketParticipantCredentialsStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly modalService = inject(WattModalService);

  dataSource = new WattTableDataSource<DhCertificateTableRow>([]);
  columns: WattTableColumnDef<DhCertificateTableRow> = {
    translationKey: { accessor: 'translationKey' },
    value: { accessor: 'value' },
    showActionButton: { accessor: 'showActionButton', align: 'right' },
  };

  certificateExt = certificateExt;

  isInvalidFileType = signal(false);

  doesCertificateExist = toSignal(this.store.doesCertificateExist$);
  certificateMetadata = toSignal(this.store.certificateMetadata$);

  loadingCredentials = toSignal(this.store.loadingCredentials$);
  isUploadInProgress = toSignal(this.store.AddCredentialsInProgress$);
  isRemoveInProgress = toSignal(this.store.removeInProgress$);

  showSpinner = computed(() => {
    return this.loadingCredentials() || this.isUploadInProgress() || this.isRemoveInProgress();
  });

  @Input({ required: true }) actorId = '';

  constructor() {
    effect(() => {
      const tableData: DhCertificateTableRow[] = [
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.thumbprint',
          value: this.certificateMetadata()?.thumbprint,
          showActionButton: true,
        },
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.expiryDate',
          value: this.certificateMetadata()?.expirationDate,
          valueIsDate: true,
        },
      ];

      this.dataSource.data = tableData;
    });
  }

  ngOnChanges(): void {
    this.store.getCredentials(this.actorId);
  }

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      this.isInvalidFileType.set(false);

      return this.startUpload(this.actorId, file);
    } else {
      this.isInvalidFileType.set(true);
    }
  }

  removeCertificate(): void {
    this.modalService.open({
      component: DhRemoveCertificateModalComponent,
      onClosed: (result) => {
        if (result) {
          this.store.removeCertificate({
            actorId: this.actorId,
            onSuccess: this.onRemoveSuccessFn,
            onError: this.onRemoveErrorFn,
          });
        }
      },
    });
  }

  private startUpload(actorId: string, file: File): void {
    this.store.uploadCertificate({
      actorId,
      file,
      onSuccess: this.onUploadSuccessFn,
      onError: this.onUploadErrorFn,
    });
  }

  private isValidFileType(file: File): boolean {
    return file.type === certificateMimeType;
  }

  private readonly onUploadSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.uploadSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.store.getCredentials(this.actorId);
  };

  private readonly onUploadErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.uploadError'
    );

    this.toastService.open({ type: 'danger', message });
  };

  private readonly onRemoveSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.removeSuccess'
    );

    this.toastService.open({ type: 'success', message });
  };

  private readonly onRemoveErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.removeError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
