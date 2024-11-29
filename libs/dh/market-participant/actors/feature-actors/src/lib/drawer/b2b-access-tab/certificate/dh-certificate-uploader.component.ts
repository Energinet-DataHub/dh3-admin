import { Component, input, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

import { DhActorAuditLogService } from '../../dh-actor-audit-log.service';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

const certificateExt = '.cer';
const certificateMimeType = 'application/x-x509-ca-cert';

@Component({
  selector: 'dh-certificate-uploader',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .upload-certificate-input {
        display: none;
      }
    `,
  ],
  template: `<input
      type="file"
      class="upload-certificate-input"
      [accept]="certificateExt"
      (change)="onFileSelected(fileUpload.files)"
      #fileUpload
    />

    <watt-button
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess'"
      variant="secondary"
      [loading]="uploadInProgress()"
      (click)="fileUpload.click()"
    >
      {{ doesCertificateExist() ? t('uploadNewCertificate') : t('uploadCertificate') }}
    </watt-button>`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhCertificateUploaderComponent {
  private readonly store = inject(DhMarketPartyB2BAccessStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly auditLogService = inject(DhActorAuditLogService);

  certificateExt = certificateExt;

  doesCertificateExist = this.store.doesCertificateExist;
  doesClientSecretMetadataExist = this.store.doesClientSecretMetadataExist;
  uploadInProgress = this.store.uploadInProgress;

  actorId = input.required<string>();

  uploadSuccess = output<void>();

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      return this.startUpload(file);
    }
  }

  private isValidFileType(file: File): boolean {
    return file.type === certificateMimeType;
  }

  private startUpload(file: File): void {
    if (this.doesCertificateExist() || this.doesClientSecretMetadataExist()) {
      this.store.replaceCertificate({
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    } else {
      this.store.uploadCertificate({
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    }
  }

  private onUploadSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.uploadSuccess.emit();
    this.store.getCredentials(this.actorId());
    this.auditLogService.refreshAuditLog(this.actorId());
  };

  private onUploadErrorFn = (apiErrorCollection: ApiErrorCollection) => {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.transloco.translate(
            'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadError'
          );

    this.toastService.open({ type: 'danger', message });
  };
}
