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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';

import { UserOverviewItem } from '@energinet-datahub/dh/admin/data-access-api';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';

import { DhUserMasterDataComponent } from './content/dh-user-master-data.component';
import { DhUserAuditLogsComponent } from './content/dh-user-audit-logs.component';

@Component({
  selector: 'dh-drawer-tabs',
  standalone: true,
  templateUrl: './dh-drawer-tabs.component.html',
  imports: [
    TranslocoDirective,

    WattTabComponent,
    WattTabsComponent,

    DhUserMasterDataComponent,
    DhUserRolesComponent,
    DhUserAuditLogsComponent,
  ],
})
export class DhTabsComponent {
  user = input.required<UserOverviewItem>();
}
