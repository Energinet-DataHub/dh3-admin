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
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhOutgoingMessage } from '../dh-outgoing-message';
import { DhOutgoingMessageDrawerComponent } from '../drawer/dh-outgoing-message-drawer.component';
import { DhOutgoingMessageStatusBadgeComponent } from '../status-badge/dh-outgoing-message-status-badge.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'dh-outgoing-messages-table',
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
    NgIf,
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,

    DhOutgoingMessageDrawerComponent,
    DhOutgoingMessageStatusBadgeComponent,
  ],
})
export class DhOutgoingMessagesTableComponent {
  activeRow: DhOutgoingMessage | undefined = undefined;

  @ViewChild(DhOutgoingMessageDrawerComponent)
  drawer: DhOutgoingMessageDrawerComponent | undefined;

  columns: WattTableColumnDef<DhOutgoingMessage> = {
    created: { accessor: 'created' },
    id: { accessor: 'documentId' },
    calculationType: { accessor: 'calculationType' },
    messageType: { accessor: 'timeSeriesType' },
    gridArea: { accessor: 'gridArea' },
    status: { accessor: 'documentStatus' },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhOutgoingMessage>;

  @Output() sortChange = new EventEmitter<Sort>();

  onRowClick(activeRow: DhOutgoingMessage): void {
    this.activeRow = activeRow;
    this.drawer?.open(activeRow.documentId);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
