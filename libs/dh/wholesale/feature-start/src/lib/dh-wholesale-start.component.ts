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
import { TranslocoModule } from '@ngneat/transloco';
import { WattButtonModule } from '@energinet-datahub/watt';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from "@energinet-datahub/dh/shared/feature-flags"

@Component({
  selector: 'dh-wholesale-start',
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleStartComponent {
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  createBatch() {
    this.store.createBatch(['805', '806']);
  }
}

@NgModule({
  imports: [WattButtonModule, TranslocoModule, DhFeatureFlagDirectiveModule],
  declarations: [DhWholesaleStartComponent],
})
export class DhWholesaleStartScam {}
