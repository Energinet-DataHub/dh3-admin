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

import { Component } from '@angular/core';
import { EoEmissionsDataComponent } from '@energinet-datahub/eo/emissions/shell';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  standalone: true,
  imports: [WATT_CARD, EoEmissionsDataComponent],
  selector: 'eo-dashboard-emissions-card',
  template: ` <watt-card>
    <h3 class="watt-space-stack-s">Emissions</h3>
    <p class="watt-space-stack-s">Your emissions in 2021</p>
    <eo-emissions-data></eo-emissions-data>
  </watt-card>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class EoDashboardEmissionsCardComponent {}
