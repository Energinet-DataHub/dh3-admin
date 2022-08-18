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
import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { MockProvider } from 'ng-mocks';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { DhApplicationInsights } from '@energinet-datahub/dh/shared/data-access-logging';
import {
  DhSharedConfigurationApplicationInsightsModule,
  DhSharedConfigurationApplicationInsightsRootModule,
} from './dh-shared-configuration-application-insights.module';

describe(DhSharedConfigurationApplicationInsightsModule.name, () => {
  it('Application Insights is not initialized when the Angular module is not imported', () => {
    const appInitializerToken = TestBed.inject(APP_INITIALIZER, null);

    expect(appInitializerToken).toBeNull();
  });

  it(`initializes Application Insights during APP_INITIALIZER`, () => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [DhSharedConfigurationApplicationInsightsModule.forRoot()],
      providers: [
        MockProvider(DhApplicationInsights, {
          init: jest.fn(),
        }),
      ],
    });

    // Act
    const applicationInsights = TestBed.inject(DhApplicationInsights);

    // Assert
    expect(applicationInsights.init).toHaveBeenCalled();
  });

  it('guards against direct import', () => {
    expect(
      DhSharedConfigurationApplicationInsightsModule
    ).toGuardAgainstDirectImport();
  });

  it(`provides ${ApplicationinsightsAngularpluginErrorService.name}`, () => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [DhSharedConfigurationApplicationInsightsModule.forRoot()],
    });

    // Act
    const errorHandler = TestBed.inject(ErrorHandler);

    // Assert
    expect(errorHandler).toBeInstanceOf(
      ApplicationinsightsAngularpluginErrorService
    );
  });
});

describe(DhSharedConfigurationApplicationInsightsRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    expect(
      DhSharedConfigurationApplicationInsightsRootModule
    ).toGuardAgainstMultipleInjectorRegistration();
  });
});
