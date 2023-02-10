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
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import {
  CreateUserRoleDto,
  SelectablePermissionsDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhCreateRolePermissionTabTableComponent } from './dh-create-userrole-permissions-tab-table.component';

@Component({
  selector: 'dh-create-userrole-permissions-tab',
  templateUrl: './dh-create-userrole-permissions-tab.component.html',
  styleUrls: ['./dh-create-userrole-permissions-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    DhCreateRolePermissionTabTableComponent,
    WattEmptyStateModule,
  ],
})
export class DhCreateUserrolePermissionsTabComponent {
  @Input() permissions: SelectablePermissionsDto[] = [];

  @Output() valueChange = new EventEmitter<Partial<CreateUserRoleDto>>();

  onSelectionChange(selections: SelectablePermissionsDto[]): void {
    this.valueChange.emit({
      permissions: selections.map((perm) => perm.id),
    });
  }
}
