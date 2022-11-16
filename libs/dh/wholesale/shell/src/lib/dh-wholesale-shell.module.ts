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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DhWholesaleStartComponent,
  DhWholesaleStartScam,
} from '@energinet-datahub/dh/wholesale/feature-start';

import { DhWholesaleSearchComponent } from '@energinet-datahub/dh/wholesale/feature-search';

import {
  DhWholesaleOverviewComponent,
  DhWholesaleOverviewScam,
} from '@energinet-datahub/dh/wholesale/feature-overview';

import {
  WHOLESALE_CALCULATION_STEPS_PATH,
  WHOLESALE_CALCULATION_STEPS_BATCH_PARAM,
  WHOLESALE_CALCULATION_STEPS_GRID_AREA_PARAM,
  DhWholesaleCalculationStepsComponent,
} from '@energinet-datahub/dh/wholesale/feature-calculation-steps';

const routes: Routes = [
  {
    path: 'start-process',
    component: DhWholesaleStartComponent,
    data: {
      titleTranslationKey: 'wholesale.startBatch.topBarTitle',
    },
  },
  {
    path: 'search-batch',
    component: DhWholesaleSearchComponent,
    data: {
      titleTranslationKey: 'wholesale.searchBatch.topBarTitle',
    },
  },
  {
    path: `${WHOLESALE_CALCULATION_STEPS_PATH}/:${WHOLESALE_CALCULATION_STEPS_BATCH_PARAM}/:${WHOLESALE_CALCULATION_STEPS_GRID_AREA_PARAM}`,
    component: DhWholesaleCalculationStepsComponent,
    data: {
      titleTranslationKey: 'wholesale.calculationSteps.topBarTitle',
    },
  },
  {
    path: 'overview',
    component: DhWholesaleOverviewComponent,
  },
];
@NgModule({
  imports: [
    DhWholesaleStartScam,
    DhWholesaleOverviewScam,
    RouterModule.forChild(routes),
  ],
})
export class DhWholesaleShellModule {}
