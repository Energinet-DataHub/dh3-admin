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
import { Component, Input, NgModule, OnChanges, ViewChild } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import {
  MatLegacyTableDataSource as MatTableDataSource,
  MatLegacyTableModule as MatTableModule,
} from '@angular/material/legacy-table';
import { TranslocoModule } from '@ngneat/transloco';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import {
  GridAreaChanges,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhMarketParticipantGridAreaDetailsHeaderComponent } from '../details-header/dh-market-participant-gridarea-details-header.component';
import { DhMarketParticipantGridAreaEditComponent } from '../details-edit/dh-market-participant-gridarea-edit.component';
import { DhMarketParticipantGridAreaDetailsAuditLogComponent } from '../details-auditlog/dh-market-participant-gridarea-details-auditlog.component';
import { MarketParticipantGridAreaAuditLogEntryDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-market-participant-gridarea-overview',
  styleUrls: ['./dh-market-participant-gridarea-overview.component.scss'],
  templateUrl: './dh-market-participant-gridarea-overview.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    MatMenuModule,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonComponent,
    WattIconComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    DhEmDashFallbackPipeScam,
    DhSharedUiDateTimeModule,
    WATT_DRAWER,
    DhMarketParticipantGridAreaDetailsHeaderComponent,
    DhMarketParticipantGridAreaEditComponent,
    DhMarketParticipantGridAreaDetailsAuditLogComponent,
  ],
})
export class DhMarketParticipantGridAreaOverviewComponent implements OnChanges {
  @ViewChild('drawer') drawer!: WattDrawerComponent;

  columnIds = ['code', 'name', 'actorName', 'actorNumber', 'priceAreaCode', 'validFrom', 'validTo'];

  @Input() gridAreas: GridAreaOverviewRow[] = [];
  @Input() gridChanges!: (changes: {
    gridAreaChanges: GridAreaChanges;
    onCompleted: () => void;
  }) => void;
  @Input() gridChangesLoading = false;

  @Input() isLoadingAuditLog = false;
  @Input() activeGridAreaAuditLog: MarketParticipantGridAreaAuditLogEntryDto[] = [];
  @Input() getGridAreaData!: (gridAreaId: string) => void;

  readonly dataSource: MatTableDataSource<GridAreaOverviewRow> =
    new MatTableDataSource<GridAreaOverviewRow>();

  activeRow?: GridAreaOverviewRow;

  ngOnChanges() {
    this.dataSource.data = this.gridAreas;
  }

  readonly drawerClosed = () => {
    this.activeRow = undefined;
  };

  readonly open = (row: GridAreaOverviewRow) => {
    this.activeRow = row;
    this.getGridAreaData(row.id);
    this.drawer.open();
  };

  isSelected(row: GridAreaOverviewRow): boolean {
    return this.activeRow?.id === row.id;
  }
}
