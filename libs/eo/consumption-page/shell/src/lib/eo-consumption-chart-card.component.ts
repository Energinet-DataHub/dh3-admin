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

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { EoLineChartScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoConsumptionStore } from './eo-consumption.store';

@Component({
  selector: 'eo-consumption-line-chart',
  template: ` <mat-card class="chart-card watt-space-inline-l">
    <h3 class="watt-space-stack-s">kWh</h3>
    <ng-container>
      <div *ngIf="(loadingDone$ | async) === false" class="loadingObfuscator">
        <watt-spinner [diameter]="100"></watt-spinner>
      </div>
      <eo-line-chart [data]="(measurements$ | async) || []"></eo-line-chart>
    </ng-container>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .chart-card {
        width: 375px; /* Magic UX number */
      }

      .loadingObfuscator {
        position: absolute;
        height: calc(100% - 64px);
        width: calc(100% - 32px);
        background-color: var(--watt-on-dark-high-emphasis);
        padding-top: 32px;
        padding-left: 120px;
      }
    `,
  ],
})
export class EoConsumptionLineChartComponent {
  loadingDone$ = this.store.loadingDone$;
  measurements$ = this.store.measurements$;

  constructor(private store: EoConsumptionStore) {}
}

@NgModule({
  providers: [EoConsumptionStore],
  declarations: [EoConsumptionLineChartComponent],
  exports: [EoConsumptionLineChartComponent],
  imports: [MatCardModule, EoLineChartScam, CommonModule, WattSpinnerModule],
})
export class EoConsumptionLineChartScam {}
