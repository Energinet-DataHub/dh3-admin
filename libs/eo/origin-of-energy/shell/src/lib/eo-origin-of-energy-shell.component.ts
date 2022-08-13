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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoOriginOfEnergyChartCardScam } from './eo-origin-of-energy-chart-card.component';
import { EoOriginOfEnergyChartTipsScam } from './eo-origin-of-energy-chart-tips.component';
import { EoOriginOfEnergyGlobalGoalsMediaScam } from './eo-origin-of-energy-global-goals-media.component';
import { EoOriginOfEnergyHourlyDeclarationScam } from './eo-origin-of-energy-hourly-declaration.component';
import { EoOriginOfEnergyRenewableEnergyScam } from './eo-origin-of-energy-renewable-energy.component';
import { EoOriginOfEnergyWhatIsItScam } from './eo-origin-of-energy-what-is-it.component';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-origin-of-energy-shell',
  styles: [
    `
      :host {
        display: block;
        max-width: 1036px; /* Magic UX number */
      }

      .chart-row {
        display: grid;
        margin-bottom: var(--watt-space-l);
        grid-template-columns: 1fr 1fr;
        gap: var(--watt-space-l);
      }

      .description-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--watt-space-l);
      }
    `,
  ],
  template: `<div class="chart-row">
      <eo-origin-of-energy-chart-card></eo-origin-of-energy-chart-card>
      <div>
        <eo-origin-of-energy-global-goals-media
          class="watt-space-stack-l"
        ></eo-origin-of-energy-global-goals-media>
        <eo-origin-of-energy-chart-tips></eo-origin-of-energy-chart-tips>
      </div>
    </div>
    <div class="description-row">
      <eo-origin-of-energy-renewable-energy></eo-origin-of-energy-renewable-energy>
      <div>
        <eo-origin-of-energy-what-is-it
          class="watt-space-stack-l"
        ></eo-origin-of-energy-what-is-it>
        <eo-origin-of-energy-hourly-declaration></eo-origin-of-energy-hourly-declaration>
      </div>
    </div>`,
})
export class EoOriginOfEnergyShellComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyShellComponent],
  imports: [
    EoMediaModule,
    MatCardModule,
    EoOriginOfEnergyWhatIsItScam,
    EoOriginOfEnergyChartCardScam,
    EoOriginOfEnergyGlobalGoalsMediaScam,
    EoOriginOfEnergyChartTipsScam,
    EoOriginOfEnergyRenewableEnergyScam,
    EoOriginOfEnergyHourlyDeclarationScam,
  ],
})
export class EoOriginOfEnergyShellScam {}
