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
  OnInit,
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
import { DbAdminInviteUserStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DbAdminInviteUserStore],
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  imports: [
    CommonModule,
    TranslocoModule,
    WATT_DRAWER,
    WattButtonComponent,
    DhTabsComponent,
    DhUserStatusComponent,
    DhEditUserModalComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhUserDrawerComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private inviteUserStore = inject(DbAdminInviteUserStore);

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  selectedUser: MarketParticipantUserOverviewItemDto | null = null;

  @Output() closed = new EventEmitter<void>();

  isEditUserModalVisible = false;

  ngOnInit(): void {
    this.inviteUserStore.hasGeneralError$.subscribe(() =>
      this.toastService.open({
        message: this.transloco.translate('admin.userManagement.drawer.reinviteError'),
        type: 'danger',
      })
    );
  }

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
    });
}
