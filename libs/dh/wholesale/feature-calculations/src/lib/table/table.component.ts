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
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

type wholesaleTableData = WattTableDataSource<Calculation>;

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    WattDatePipe,
    TranslocoModule,
    VaterFlexComponent,
    VaterStackComponent,
    WattBadgeComponent,
    WattEmptyStateComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent {
  @Input() selected?: Calculation;
  @Input() loading = false;
  @Input() error = false;

  @Input() set data(calculations: Calculation[]) {
    this.dataSource.data = calculations;
  }

  @Input()
  set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Output() selectedRow: EventEmitter<Calculation> = new EventEmitter();

  dataSource: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Calculation> = {
    startedBy: { accessor: 'createdByUserName' },
    periodFrom: { accessor: (calculation) => calculation.period?.start },
    periodTo: { accessor: (calculation) => calculation.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    processType: { accessor: 'processType' },
    status: { accessor: 'executionState' },
  };

  translateHeader = (key: string) => translate(`wholesale.calculations.columns.${key}`);
}
