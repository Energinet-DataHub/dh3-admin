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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import {
  MsalInterceptor,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

import { translocoProviders } from '@energinet-datahub/dh/globalization/configuration-localization';
import { DhGlobalizationUiWattTranslationModule } from '@energinet-datahub/dh/globalization/ui-watt-translation';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from '@energinet-datahub/dh/auth/msal';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';
import { dhB2CEnvironmentToken, environment } from '@energinet-datahub/dh/shared/environments';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { DhSharedUtilApplicationInsightsModule } from '@energinet-datahub/dh/shared/util-application-insights';
import { dhAuthorizationInterceptor } from '@energinet-datahub/dh/shared/feature-authorization';

export const dhCoreShellProviders = [
  importProvidersFrom([
    MatLegacySnackBarModule,
    DhApiModule.forRoot(),
    MsalModule,
    WattDanishDatetimeModule.forRoot(),
    environment.production ? DhSharedUtilApplicationInsightsModule.forRoot() : [],
    DhGlobalizationUiWattTranslationModule.forRoot(),
  ]),
  translocoProviders,
  graphQLProviders,
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
];
