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
export const dhFeatureFlagsConfig = {
  'market-participant-delegation': {
    created: '22-04-2024',
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'market-participant-balance-responsible-relations': {
    created: '22-04-2024',
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'calculations-include-all-grid-areas': {
    created: '21-03-2024',
    disabledEnvironments: [DhAppEnvironment.test_001],
  },
  'new-login-flow': {
    created: '21-03-2024',
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'settlement-reports-v2': {
    created: '30-04-2024',
    disabledEnvironments: [
      DhAppEnvironment.dev_001,
      DhAppEnvironment.dev_002,
      DhAppEnvironment.test_001,
      DhAppEnvironment.test_002,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
  // This feature flag should be removed in favor of injected environment variables
  // from terraform, whenever the new web application setup is ready (outlaws).
  'quarterly-resolution-transition-datetime-override': {
    created: '06-05-2024',
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
} satisfies FeatureFlagConfig;

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
