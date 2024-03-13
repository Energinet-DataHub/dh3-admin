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
import { Component, effect, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { DhDelegation, DhDelegations } from '../dh-delegations';
import { DhDelegationStatusComponent } from '../status/dh-delegation-status.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-delegation-table',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation.table'">
      <watt-table
        [dataSource]="tableDataSource"
        [columns]="columns"
        [selectable]="true"
        [sortClear]="false"
        [suppressRowHoverHighlight]="true"
      >
        <ng-container
          *wattTableCell="columns['delegatedTo']; header: t('columns.delegatedTo'); let entry"
        >
          {{ entry.delegatedTo?.name }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['gridArea']; header: t('columns.gridArea'); let entry"
        >
          <span>{{ entry.gridArea?.code }}</span>
        </ng-container>

        <ng-container *wattTableCell="columns['period']; header: t('columns.period'); let entry">
          {{ entry.startsAt | wattDate: 'short' }}

          @if (entry.expiresAt) {
            — {{ entry.expiresAt | wattDate: 'short' }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns['status']; header: t('columns.status'); let entry">
          <dh-delegation-status [status]="entry.status" />
        </ng-container>
        <ng-container *wattTableToolbar="let selection">
          {{ selection.length }} {{ t('selectedRows') }}
          <watt-table-toolbar-spacer />
          <watt-button (click)="stopSelectedDelegations(selection)" icon="close">
            {{ t('stopDelegation') }}
          </watt-button>
        </ng-container>
      </watt-table>
    </ng-container>
  `,
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDatePipe,
    WattButtonComponent,
    DhDelegationStatusComponent,
  ],
})
export class DhDelegationTableComponent {
  tableDataSource = new WattTableDataSource<DhDelegation>([]);

  columns: WattTableColumnDef<DhDelegation> = {
    delegatedTo: { accessor: null },
    gridArea: { accessor: null },
    period: { accessor: null },
    status: { accessor: null },
  };

  data = input.required<DhDelegations>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.data();
    });
  }

  stopSelectedDelegations(selected: DhDelegation[]) {
    console.log(selected);
  }
}
