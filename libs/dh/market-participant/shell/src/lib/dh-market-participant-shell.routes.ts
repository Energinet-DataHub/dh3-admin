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
import { Routes } from '@angular/router';

import {
  dhMarketParticipantActorsPath,
  dhMarketParticipantGridAreasPath,
} from '@energinet-datahub/dh/market-participant/routing';

export const dhMarketParticipantShellRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@energinet-datahub/dh/market-participant/actors/shell'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: dhMarketParticipantActorsPath,
      },
      {
        path: dhMarketParticipantActorsPath,
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-actors'),
        data: {
          titleTranslationKey: 'marketParticipant.actors.topBarTitle',
        },
      },
      {
        path: 'organizations',
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-organizations'),
        data: {
          titleTranslationKey: 'marketParticipant.organizationsOverview.organizations',
        },
      },
      {
        path: 'market-roles',
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-market-roles'),
        data: {
          titleTranslationKey: 'marketParticipant.marketRolesOverview.marketRoles',
        },
      },
    ],
  },
  {
    path: dhMarketParticipantGridAreasPath,
    loadComponent: () => import('@energinet-datahub/dh/market-participant/grid-areas/shell'),
    data: {
      titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
    },
  },
];
