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
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDescriptionListComponent } from '@energinet-datahub/watt/description-list';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { mapMetaData } from './meta-data';

@Component({
  standalone: true,
  selector: 'dh-wholesale-consumption-per-energy-supplier',
  templateUrl: './consumption-per-energy-supplier.component.html',
  styleUrls: ['./consumption-per-energy-supplier.component.scss'],
  imports: [
    CommonModule,
    DhWholesaleTimeSeriesPointsComponent,
    LetModule,
    TranslocoModule,
    WattBadgeComponent,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattDescriptionListComponent,
    PushModule,
  ],
})
export class DhWholesaleConsumptionPerEnergySupplierComponent {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  processStepResults$ = this.store.processStepResults$;
  metaData$ = mapMetaData(
    this.transloco.selectTranslation(),
    this.store.processStepResults$,
    this.store.selectedBatch$
  );

  loadingProcessStepResultsErrorTrigger$ =
    this.store.loadingProcessStepResultsErrorTrigger$;

  gln: () => string = () => this.route.snapshot.params['gln'];
}
