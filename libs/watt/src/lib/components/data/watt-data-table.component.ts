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
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '../vater';

import { WattCardComponent } from '../card';
import { WattSearchComponent } from '../search';
import { WattPaginatorComponent } from '../paginator';
import { WattEmptyStateComponent } from '../empty-state';

import { WattDataIntlService } from './watt-data-intl.service';
import { WattDataSourceService } from './watt-data-source.service';
import { RxPush } from '@rx-angular/template/push';
import { first } from 'rxjs';

@Component({
  selector: 'watt-data-table',
  standalone: true,
  providers: [WattDataSourceService],
  imports: [
    RxPush,
    CommonModule,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattCardComponent,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WattSearchComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-data-table h3,
      watt-data-table h4 {
        line-height: 44px;
        min-height: 44px;
        margin: 0;
      }

      watt-data-table watt-data-filters {
        min-height: 44px;
      }

      watt-data-table watt-paginator {
        display: block;
        margin: calc(-1 * var(--watt-space-m)) -24px -24px;
      }

      .watt-data-table--empty-state {
        margin-bottom: var(--watt-space-m);
        overflow: auto;

        & > watt-empty-state {
          margin: auto;
        }
      }
    `,
  ],
  template: `
    <watt-card vater fill="vertical">
      <vater-flex fill="vertical" gap="m">
        <vater-stack direction="row" gap="m">
          <vater-stack direction="row" gap="s">
            <ng-content select="h3" />
            <ng-content select="h4" />
            <span class="watt-chip-label">
              {{ count ?? (data.source$ | push)?.filteredData?.length }}
            </span>
          </vater-stack>
          <vater-spacer />
          <watt-search *ngIf="enableSearch" [label]="intl.search" (search)="onSearch($event)" />
          <ng-content select="watt-button" />
        </vater-stack>
        <ng-content select="watt-data-filters" />
        <vater-flex scrollable fill="vertical">
          <ng-content />
          <div
            *ngIf="!loading && (data.source$ | push)?.filteredData?.length === 0"
            class="watt-data-table--empty-state"
          >
            <watt-empty-state
              [icon]="error ? 'custom-power' : 'cancel'"
              [title]="error ? intl.errorTitle : intl.emptyTitle"
              [message]="error ? intl.errorMessage : intl.emptyMessage"
            />
          </div>
        </vater-flex>
        <watt-paginator [for]="data.source$ | push" />
      </vater-flex>
    </watt-card>
  `,
})
export class WattDataTableComponent {
  @Input() error: unknown;
  @Input() loading = false;
  @Input() enableSearch = true;
  @Input() count?: number;

  intl = inject(WattDataIntlService);
  data = inject(WattDataSourceService);

  onSearch(value: string) {
    this.data.source$.pipe(first()).subscribe((dataSource) => (dataSource.filter = value));
  }
}
