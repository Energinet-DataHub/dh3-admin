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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/landing-page/routing';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { EoPrimaryNavigationStore } from './eo-primary-navigation.store';

describe(EoPrimaryNavigationStore.name, () => {
  describe('Given Auth API accepts log out', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          EoPrimaryNavigationStore,
          MockProvider(AuthHttp, {
            postLogout: () => of({ success: true }),
          }),
          MockProvider(Router),
        ],
      });

      store = TestBed.inject(EoPrimaryNavigationStore);
    });

    let store: EoPrimaryNavigationStore;

    it(`When log out is triggered
      Then the user is redirected to the landing page`, () => {
      const router = TestBed.inject(Router);

      store.onLogOut();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        eoLandingPageRelativeUrl
      );
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });
});
