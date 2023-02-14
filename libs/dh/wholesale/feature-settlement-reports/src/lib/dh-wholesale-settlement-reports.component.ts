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
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { of } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

import { BatchSearchDto } from '@energinet-datahub/dh/shared/domain';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';

@Component({
  selector: 'dh-wholesale-settlement-reports',
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    LetModule,
    PushModule,
    TranslocoModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattTopBarComponent,
  ],
  templateUrl: './dh-wholesale-settlement-reports.component.html',
  styleUrls: ['./dh-wholesale-settlement-reports.component.scss'],
})
export class DhWholesaleSettlementReportsComponent {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private changeDetectorRef = inject(ChangeDetectorRef);

  data$ = this.store.batches$;
  loadingBatchesTrigger$ = this.store.loadingBatches$;
  loadingBatchesErrorTrigger$ = this.store.loadingBatchesErrorTrigger$;

  searchSubmitted = false;

  onSearch(search: BatchSearchDto) {
    this.searchSubmitted = true;
    this.store.getBatches(of(search));
    this.changeDetectorRef.detectChanges();
  }
}
