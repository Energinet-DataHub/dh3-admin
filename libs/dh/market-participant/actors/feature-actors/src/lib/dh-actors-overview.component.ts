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
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters } from './actors-filters';
import { DhActorStatusBadgeComponent } from './status-badge/dh-actor-status-badge.component';

export type Actor = ResultOf<typeof GetActorsDocument>['actors'][0];

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoModule,
    NgIf,
    DhActorsFiltersComponent,
    DhActorStatusBadgeComponent,
    WATT_TABLE,
    WATT_CARD,
    WattPaginatorComponent,
    WattEmptyStateComponent,
  ],
})
export class DhActorsOverviewComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private getActorsSubscription?: Subscription;

  getActorsQuery$ = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsDocument,
  });

  dataSource = new WattTableDataSource<Actor>([]);

  columns: WattTableColumnDef<Actor> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  filters$ = new BehaviorSubject<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  loading = true;
  error = false;

  ngOnInit(): void {
    this.getActorsSubscription = this.getActorsQuery$.valueChanges.subscribe({
      next: (result) => {
        this.loading = result.loading;

        this.dataSource.data = result.data?.actors;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.getActorsSubscription?.unsubscribe();
  }
}
