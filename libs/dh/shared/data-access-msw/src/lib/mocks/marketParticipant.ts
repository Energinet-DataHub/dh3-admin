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
import { rest } from 'msw';

import organizationData from './data/marketParticipant.json';
import gridAreaData from './data/marketParticipantGridArea.json';
import gridAreaOverviewData from './data/marketParticipantGridAreaOverview.json';

export const marketParticipantMocks = [
  getOrganizations(),
  getMarketParticipantGridArea(),
  getMarketParticipantGridAreaOverview(),
];

function getOrganizations() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization',
    (req, res, ctx) => {
      return res(ctx.json(organizationData));
    }
  );
}

function getMarketParticipantGridArea() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipantGridArea',
    (req, res, ctx) => {
      return res(ctx.json(gridAreaData));
    }
  );
}

function getMarketParticipantGridAreaOverview() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipantGridAreaOverview',
    (req, res, ctx) => {
      return res(ctx.json(gridAreaOverviewData));
    }
  );
}
