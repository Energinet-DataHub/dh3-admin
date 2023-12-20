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

import { marketParticipantUserActors } from './data/marketParticipantUserActors';

export function marketParticipantUserMocks(apiBase: string) {
  return [getActors(apiBase), postInitiateMitIdSignup(apiBase)];
}

function getActors(apiBase: string) {
  return rest.get(`${apiBase}/v1/MarketParticipantUser/GetUserActors`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(marketParticipantUserActors));
  });
}

function postInitiateMitIdSignup(apiBase: string) {
  return rest.post(`${apiBase}/v1/MarketParticipantUser/InitiateMitIdSignup`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200));
  });
}
