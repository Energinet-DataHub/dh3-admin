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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { graphql } from '@energinet-datahub/dh/shared/domain';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    MatSortModule,
    TranslocoModule,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WattCardComponent,
  ],
  selector: 'dh-wholesale-grid-areas',
  templateUrl: './dh-wholesale-grid-areas.component.html',
  styleUrls: ['./dh-wholesale-grid-areas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleGridAreasComponent {
  @ViewChild(MatSort) sort!: MatSort;

  @Input() set data(gridAreas: graphql.GridArea[]) {
    this._data = new WattTableDataSource(gridAreas);
  }

  @Input() disabled = false;

  @Output() selected = new EventEmitter<graphql.GridArea>();

  _data: WattTableDataSource<graphql.GridArea> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<graphql.GridArea> = {
    gridAreaCode: { accessor: 'code' },
    name: {
      accessor: 'name',
      cell: (row: graphql.GridArea) => row.name ?? '—',
    },
  };
}
