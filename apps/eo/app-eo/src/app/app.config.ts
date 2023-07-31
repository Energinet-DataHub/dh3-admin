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
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { eoCoreShellProviders, eoShellRoutes } from '@energinet-datahub/eo/core/shell';
import { provideRouter } from '@angular/router';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    ...eoCoreShellProviders,
    provideRouter(eoShellRoutes),
    // this api is first available in Angular 16
    // provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
};
