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
import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  MatLegacyPaginator as MatPaginator,
  MatLegacyPaginatorModule as MatPaginatorModule,
} from '@angular/material/legacy-paginator';
import {
  MatLegacyTableDataSource as MatTableDataSource,
  MatLegacyTableModule as MatTableModule,
} from '@angular/material/legacy-table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { EoTransfer } from './eo-transfers.service';
import { EoTransferStore } from './eo-transfers.store';

@Component({
  selector: 'eo-transfer-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    DatePipe,
    WattBadgeComponent,
    NgIf,
    WattButtonModule,
  ],
  standalone: true,
  styles: [
    `
      .card-header {
        display: flex;
        justify-content: space-between;

        .actions {
          gap: 16px;
          display: flex;
        }
      }
    `,
  ],
  template: `
    <div class="card-header watt-space-stack-m">
      <h3>Transfer Agreements</h3>
      <div class="actions">
        <watt-button
          data-testid="download-button"
          [disabled]="true"
          icon="fileDownload"
          variant="text"
          >Download</watt-button
        >
        <watt-button
          data-testid="new-agreement-button"
          [disabled]="true"
          icon="plus"
          variant="secondary"
        >
          New transfer agreement
        </watt-button>
      </div>
    </div>
    <mat-table matSort [dataSource]="dataSource" data-testid="transfers-table">
      <!-- GSRN Column -->
      <ng-container matColumnDef="recipient">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Recipient</mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.recipient }}</mat-cell>
      </ng-container>

      <!-- Period Column -->
      <ng-container matColumnDef="period">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Agreement period </mat-header-cell>
        <mat-cell *matCellDef="let element">
          {{ element.dateFrom | date : 'dd/MM/yyyy' }} - {{ element.dateTo | date : 'dd/MM/yyyy' }}
        </mat-cell>
      </ng-container>

      <!-- Action column -->
      <ng-container matColumnDef="status">
        <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
        <mat-cell *matCellDef="let element">
          <watt-badge *ngIf="isDateActive(element.dateTo); else notActive" type="success">
            Active
          </watt-badge>
        </mat-cell>
      </ng-container>

      <!-- No data to show -->
      <ng-container *matNoDataRow>
        <p style="text-align: center;margin: 10px 0;">
          You do not have any transfer agreements to show right now.
        </p>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
    </mat-table>
    <mat-paginator
      data-testid="table-paginator"
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [showFirstLastButtons]="true"
      aria-label="Select page"
    ></mat-paginator>

    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>
  `,
})
export class EoTransferTableComponent implements AfterViewInit {
  transfers: EoTransfer[] = [];
  dataSource: MatTableDataSource<EoTransfer> = new MatTableDataSource();
  displayedColumns: string[] = ['recipient', 'period', 'status'];

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: EoTransferStore) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    // It's really important that data gets loaded after paginator, due to performance
    this.populateTable();
  }

  populateTable() {
    this.store.transfers$.subscribe((transfers) => (this.dataSource.data = transfers));
  }

  isDateActive(input: string): boolean {
    return new Date(input).getTime() >= new Date().getTime();
  }
}
