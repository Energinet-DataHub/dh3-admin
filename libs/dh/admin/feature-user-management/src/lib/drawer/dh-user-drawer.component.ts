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
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { MarketParticipantUserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';
import { DhUserStatusComponent } from '../shared/dh-user-status.component';
import { DhEditUserModalComponent } from './dh-edit-user-modal/dh-edit-user-modal.component';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhAdminInviteUserStore,
  DhAdminUserStatusStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { RxPush } from '@rx-angular/template/push';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DhAdminInviteUserStore, DhAdminUserStatusStore],
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  imports: [
    CommonModule,
    RxPush,
    TranslocoModule,
    WATT_DRAWER,
    WattButtonComponent,
    DhTabsComponent,
    DhUserStatusComponent,
    DhEditUserModalComponent,
    DhPermissionRequiredDirective,
    WATT_MODAL,
  ],
})
export class DhUserDrawerComponent {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private inviteUserStore = inject(DhAdminInviteUserStore);
  private userStatusStore = inject(DhAdminUserStatusStore);

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  @ViewChild('deactivateConfirmationModal')
  deactivateConfirmationModal!: WattModalComponent;

  selectedUser: MarketParticipantUserOverviewItemDto | null = null;

  @Output() closed = new EventEmitter<void>();

  isEditUserModalVisible = false;

  isReinviting$ = this.inviteUserStore.isSaving$;
  isDeactivating$ = this.userStatusStore.isSaving$;

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedUser = null;
  }

  open(user: MarketParticipantUserOverviewItemDto): void {
    this.selectedUser = user;
    this.drawer.open();
  }

  modalOnClose(): void {
    this.isEditUserModalVisible = false;
  }

  reinvite = () =>
    this.inviteUserStore.reinviteUser({
      id: this.selectedUser?.id ?? '',
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reinviteSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reinviteError'),
          type: 'danger',
        }),
    });

  requestDeactiveUser = () => this.deactivateConfirmationModal.open();

  deactivate = (success: boolean) =>
    success &&
    this.userStatusStore.deactivateUser({
      id: this.selectedUser?.id ?? '',
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.deactivateSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.deactivateError'),
          type: 'danger',
        }),
    });
}
