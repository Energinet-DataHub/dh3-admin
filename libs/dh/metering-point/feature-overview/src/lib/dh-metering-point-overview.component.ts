/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { LocalRouterStore } from '@ngworker/router-component-store';
import { DhDataAccessMeteringPointStore } from '@energinet-datahub/dh/metering-point/data-access-metering-point';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  viewProviders: [LocalRouterStore, DhDataAccessMeteringPointStore],
})
export class DhMeteringPointOverviewComponent {
  meteringPoint$ = this.store.meteringPoint$;

  constructor(private store: DhDataAccessMeteringPointStore) {}
}
