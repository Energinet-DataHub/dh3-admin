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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { ActivatedRoute, EventType, Router, RouterOutlet } from '@angular/router';

import { filter, map } from 'rxjs';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhOrganizationsTableComponent } from './table/dh-table.component';

@Component({
  standalone: true,
  selector: 'dh-organizations-overview',
  templateUrl: './dh-organizations-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
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
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    WattSearchComponent,
    WattButtonComponent,
    WattPaginatorComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    DhOrganizationsTableComponent,
  ],
})
export class DhOrganizationsOverviewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private getOrganizationsQuery = query(GetOrganizationsDocument);

  id = signal<string | undefined>(undefined);

  dataSource = new WattTableDataSource<DhOrganization>([]);

  isLoading = this.getOrganizationsQuery.loading;
  hasError = computed(() => this.getOrganizationsQuery.error !== undefined);

  constructor() {
    effect(() => {
      this.dataSource.data = this.getOrganizationsQuery.data()?.organizations ?? [];
    });

    // Called during:
    // 1. page reload when drawer is open [followed by]
    // 2. row selection [that resuls in opening of drawer]
    this.route.firstChild?.params
      .pipe(
        map((params) => params.id),
        takeUntilDestroyed()
      )
      .subscribe(this.id.set);

    // Called during:
    // 1. navigation to route defined by this component
    // 2. row selection [that resuls in opening of drawer]
    // 3. closing of drawer
    this.router.events
      .pipe(
        filter((event) => event.type === EventType.NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        if (this.route.children.length === 0) {
          this.id.set(undefined);
        }
      });
  }

  navigate(id: string | undefined) {
    this.id.set(id);
    this.router.navigate(['details', id], {
      relativeTo: this.route,
    });
  }

  onSearch(value: string): void {
    this.dataSource.filter = value;
  }

  download(): void {
    if (!this.dataSource.sort) {
      return;
    }

    const dataToSort = structuredClone<DhOrganization[]>(this.dataSource.filteredData);
    const dataSorted = this.dataSource.sortData(dataToSort, this.dataSource.sort);

    const actorsOverviewPath = 'marketParticipant.organizationsOverview';

    const headers = [
      translate(actorsOverviewPath + '.columns.cvrOrBusinessRegisterId'),
      translate(actorsOverviewPath + '.columns.name'),
    ];

    const lines = dataSorted.map((actor) => [actor.businessRegisterIdentifier, actor.name]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Organizations' });
  }
}
