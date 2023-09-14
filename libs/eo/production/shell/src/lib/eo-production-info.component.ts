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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { EoProductionStore } from './eo-production.store';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WATT_CARD, WattSpinnerComponent, NgIf, AsyncPipe],
  selector: 'eo-production-info',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-card>
      <h4 class="output watt-space-stack-s">Your electricity production</h4>
      <h1 *ngIf="loadingDone$ | async; else loading">
        {{ convertTokWh((totalMeasurement$ | async) || 0).toLocaleString() }}
        kWh
      </h1>
    </watt-card>

    <ng-template #loading><watt-spinner [diameter]="36"></watt-spinner></ng-template>
  `,
})
export class EoProductionInfoComponent {
  loadingDone$ = this.store.loadingDone$;
  totalMeasurement$ = this.store.totalMeasurement$;

  constructor(private store: EoProductionStore) {}

  convertTokWh(wattHour: number): number {
    if (!wattHour || Number.isNaN(wattHour)) return 0;

    return Number((wattHour / 1000).toFixed(0));
  }
}
