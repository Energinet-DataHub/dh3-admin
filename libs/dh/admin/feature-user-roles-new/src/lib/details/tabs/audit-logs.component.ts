import { Component, computed, effect, input } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetUserRoleAuditLogsDocument,
  UserRoleAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-role-audit-logs',
  standalone: true,
  templateUrl: './audit-logs.component.html',
  styles: [
    `
      h4 {
        margin: 0;
      }
    `,
  ],
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, WattDatePipe, DhResultComponent],
})
export class DhRoleAuditLogsComponent {
  private auditLogsQuery = lazyQuery(GetUserRoleAuditLogsDocument);
  private auditLogs = computed(() => this.auditLogsQuery.data()?.userRoleAuditLogs ?? []);

  loading = this.auditLogsQuery.loading;
  hasError = this.auditLogsQuery.hasError;

  dataSource = new WattTableDataSource<UserRoleAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<UserRoleAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  id = input.required<string>();

  constructor() {
    effect(() => {
      this.auditLogsQuery.query({ variables: { id: this.id() } });
    });

    effect(() => {
      this.dataSource.data = [...this.auditLogs()].reverse();
    });
  }
}
