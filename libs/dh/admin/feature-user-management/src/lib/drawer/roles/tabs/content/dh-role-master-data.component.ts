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
import { Component, Input } from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserRoleWithPermissionsDto } from '@energinet-datahub/dh/shared/domain';
import { NgIf } from '@angular/common';
import {
  WattDescriptionListComponent,
  WattDescriptionListGroups,
} from '@energinet-datahub/watt/description-list';

@Component({
  selector: 'dh-role-master-data',
  standalone: true,
  templateUrl: './dh-role-master-data.component.html',
  imports: [WattCardModule, WattDescriptionListComponent, TranslocoModule, NgIf],
})
export class DhRoleMasterDataComponent {
  @Input() role: UserRoleWithPermissionsDto | null = null;

  getMasterData(): WattDescriptionListGroups {
    if (!this.role) return [];

    return [
      {
        term: translate('admin.userManagement.tabs.masterData.name'),
        description: this.role.name,
      },
      {
        term: translate('admin.userManagement.tabs.masterData.description'),
        description: this.role.description,
      },
      {
        term: translate('admin.userManagement.tabs.masterData.marketRole'),
        description: translate('marketParticipant.marketRoles.' + this.role.eicFunction),
      },
    ];
  }
}
