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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EoCertificate } from './eo-certificates.service';
import { EoCertificatesStore } from './eo-certificates.store';

@Component({
  selector: 'eo-certificates-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatSortModule],
  standalone: true,
  styles: [],
  template: `
    <mat-paginator
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [showFirstLastButtons]="true"
      aria-label="Select page"
    ></mat-paginator>
    <mat-table matSort [dataSource]="dataSource">
      <!-- Time Column -->
      <ng-container matColumnDef="dateFrom">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Time
        </mat-header-cell>
        <mat-cell *matCellDef="let element">
          {{ element.dateFrom * 1000 | date: 'dd-MMM-y HH:mm' }}-{{
            element.dateTo * 1000 | date: 'HH:mm'
          }}
        </mat-cell>
      </ng-container>

      <!-- GSRN Column -->
      <ng-container matColumnDef="gsrn">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Metering Point
        </mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.gsrn }}</mat-cell>
      </ng-container>

      <!-- Quantity Column -->
      <ng-container matColumnDef="quantity">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Amount
        </mat-header-cell>
        <mat-cell *matCellDef="let element"
          >{{ element.quantity.toLocaleString() }} Wh</mat-cell
        >
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
    </mat-table>
  `,
})
export class EoCertificatesTableComponent implements AfterViewInit {
  loadingDone$ = this.store.loadingDone$;
  data$ = this.store.certificates$;
  dataSource: MatTableDataSource<EoCertificate> = new MatTableDataSource();
  displayedColumns: string[] = ['dateFrom', 'gsrn', 'quantity'];

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: EoCertificatesStore) {
    this.data$.subscribe((certs) => (this.dataSource.data = certs));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.paginator;
  }
}
