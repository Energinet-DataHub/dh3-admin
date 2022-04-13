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
import { EoPieChartScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-origin-of-energy-shell',
  styles: [
    `
      :host {
        display: block;
        max-width: 1040px; /* Magic UX number */
      }

      .chart-row {
        display: flex;
        margin-bottom: var(--watt-space-l);
      }

      .chart-card {
        max-width: 584px; /* Magic UX number */
        width: 100%;
      }

      .chart-box {
        margin-top: var(--watt-space-m);
        margin-right: calc(var(--watt-space-xl) - var(--watt-space-s));
        margin-left: calc(var(--watt-space-xl) - var(--watt-space-s));
      }

      .chart-tips {
        width: 360px; /* Magic UX number */
        gap: var(--watt-space-l);
        display: flex;
        flex-direction: column;
      }

      .global-goals-box {
        border: 1px solid #f9d557; /* Color not yet added to Watt */
        max-height: 106px; /* Magic UX number that makes the box fit the text and margin */
      }

      .lightbulb-icon {
        width: 70px; /* Magic UX image size*/
      }

      .tip-card {
        background-color: var(--watt-color-primary-light);
        border-radius: var(--watt-space-m);
      }

      .tip-card-header {
        display: flex;
        align-items: center;
        margin-bottom: var(--watt-space-m);
        gap: calc(var(--watt-space-l) - var(--watt-space-s));
      }

      .description-row {
        display: flex;
        align-items: flex-start;
      }

      .description-card {
        gap: var(--watt-space-m);
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .ministry-logo {
        width: 440px; /* Magic UX image size*/
      }

      .coming-soon-overlay {
        background-color: rgba(196, 196, 196, 0.7);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: var(--watt-space-xs);

        &::before {
          content: 'Coming soon';
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #d12923; /* Magic UX color */
          font-weight: bold;
          font-size: 60px;
        }
      }
    `,
  ],
  template: `<div class="chart-row">
      <mat-card class="chart-card watt-space-inline-l">
        <div class="coming-soon-overlay"></div>
        <h3>Your share of renewable energy in 2021</h3>
        <p>Based on the hourly declaration</p>
        <div class="chart-box">
          <eo-pie-chart></eo-pie-chart>
        </div>
      </mat-card>

      <div class="chart-tips">
        <eo-media [eoMediaMaxWidthPixels]="360" class="global-goals-box">
          <p class="watt-space-inset-m">
            <strong>Global goals 7.2</strong><br />
            increase the share of renewable energy globally
          </p>
          <img
            eoMediaImage
            [eoMediaImageMaxWidthPixels]="106"
            src="/assets/images/origin-of-energy/globalgoal-7.2.svg"
            alt="Global goal 7.2"
          />
        </eo-media>
        <mat-card class="tip-card">
          <div class="tip-card-header">
            <img
              class="lightbulb-icon"
              src="/assets/icons/lightbulb.svg"
              alt="Global goal 7.2"
            />
            <h1>Tip</h1>
          </div>
          <p>
            You can increase your share of renewable energy by shifting your
            consumption to periods with more renewable energy in the grid.
          </p>
        </mat-card>
      </div>
    </div>
    <div class="description-row">
      <mat-card class="description-card watt-space-inline-l">
        <p><strong>Renewable energy</strong></p>
        <img
          class="ministry-logo"
          src="/assets/images/origin-of-energy/danish-ministry-of-climate-energy-and-utilities.svg"
          alt="Danish Ministry of Climate, Energy and Utilities logo"
        />
        <p>
          Renewable energy is a general term for bio-energy, onshore and
          offshore wind power, solar energy, geothermal energy as well as other
          technologies that differ from coal and other fossil fuels by being CO2
          neutral. The use of sustainable energy sources contributes to the
          reduction of our greenhouse gas emissions and making Denmark
          independent of fossil energy.
        </p>
        <p>
          Read more on the home page:<br />
          <a
            target="_blank"
            href="https://ens.dk/en/our-responsibilities/energy-climate-politics/greenhouse-gasses"
          >
            Danish Ministry of Climate, Energy and Utilities
          </a>
        </p>
      </mat-card>
      <mat-card class="description-card">
        <p><strong>Hourly Declaration</strong></p>
        <p>
          The hourly declaration describes the origin of the energy you have
          consumed within a given period as well as the corresponding emissions.
        </p>
        <p>
          The declaration is calculated as a weighted average based on your
          hourly electricity consumption and the corresponding hourly residual
          mix in your bidding zone.
        </p>
      </mat-card>
    </div>`,
})
export class EoOriginOfEnergyShellComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyShellComponent],
  exports: [EoOriginOfEnergyShellComponent],
  imports: [EoMediaModule, MatCardModule, EoPieChartScam],
})
export class EoOriginOfEnergyShellScam {}
