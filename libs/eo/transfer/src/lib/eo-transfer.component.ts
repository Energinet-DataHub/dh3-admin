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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfer',
  imports: [MatCardModule],
  standalone: true,
  styles: [],
  template: `<mat-card class="watt-space-stack-l">
    <h3 class="watt-space-stack-m">About</h3>
    <p class="watt-space-stack-m">
      This page gives you an overview of all your GGO transfer agreements.
    </p>
    <p class="watt-space-stack-m">
      Each agreement is automatically processed when you receive new GGOs.
    </p>
    <p class="watt-space-stack-m">
      Each transfer agreement has an amount. This is the maximum amount of Wh, that will be
      transferrer per hour.
    </p>
  </mat-card>`,
})
export class EoTransferComponent {}
