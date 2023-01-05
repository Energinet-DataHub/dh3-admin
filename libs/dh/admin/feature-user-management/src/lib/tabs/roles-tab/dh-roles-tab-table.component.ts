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
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from '@angular/material/table';

import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { UserRoleInfoDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-roles-tab-table',
  standalone: true,
  templateUrl: './dh-roles-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    TranslocoModule,
    DhEmDashFallbackPipeScam,
    MatTableModule
  ],
})
export class DhRolesTabTableComponent implements OnChanges {
  @Input() roles: UserRoleInfoDto[] = [];
  dataSource = this.roles;
  displayedColumns = ['name', 'description', 'marketrole', 'status'];
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = this.roles;
  }
}
