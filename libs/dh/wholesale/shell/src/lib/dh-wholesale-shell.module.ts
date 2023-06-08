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
import { Route } from '@angular/router';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

import {
  WHOLESALE_START_PROCESS_PATH,
  WHOLESALE_SEARCH_BATCH_PATH,
  WHOLESALE_CALCULATION_STEPS_PATH,
  WHOLESALE_SETTLEMENT_REPORTS_PATH,
} from '@energinet-datahub/dh/wholesale/routing';
import { inject } from '@angular/core';

const settlementsGuard = 'settlements:manage';

export const dhWholesaleShellRoutes: Route[] = [
  {
    path: WHOLESALE_START_PROCESS_PATH,
    canActivate: [PermissionGuard([settlementsGuard])],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-start').then(
        (m) => m.DhWholesaleStartComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.startBatch.topBarTitle',
    },
  },
  {
    path: WHOLESALE_SEARCH_BATCH_PATH,
    canActivate: [PermissionGuard([settlementsGuard])],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-search').then(
        (m) => m.DhWholesaleSearchComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.searchBatch.topBarTitle',
    },
  },
  {
    path: WHOLESALE_SETTLEMENT_REPORTS_PATH,
    canActivate: [PermissionGuard([settlementsGuard])],
    canMatch: [
      () => {
        const featureFlagsService = inject(DhFeatureFlagsService);
        return featureFlagsService.isEnabled('tab_layout_on_settlement_page_feature_flag');
      },
    ],
    loadComponent: () => {
      return import('@energinet-datahub/dh/wholesale/feature-settlement-reports').then(
        (m) => m.DhWholesaleSettlementsReportsTabComponent
      );
    },
    data: {
      titleTranslationKey: 'wholesale.settlementReports.topBarTitle',
    },
  },
  {
    path: WHOLESALE_SETTLEMENT_REPORTS_PATH,
    canActivate: [PermissionGuard([settlementsGuard])],
    loadComponent: () => {
      return import('@energinet-datahub/dh/wholesale/feature-settlement-reports').then(
        (m) => m.DhWholesaleSettlementReportsComponent
      );
    },
    data: {
      titleTranslationKey: 'wholesale.settlementReports.topBarTitle',
    },
  },
  {
    path: `${WHOLESALE_CALCULATION_STEPS_PATH}/:batchId/:gridAreaCode`,
    data: { titleTranslationKey: 'wholesale.calculationSteps.topBarTitle' },
    canActivate: [PermissionGuard([settlementsGuard])],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-calculation-steps').then(
        (m) => m.DhWholesaleCalculationStepsComponent
      ),
    loadChildren: () =>
      import('@energinet-datahub/dh/wholesale/feature-calculation-steps').then(
        (m) => m.DhWholesaleCalculationStepsRoutes
      ),
  },
];
