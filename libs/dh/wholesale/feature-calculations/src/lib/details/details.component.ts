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
import { Component, ViewChild, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { Subscription, takeUntil } from 'rxjs';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { GetCalculationDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { DhCalculationsGridAreasComponent } from '../grid-areas/grid-areas.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhCalculationsGridAreasComponent,
    DhEmDashFallbackPipe,
    TranslocoModule,
    WATT_DRAWER,
    WattBadgeComponent,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
  ],
  selector: 'dh-calculations-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DhCalculationsDetailsComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  @Output() closed = new EventEmitter<void>();

  private apollo = inject(Apollo);
  private subscription?: Subscription;

  id?: string;
  calculation?: Calculation;
  error = false;
  loading = false;

  open(id: string): void {
    this.id = id;
    this.drawer.open();
    this.subscription?.unsubscribe();
    this.subscription = this.apollo
      .watchQuery({
        errorPolicy: 'all',
        returnPartialData: true,
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: GetCalculationDocument,
        variables: { id },
      })
      .valueChanges.pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.calculation = result.data?.calculation ?? undefined;
          this.loading = result.loading;
          this.error = !!result.errors;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
