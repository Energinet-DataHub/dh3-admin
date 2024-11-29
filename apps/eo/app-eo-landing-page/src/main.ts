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
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import {
  environment,
  eoApiEnvironmentToken,
  eoB2cEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { loadEoApiEnvironment } from './configuration/load-eo-api-environment';
import { loadEoB2cEnvironment } from './configuration/load-eo-b2c-environment';

if (environment.production) {
  enableProdMode();
}

Promise.all([loadEoApiEnvironment(), loadEoB2cEnvironment()])
  .then(([eoApiEnvironment, eoB2cEnvironment]) =>
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
        { provide: eoB2cEnvironmentToken, useValue: eoB2cEnvironment },
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
