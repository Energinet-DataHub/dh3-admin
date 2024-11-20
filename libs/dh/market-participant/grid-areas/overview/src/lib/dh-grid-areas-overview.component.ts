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
import { FormsModule } from '@angular/forms';
import { Component, effect, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  exportToCSV,
} from '@energinet-datahub/dh/shared/ui-util';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  GridAreaStatus,
  GridAreaType,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhGridAreaStatusBadgeComponent } from './dh-grid-area-status-badge.component';

export interface GridAreaOverviewRow {
  code: string;
  actor: string;
  organization: string;
  status: GridAreaStatus;
  type: GridAreaType;
  priceArea: PriceAreaCode;
}

@Component({
  standalone: true,
  selector: 'dh-grid-areas-overview',
  templateUrl: './dh-grid-areas-overview.component.html',
  styles: [
    `
      h3 {
        margin: 0;
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
    FormsModule,

    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattButtonComponent,
    WattSearchComponent,
    WattDropdownComponent,
    WattPaginatorComponent,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,

    DhDropdownTranslatorDirective,
    DhGridAreaStatusBadgeComponent,
  ],
})
export class DhGridAreasOverviewComponent {
  columns: WattTableColumnDef<GridAreaOverviewRow> = {
    code: { accessor: 'code' },
    actor: { accessor: 'actor' },
    organization: { accessor: 'organization' },
    priceArea: { accessor: 'priceArea' },
    type: { accessor: 'type' },
    status: { accessor: 'status' },
  };

  gridAreas = input.required<GridAreaOverviewRow[]>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  gridAreaTypeOptions = dhEnumToWattDropdownOptions(GridAreaType, [GridAreaType.NotSet]);
  gridAreaStatusOptions = dhEnumToWattDropdownOptions(GridAreaStatus);
  selectedGridAreaStatus = signal<GridAreaStatus[] | null>([GridAreaStatus.Active]);

  selectedGridAreaType = signal<GridAreaType | null>(null);

  readonly dataSource = new WattTableDataSource<GridAreaOverviewRow>();

  constructor() {
    effect(() => {
      const statuses = this.selectedGridAreaStatus();
      const gridAreas = this.gridAreas();

      this.dataSource.data = gridAreas.filter(
        (gridArea) =>
          (gridArea.type === this.selectedGridAreaType() || this.selectedGridAreaType() === null) &&
          (statuses === null || statuses.includes(gridArea.status))
      );
    });
  }

  search(value: string) {
    this.dataSource.filter = value;
  }

  download() {
    if (!this.dataSource.sort) {
      return;
    }

    const dataSorted = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);

    const columnsPath = 'marketParticipant.gridAreas.columns';

    const statusPath = 'marketParticipant.gridAreas.status';
    const typesPath = 'marketParticipant.gridAreas.types';

    const headers = [
      `"${translate(columnsPath + '.code')}"`,
      `"${translate(columnsPath + '.actor')}"`,
      `"${translate(columnsPath + '.organization')}"`,
      `"${translate(columnsPath + '.type')}"`,
      `"${translate(columnsPath + '.status')}"`,
    ];

    const lines = dataSorted.map((gridArea) => [
      `"${gridArea.code}"`,
      `"${gridArea.actor}"`,
      `"${gridArea.organization}"`,
      `"${translate(typesPath + '.' + gridArea.type)}"`,
      `"${translate(statusPath + '.' + gridArea.status)}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Grid-areas' });
  }
}
