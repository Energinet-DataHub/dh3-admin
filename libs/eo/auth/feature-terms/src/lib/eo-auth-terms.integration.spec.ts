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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  SpectacularAppComponent,
  SpectacularFeatureTestingModule,
} from '@ngworker/spectacular';
import { render } from '@testing-library/angular';

import { EoAuthFeatureTermsModule } from './eo-auth-feature-terms.module';

// @todo set this test up

describe('EnergyOrigin terms', () => {
  it('*** Enter a good description of the first test here ***', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoAuthFeatureTermsModule,
          featurePath: '', // @todo: Should this also be the "/terms" url
        }),
        HttpClientTestingModule,
      ],
    });
    await navigate('/terms');
  });
});
