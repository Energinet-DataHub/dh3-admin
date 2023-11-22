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
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoClaimsService, Claim } from '@energinet-datahub/eo/claims/data-access-api';

import { EoClaimsTableComponent } from './claims-table.component';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { fromUnixTime } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    EoBetaMessageComponent,
    EoClaimsTableComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    WATT_CARD,
    WattButtonComponent,
    WattSearchComponent,
  ],
  providers: [WattDatePipe],
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      .badge {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: var(--watt-color-neutral-grey-300);
        color: var(--watt-on-light-high-emphasis);
        border-radius: 24px;
        padding: 2px 8px;

        small {
          @include watt.typography-font-weight('semi-bold');
        }
      }
    `,
  ],
  template: `
    <watt-card>
      <watt-card-title>
        <vater-stack direction="row" gap="s">
          <h3 class="watt-on-light--high-emphasis">Results</h3>
          <div class="badge">
            <small>{{ this.claimsTable?.dataSource?.filteredData?.length }}</small>
          </div>
          <vater-spacer />
          <watt-search label="Search" (search)="search = $event" />
        </vater-stack>
      </watt-card-title>
      <eo-claims-table
        [claims]="claims().data"
        [loading]="claims().loading"
        [hasError]="claims().hasError"
        [filter]="search"
      />
    </watt-card>
  `,
})
export class EoClaimsComponent implements OnInit {
  @ViewChild(EoClaimsTableComponent) claimsTable!: EoClaimsTableComponent;

  private claimsService: EoClaimsService = inject(EoClaimsService);
  protected wattDatePipe: WattDatePipe = inject(WattDatePipe);

  protected search = '';
  protected claims = signal<{
    loading: boolean;
    hasError: boolean;
    data: Claim[] | null;
  }>({
    loading: false,
    hasError: false,
    data: null,
  });

  ngOnInit(): void {
    this.loadclaims();
  }

  private loadclaims() {
    this.claims.set({ loading: true, hasError: false, data: null });
    this.claimsService.getClaims().subscribe({
      next: (claims) => {
        this.claims.set({
          loading: false,
          hasError: false,
          data: claims.map((claim) => {
            return {
              ...claim,
              start: this.wattDatePipe.transform(
                  fromUnixTime(claim.consumptionCertificate.start),
                  'long'
                ) ?? '',
              end:
                this.wattDatePipe.transform(
                  fromUnixTime(claim.consumptionCertificate.end),
                  'long'
                ) ?? '',
            };
          }),
        });
      },
      error: () => {
        this.claims.set({ loading: false, hasError: true, data: null });
      },
    });
  }
}
