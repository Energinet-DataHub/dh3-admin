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
import { Component, inject } from '@angular/core';
import {
  DhMarketParticipantGridAreaOverviewComponent,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/grid-areas/overview';
import { Apollo } from 'apollo-angular';
import { GetGridAreaOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dh-grid-areas-shell',
  templateUrl: './dh-grid-areas-shell.component.html',
  standalone: true,
  imports: [DhMarketParticipantGridAreaOverviewComponent],
})
export class DhGridAreasShellComponent {
  private readonly gln = new RegExp('^[0-9]+$');
  private readonly apollo = inject(Apollo);

  getActorsQuery$ = this.apollo.watchQuery({
    query: GetGridAreaOverviewDocument,
  });

  isLoading = false;
  hasError = false;
  rows: GridAreaOverviewRow[] = [];

  constructor() {
    this.getActorsQuery$.valueChanges.pipe(takeUntilDestroyed()).subscribe((result) => {
      this.hasError = !!result.error || !!result.errors?.length;
      this.isLoading = result.loading;
      this.rows =
        result.data?.gridAreaOverview?.map((x) => ({
          code: x.code,
          actor: x.actorNumber
            ? `${x.actorName} - ${this.gln.test(x.actorNumber) ? 'GLN' : 'EIC'} ${x.actorNumber}`
            : '',
          organization: x.organizationName ?? '',
        })) ?? [];
    });
  }
}
