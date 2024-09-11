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
import { Component, effect, inject, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhSettlementReport, DhSettlementReports } from '../dh-settlement-report';
import { DhSettlementReportsStatusComponent } from './dh-settlement-reports-status.component';

@Component({
  selector: 'dh-settlement-reports-table',
  standalone: true,
  templateUrl: './dh-settlement-reports-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattDatePipe,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,

    DhSettlementReportsStatusComponent,
  ],
})
export class DhSettlementReportsTableComponent {
  private permissionService = inject(PermissionService);
  private httpClient = inject(HttpClient);
  private toastService = inject(WattToastService);

  columns: WattTableColumnDef<DhSettlementReport> = {
    actorName: { accessor: (report) => report.actor?.name },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: (report) => report.period.start },
    numberOfGridAreasInReport: { accessor: 'numberOfGridAreasInReport' },
    includesBasisData: { accessor: 'includesBasisData' },
    status: { accessor: 'statusType' },
  };

  displayedColumns = Object.keys(this.columns);

  tableDataSource = new WattTableDataSource<DhSettlementReport>([]);

  settlementReports = input.required<DhSettlementReports>();

  constructor() {
    this.permissionService
      .isFas()
      .pipe(takeUntilDestroyed())
      .subscribe((isFas) => {
        this.displayedColumns = isFas
          ? this.displayedColumns
          : this.displayedColumns.filter((column) => column !== 'actorName');
      });

    effect(() => (this.tableDataSource.data = this.settlementReports()));
  }

  downloadReport(settlementReport: DhSettlementReport) {
    const { settlementReportDownloadUrl } = settlementReport;

    if (!settlementReportDownloadUrl) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    const fileName = this.settlementReportName(settlementReport);
    const fileOptions = { name: fileName, type: 'application/zip' };

    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    this.httpClient
      .get(settlementReportDownloadUrl, { responseType: 'blob' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () =>
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          }),
      });
  }

  private settlementReportName(report: DhSettlementReport): string {
    const baseTranslationPath = 'wholesale.settlementReports';

    const calculationPeriod = wattFormatDate(report.period, 'short');
    const calculationType = translate(
      `${baseTranslationPath}.calculationTypes.${report.calculationType}`
    );

    let name = translate(`${baseTranslationPath}.downloadReport.baseName`);
    name += ` - ${calculationType}`;

    if (report.numberOfGridAreasInReport > 1) {
      name += ` - ` + translate(`${baseTranslationPath}.downloadReport.multipleGridAreas`);
    }

    return `${name} - ${calculationPeriod}.zip`;
  }
}
