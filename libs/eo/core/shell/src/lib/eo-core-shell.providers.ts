//#region License
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
//#endregion
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';

import { translocoProviders } from '@energinet-datahub/eo/globalization/configuration-localization';
import { eoApiVersioningInterceptorProvider } from '@energinet-datahub/eo/core/api-versioning';

import {
  eoAuthorizationInterceptorProvider,
  eoOrganizationIdInterceptorProvider,
} from '@energinet-datahub/eo/auth/data-access';

import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { eoLanguageServiceInitializer } from '@energinet-datahub/eo/globalization/feature-language-switcher';
import { eoWattTranslationsProviders } from '@energinet-datahub/eo/globalization/configuration-watt-translation';

import { PageTitleStrategy } from './title-strategy.service';

export const eoCoreShellProviders = [
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
  importProvidersFrom(MatDialogModule, MatSnackBarModule),
  eoAuthorizationInterceptorProvider,
  eoOrganizationIdInterceptorProvider,
  eoApiVersioningInterceptorProvider,
  WattModalService,
  ...translocoProviders,
  eoLanguageServiceInitializer,
  eoWattTranslationsProviders,
  {
    provide: TitleStrategy,
    useClass: PageTitleStrategy,
  },
];
