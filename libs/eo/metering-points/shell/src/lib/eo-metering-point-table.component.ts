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

import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  MatLegacyTableDataSource as MatTableDataSource,
  MatLegacyTableModule as MatTableModule,
} from '@angular/material/legacy-table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { EoMeteringPoint, EoMeteringPointsStore } from './eo-metering-points.store';
import {WattCardComponent} from "@energinet-datahub/watt/card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    MatTableModule,
    MatSortModule,
    WattBadgeComponent,
    WattSpinnerComponent,
    WattCardComponent,
  ],
  standalone: true,
  selector: 'eo-metering-points-table',
  styles: [
    `
      .tag {
        display: inline-flex;
        background-color: var(--watt-color-primary-light);
        padding: var(--watt-space-xs) var(--watt-space-m);
        text-transform: capitalize;
        border-radius: var(--watt-space-m);
      }

      .link {
        border: 1px solid var(--watt-color-primary-light);
        border-radius: var(--watt-space-s);
        padding: var(--watt-space-xs) 0;
        background: white;
        display: flex;
        justify-content: center;
        width: 65px;
      }

      .link:hover:enabled {
        cursor: pointer;
        background-color: var(--watt-color-primary-light);
      }

      .loadingArea {
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        gap: 1rem;
        padding: 2rem;
      }

    `,
  ],
  template: `
    <watt-card class="watt-space-stack-l">
      <h3 class="watt-space-stack-m">Welcome to the beta test of Energy Origin</h3>
      <h4 class="watt-space-stack-m">Notice of change:</h4>
      <p class="watt-space-stack-m">
        Due to changes in the solution regarding certificates, some data has been removed or is planned to be removed. <br>
        This means that metering points that have been activated for issuance of certificates before <b>August 17th, 2023</b>, must be re-activated.
        Furthermore, certificates that have been issued before <b>August 23rd, 2023</b>, will be removed. <br> <br>
        This page is based on real data and is working towards the coming solution regarding certificates. So it is not just a test, though these data cannot yet be used in a legal sense. It will be communicated, when it is out of beta and can be used legally. So you can try this without any consequences.
      </p>
    </watt-card>
    <mat-table matSort [dataSource]="dataSource">
      <!-- ID Column -->
      <ng-container matColumnDef="gsrn">
        <mat-header-cell *matHeaderCellDef mat-sort-header>ID</mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.gsrn }}</mat-cell>
      </ng-container>

      <!-- Address Column -->
      <ng-container matColumnDef="address">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Address </mat-header-cell>
        <mat-cell *matCellDef="let element"
          ><ng-container *ngIf="element.address?.address1">
            {{ element.address.address1 + ',' }}
          </ng-container>
          <ng-container *ngIf="element.address?.address2">
            {{ element.address.address2 + ',' }}
          </ng-container>
          <ng-container *ngIf="element.address?.locality">
            {{ element.address.locality + ',' }}
          </ng-container>
          {{ element?.address?.postalCode }}
          {{ element?.address?.city }}</mat-cell
        >
      </ng-container>

      <!-- Tags column -->
      <ng-container matColumnDef="tags">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Tags</mat-header-cell>
        <mat-cell *matCellDef="let element"
          ><div class="tag">{{ element?.type }}</div>
        </mat-cell>
      </ng-container>

      <!-- GC column -->
      <ng-container matColumnDef="granular certificates">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Granular Certificates</mat-header-cell>
        <mat-cell *matCellDef="let element">
          <ng-container *ngIf="element.type === 'production'">
            <watt-badge *ngIf="element.contract" type="success">Activated</watt-badge>
            <button
              *ngIf="!element.contract"
              [disabled]="element.loadingContract"
              class="link"
              (click)="createContract(element.gsrn)"
            >
              <ng-container *ngIf="!element.loadingContract">Activate</ng-container>
              <watt-spinner *ngIf="element.loadingContract" [diameter]="16"></watt-spinner>
            </button>
          </ng-container>
        </mat-cell>
      </ng-container>

      <!-- No data to show -->
      <ng-container *ngIf="(isLoading$ | async) === false">
        <ng-container *matNoDataRow>You do not have any metering points.</ng-container>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
    </mat-table>

    <div class="loadingArea" *ngIf="(isLoading$ | async) === true">
      Fetching metering points - please wait
      <watt-spinner [diameter]="16"></watt-spinner>
    </div>
  `,
})
export class EoMeteringPointListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<EoMeteringPoint> = new MatTableDataSource();
  displayedColumns: Array<string> = ['gsrn', 'address', 'tags', 'granular certificates'];
  isLoading$;

  constructor(private store: EoMeteringPointsStore) {
    this.isLoading$ = this.store.loading$;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      const itemHasActiveContract = item.contract ? 'active' : 'enable';

      switch (property) {
        case 'tags':
          return item.type;
        case 'address':
          return item.address.address1.toLowerCase();
        case 'granular certificates':
          return item.type === 'production' ? itemHasActiveContract : '';
        default:
          return item[property as keyof unknown];
      }
    };

    this.store.meteringPoints$.subscribe(
      (meteringPoints) => (this.dataSource.data = meteringPoints)
    );
  }

  createContract(gsrn: string) {
    this.store.createCertificateContract(gsrn);
  }
}
