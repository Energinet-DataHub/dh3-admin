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
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { DhActor } from './dh-actor';
import { DhActorStatusBadgeComponent } from './status-badge/dh-actor-status-badge.component';
import { DhActorDrawerComponent } from './drawer/dh-actor-drawer.component';

@Component({
  selector: 'dh-actors-table',
  standalone: true,
  templateUrl: './dh-actors-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    NgIf,
    TranslocoModule,

    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,

    DhEmDashFallbackPipe,
    DhActorStatusBadgeComponent,
    DhActorDrawerComponent,
  ],
})
export class DhActorsTableComponent {
  activeRow: DhActor | undefined = undefined;

  columns: WattTableColumnDef<DhActor> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhActor>;

  onRowClick(actor: DhActor): void {
    this.activeRow = actor;
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
