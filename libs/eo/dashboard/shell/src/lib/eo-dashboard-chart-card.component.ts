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

import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EoOriginOfEnergyPieChartScam } from '@energinet-datahub/eo/origin-of-energy/shell';

@Component({
  selector: 'eo-dashboard-chart-card',
  template: ` <mat-card>
    <h3 class="watt-space-stack-s">Renewable Share</h3>
    <p class="watt-space-stack-m">Your share of renewable energy in 2021</p>
    <div class="chart-box">
      <eo-origin-of-energy-pie-chart></eo-origin-of-energy-pie-chart>
    </div>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .chart-box {
        margin: 0 var(--watt-space-m);
      }
    `,
  ],
})
export class EoDashboardChartCardComponent {}

@NgModule({
  declarations: [EoDashboardChartCardComponent],
  exports: [EoDashboardChartCardComponent],
  imports: [EoOriginOfEnergyPieChartScam, MatCardModule],
})
export class EoDashboardChartCardScam {}
