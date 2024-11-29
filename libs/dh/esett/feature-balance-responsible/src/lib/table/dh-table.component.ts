import { Component, input, output, ViewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { Sort } from '@angular/material/sort';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhBalanceResponsibleMessage } from '../dh-balance-responsible-message';
import { DhBalanceResponsibleDrawerComponent } from '../drawer/dh-drawer.component';

@Component({
  selector: 'dh-balance-responsible-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
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
    WattBadgeComponent,
    WattDatePipe,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhBalanceResponsibleDrawerComponent,
  ],
})
export class DhBalanceResponsibleTableComponent {
  activeRow: DhBalanceResponsibleMessage | undefined = undefined;

  @ViewChild(DhBalanceResponsibleDrawerComponent)
  drawer: DhBalanceResponsibleDrawerComponent | undefined;

  columns: WattTableColumnDef<DhBalanceResponsibleMessage> = {
    received: { accessor: 'receivedDateTime' },
    electricitySupplier: { accessor: null },
    balanceResponsible: { accessor: null },
    gridArea: { accessor: null },
    meteringPointType: { accessor: null },
    validFrom: { accessor: null },
    validTo: { accessor: null },
  };

  translateHeader = (columnId: string): string => {
    const baseKey = 'eSett.balanceResponsible.columns';

    return translate(`${baseKey}.${columnId}`);
  };

  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  tableDataSource = input.required<WattTableDataSource<DhBalanceResponsibleMessage>>();
  sortMetadata = input.required<Sort>();

  sortChange = output<Sort>();

  onRowClick(activeRow: DhBalanceResponsibleMessage): void {
    this.activeRow = activeRow;

    this.drawer?.open(activeRow);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
