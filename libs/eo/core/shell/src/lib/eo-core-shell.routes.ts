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
import { EoScopeGuard } from '@energinet-datahub/eo/auth/routing-security';
import {
  eoCertificatesRoutePath,
  eoConsumptionPageRoutePath,
  eoDashboardRoutePath,
  eoEmissionsRoutePath,
  eoHelpRoutePath,
  eoMeteringPointsRoutePath,
  eoOriginOfEnergyRoutePath,
  eoPrivacyPolicyRoutePath,
  eoProductionRoutePath,
  eoTransferRoutePath,
} from '@energinet-datahub/eo/shared/utilities';
import { EoLoginComponent } from './eo-login.component';
import { EoShellComponent } from './eo-shell.component';

export const eoShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@energinet-datahub/eo/landing-page/shell').then(
        (esModule) => esModule.EoLandingPageShellModule
      ),
  },
  { path: 'login', component: EoLoginComponent },
  {
    path: 'terms',
    data: { title: 'Terms' },
    loadChildren: () =>
      import('@energinet-datahub/eo/terms').then((esModule) => esModule.EoTermsModule),
  },
  {
    path: '',
    component: EoShellComponent,
    canActivate: [EoScopeGuard],
    children: [
      {
        path: eoCertificatesRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/eo/certificates').then(
            (esModule) => esModule.EoCertificatesModule
          ),
      },
      {
        path: eoDashboardRoutePath,
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('@energinet-datahub/eo/dashboard/shell').then(
            (esModule) => esModule.EoDashboardShellModule
          ),
      },
      {
        path: eoOriginOfEnergyRoutePath,
        data: { title: 'Renewable Share' },
        loadChildren: () =>
          import('@energinet-datahub/eo/origin-of-energy/shell').then(
            (esModule) => esModule.EoOriginOfEnergyShellModule
          ),
      },
      {
        path: eoConsumptionPageRoutePath,
        data: { title: 'Consumption' },
        loadChildren: () =>
          import('@energinet-datahub/eo/consumption-page/shell').then(
            (esModule) => esModule.EoConsumptionPageShellModule
          ),
      },
      {
        path: eoProductionRoutePath,
        data: { title: 'Production' },
        loadChildren: () =>
          import('@energinet-datahub/eo/production/shell').then(
            (esModule) => esModule.EoProductionShellModule
          ),
      },
      {
        path: eoMeteringPointsRoutePath,
        data: { title: 'Metering points' },
        loadChildren: () =>
          import('@energinet-datahub/eo/metering-points/shell').then(
            (esModule) => esModule.EoMeteringPointsShellModule
          ),
      },
      {
        path: eoEmissionsRoutePath,
        data: { title: 'Emissions' },
        loadChildren: () =>
          import('@energinet-datahub/eo/emissions/shell').then(
            (esModule) => esModule.EoEmissionsPageShellModule
          ),
      },
      {
        path: eoTransferRoutePath,
        data: { title: 'Transfers' },
        loadChildren: () =>
          import('@energinet-datahub/eo/transfers').then((esModule) => esModule.EoTransfersModule),
      },
      {
        path: eoHelpRoutePath,
        loadChildren: () =>
          import('@energinet-datahub/eo/help/shell').then((esModule) => esModule.EoHelpModule),
      },
      {
        path: eoPrivacyPolicyRoutePath,
        data: { title: 'Privacy Policy' },
        loadChildren: () =>
          import('@energinet-datahub/eo/privacy-policy/shell').then(
            (esModule) => esModule.EoPrivacyPolicyShellModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
