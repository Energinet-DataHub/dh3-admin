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
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styleUrls: ['./dh-edit-user-modal.component.scss'],
})
export class DhEditUserModalComponent {
  user: UserOverviewItemDto | null = null;
  @ViewChild('editUserModal') editUserModal!: WattModalComponent;

  open(user: UserOverviewItemDto | null): void {
    this.user = user;
    this.editUserModal.open();
  }

  save(): void {
    // TODO: Save user
  }

  deactivedUser(): void {
    // TODO: Deactivate user
  }
}
