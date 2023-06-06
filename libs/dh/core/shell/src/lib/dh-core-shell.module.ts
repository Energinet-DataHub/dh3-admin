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
import { BrowserUtils } from '@azure/msal-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

import {
  DhConfigurationLocalizationModule,
  DhTranslocoModule,
} from '@energinet-datahub/dh/globalization/configuration-localization';
import { DhGlobalizationUiWattTranslationModule } from '@energinet-datahub/dh/globalization/ui-watt-translation';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from '@energinet-datahub/dh/auth/msal';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhGraphQLModule } from '@energinet-datahub/dh/shared/data-access-graphql';
import { dhB2CEnvironmentToken, environment } from '@energinet-datahub/dh/shared/environments';
import { dhMarketParticipantPath } from '@energinet-datahub/dh/market-participant/routing';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';
import { dhChargesPath } from '@energinet-datahub/dh/charges/routing';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { DhCoreShellComponent } from './dh-core-shell.component';
import { DhSharedUtilApplicationInsightsModule } from '@energinet-datahub/dh/shared/util-application-insights';
import { WHOLESALE_BASE_PATH } from '@energinet-datahub/dh/wholesale/routing';
import { dhAuthorizationInterceptor } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhAdminPath } from '@energinet-datahub/dh/admin/routing';

const routes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: dhMeteringPointPath,
        pathMatch: 'full',
      },
      {
        path: dhMeteringPointPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/metering-point/shell').then(
            (esModule) => esModule.dhMeteringPointShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: 'message-archive',
        loadChildren: () =>
          import('@energinet-datahub/dh/message-archive/shell').then(
            (esModule) => esModule.dhMessageArchiveShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: dhMarketParticipantPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/market-participant/shell').then(
            (esModule) => esModule.DhMarketParticipantShellModule
          ),
        canActivate: [MsalGuard],
      },
      {
        path: WHOLESALE_BASE_PATH,
        loadChildren: () =>
          import('@energinet-datahub/dh/wholesale/shell').then(
            (esModule) => esModule.WHOLESALE_SHELL
          ),
        canActivate: [MsalGuard],
      },
      {
        path: dhChargesPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/charges/shell').then(
            (esModule) => esModule.DhChargesShellModule
          ),
        canActivate: [MsalGuard],
      },
      {
        path: dhAdminPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/admin/shell').then((esModule) => esModule.routes),
        canActivate: [MsalGuard],
      },
    ],
  },
  // Used by MSAL (B2C)
  { path: 'state', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    DhApiModule.forRoot(),
    DhGraphQLModule.forRoot(),
    DhCoreShellComponent,
    DhTranslocoModule.forRoot(),
    HttpClientModule,
    MsalModule,
    DhConfigurationLocalizationModule.forRoot(),
    WattDanishDatetimeModule.forRoot(),
    environment.production ? DhSharedUtilApplicationInsightsModule.forRoot() : [],
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        BrowserUtils.isInIframe() && BrowserUtils.isInPopup() ? 'disabled' : 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
    }),
    DhGlobalizationUiWattTranslationModule.forRoot(),
  ],
  providers: [
    importProvidersFrom(MatLegacySnackBarModule),
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    // dhAuthorizationInterceptor must be registered after Msal
    dhAuthorizationInterceptor,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps: [dhB2CEnvironmentToken],
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
      deps: [dhB2CEnvironmentToken],
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
      deps: [dhB2CEnvironmentToken],
    },
  ],
})
export class DhCoreShellModule {}
