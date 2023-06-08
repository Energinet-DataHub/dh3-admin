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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { graphql } from '@energinet-datahub/dh/shared/domain';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    TranslocoModule,
    WattEmptyStateComponent,
    WATT_CARD,
    WattDatePipe,
    WattPaginatorComponent,
  ],
  selector: 'dh-wholesale-time-series-points',
  templateUrl: './dh-wholesale-time-series-points.component.html',
  styleUrls: ['./dh-wholesale-time-series-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTimeSeriesPointsComponent {
  @Input() set data(timeSeriesPoints: graphql.TimeSeriesPoint[]) {
    this._data = new WattTableDataSource(timeSeriesPoints);
  }

  _data: WattTableDataSource<graphql.TimeSeriesPoint> = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<graphql.TimeSeriesPoint> = {
    time: { accessor: 'time' },
    quantity: { accessor: 'quantity' },
  };
}
