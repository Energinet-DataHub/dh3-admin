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
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

import { setUpAngularTestingLibrary, setUpTestbed } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
import { mocks } from '@energinet-datahub/dh/shared/data-access-mocks';

setupZoneTestEnv();
setupMSWServer(dhLocalApiEnvironment.apiBase, mocks);
addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
