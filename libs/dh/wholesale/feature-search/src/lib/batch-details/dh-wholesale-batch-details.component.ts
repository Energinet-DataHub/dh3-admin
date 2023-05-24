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
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { DhWholesaleGridAreasComponent } from '../grid-areas/dh-wholesale-grid-areas.component';

import { navigateToWholesaleCalculationSteps } from '@energinet-datahub/dh/wholesale/routing';
import { Subscription, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    DhSharedUiDateTimeModule,
    CommonModule,
    DhWholesaleGridAreasComponent,
    TranslocoModule,
    WattBadgeComponent,
    WattCardComponent,
    WATT_DRAWER,
    WATT_BREADCRUMBS,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipeScam,
  ],
  selector: 'dh-wholesale-batch-details',
  templateUrl: './dh-wholesale-batch-details.component.html',
  styleUrls: ['./dh-wholesale-batch-details.component.scss'],
})
export class DhWholesaleBatchDetailsComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  @Output() closed = new EventEmitter<void>();

  private router = inject(Router);
  private apollo = inject(Apollo);
  private subscription?: Subscription;

  batchId?: string;
  batch?: graphql.Batch;
  error = false;
  loading = false;

  open(id: string): void {
    this.batchId = id;
    this.drawer.open();
    this.subscription?.unsubscribe();
    this.subscription = this.apollo
      .watchQuery({
        errorPolicy: 'all',
        returnPartialData: true,
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetBatchDocument,
        variables: { id },
      })
      .valueChanges.pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.batch = result.data?.batch ?? undefined;
          this.loading = result.loading;
          this.error = !!result.errors;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }

  onGridAreaSelected(batch: graphql.Batch, gridArea: graphql.GridArea): void {
    navigateToWholesaleCalculationSteps(this.router, batch, gridArea);
  }
}
