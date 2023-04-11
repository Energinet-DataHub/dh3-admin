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
import { WattEmptyStateComponent } from '../empty-state.component';
import { WattButtonModule } from '@energinet-datahub-types/watt/button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-empty-state-overview',
  templateUrl: './storybook-empty-state-overview.component.html',
  styleUrls: ['./storybook-empty-state-overview.component.scss'],
  standalone: true,
  imports: [
    WattEmptyStateComponent,
    WattButtonModule
  ]
})
export class StorybookEmptyStateOverviewComponent {}
