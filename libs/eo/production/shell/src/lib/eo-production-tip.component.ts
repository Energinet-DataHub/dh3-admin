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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WATT_CARD],
  selector: 'eo-production-tip',
  styles: [
    `
      :host {
        display: block;
      }
      watt-card {
        background: var(--watt-color-primary-light);
        border-radius: var(--watt-space-m);

        .tip {
          display: flex;
          align-items: center;
          color: var(--watt-typography-headline-color);
          img {
            width: 70px; // Magic number by designer
            height: 66px; // Magic number by designer
            margin-right: 25px; // Magic number by designer
          }
        }
      }
    `,
  ],
  template: `
    <watt-card>
      <div class="tip watt-space-stack-m">
        <img alt="Decrease production | EnergyOrigin" src="/assets/icons/lightbulb.svg" />
        <h1>Tip</h1>
      </div>
      <p>
        You can increase your production by investing in more green technology, like solar power,
        wind mills, etc.
      </p>
    </watt-card>
  `,
})
export class EoProductionTipComponent {}
