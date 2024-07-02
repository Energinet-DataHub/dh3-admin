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
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { MarketParticipantUserRoleStatus } from '@energinet-datahub/dh/shared/domain';
import { UserRoleStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-role-status',
  standalone: true,
  template: `<ng-container *transloco="let t; read: 'admin.userManagement.roleStatus'">
    @if (status === 'Active' || status === 'ACTIVE') {
      <watt-badge type="info">{{ t('Active') }}</watt-badge>
    } @else if (status === 'Inactive' || status === 'INACTIVE') {
      <watt-badge type="warning">{{ t('Inactive') }}</watt-badge>
    }
  </ng-container>`,
  imports: [TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhRoleStatusComponent {
  @Input() status!: MarketParticipantUserRoleStatus | UserRoleStatus;
}
