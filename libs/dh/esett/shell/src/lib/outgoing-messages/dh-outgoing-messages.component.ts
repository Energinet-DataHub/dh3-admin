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
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { Apollo } from 'apollo-angular';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { GetOutgoingMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';
import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages',
  templateUrl: './dh-outgoing-messages.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      watt-card-title {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      watt-search {
        margin-left: auto;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattSearchComponent,

    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessagesTableComponent,
  ],
})
export class DhOutgoingMessagesComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([]);
  totalCount = 0;

  searchInput$ = new BehaviorSubject<string>('');

  isLoading = false;
  hasError = false;

  filter$ = new BehaviorSubject<DhOutgoingMessagesFilters>({
    period: {
      start: sub(startOfDay(new Date()), { days: 2 }),
      end: endOfDay(new Date()),
    },
  });

  outgoingMessages$ = this.filter$.pipe(
    switchMap(
      (filters) =>
        this.apollo.watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetOutgoingMessagesDocument,
          variables: {
            pageNumber: 1,
            pageSize: 100,
            periodFrom: filters.period?.start,
            periodTo: filters.period?.end,
          },
        }).valueChanges
    ),
    takeUntil(this.destroy$)
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.esettExchangeEvents.items;
        this.totalCount = result.data?.esettExchangeEvents.totalCount;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
