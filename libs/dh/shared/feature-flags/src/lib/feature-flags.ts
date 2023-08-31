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
/* eslint-disable sonarjs/no-duplicate-string */
import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

export type DhFeatureFlag = {
  created: string;
  disabledEnvironments: DhAppEnvironment[];
};

export type FeatureFlagConfig = Record<string, DhFeatureFlag>;

/**
 * Feature flag example:
 *
 * 'example-feature-flag': {
 *   created: '01-01-2022',
 *   disabledEnvironments: [DhAppEnvironment.prod],
 * },
 */

const created = '08-08-2023';

export const dhFeatureFlagsConfig = {
  start_wholesale_process_feature_flag: {
    created,
    disabledEnvironments: [],
  },
  charges_price_date_chips_feature_flag: {
    created,
    disabledEnvironments: [],
  },
  charge_prices_download_button_feature_flag: {
    created,
    disabledEnvironments: [],
  },
  create_charge_prices_page_feature_flag: {
    created,
    disabledEnvironments: [],
  },
  market_participant_actors_feature_flag: {
    created: '04-07-2023',
    disabledEnvironments: [],
  },
} satisfies FeatureFlagConfig;

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
