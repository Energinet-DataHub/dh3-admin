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
import { Component, effect, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetArchivedMessagesQueryVariables,
  SortEnumType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';

@Component({
  selector: 'dh-message-archive-search-table',
  standalone: true,
  imports: [
    TranslocoDirective,
    WattButtonComponent,
    WattDataTableComponent,
    WattEmptyStateComponent,
    WATT_TABLE,
    VaterUtilityDirective,
    WattDatePipe,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'messageArchive'"
      vater
      inset="ml"
      [error]="dataSource.error"
    >
      <h3>{{ t('results') }}</h3>
      <watt-button variant="secondary" icon="plus" (click)="start.emit()">
        {{ t('new') }}
      </watt-button>
      <watt-table
        *transloco="let resolveHeader; read: 'messageArchive.columns'"
        #table
        description="Search result"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="selectionChange.emit($event)"
      >
        <ng-container *wattTableCell="columns['documentType']; let row">
          <div>
            {{ row.businessTransaction }}
            <br />
            <span class="number">{{ row.documentType }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['sender']; let row">
          <div>
            {{ row.sender?.displayName }}
            <br />
            <span class="number">{{ row.sender?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['receiver']; let row">
          <div>
            {{ row.receiver?.displayName }}
            <br />
            <span class="number">{{ row.receiver?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['createdAt']; let row">
          <div style="white-space: nowrap">
            {{ row.createdAt | wattDate: 'long' }}
          </div>
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMessageArchiveSearchTableComponent {
  variables = input<GetArchivedMessagesQueryVariables | undefined>();
  selection = input<ArchivedMessage | undefined>();
  selectionChange = output<ArchivedMessage>();
  start = output();
  dataSource = new GetArchivedMessagesDataSource({
    skip: true,
    variables: {
      created: { start: new Date(), end: new Date() },
      order: { createdAt: SortEnumType.Desc },
    },
  });

  refetch = effect(() => this.variables() && this.dataSource.refetch(this.variables()));

  columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    sender: { accessor: (m) => m.sender?.displayName },
    receiver: { accessor: (m) => m.receiver?.displayName },
    createdAt: { accessor: 'createdAt' },
  };
}
