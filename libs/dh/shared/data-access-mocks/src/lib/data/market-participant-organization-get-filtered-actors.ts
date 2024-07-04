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
import { MarketParticipantFilteredActorDto } from '@energinet-datahub/dh/shared/domain';

export const marketParticipantOrganizationGetFilteredActors: MarketParticipantFilteredActorDto[] = [
  {
    actorId: '00000000-0000-0000-0000-000000000001',
    actorNumber: {
      value: '5790001330583',
    },
    name: {
      value: 'Energinet DataHub A/S',
    },
    marketRoles: ['DataHubAdministrator'],
    gridAreaCodes: [],
  },
  {
    actorId: '00000000-0000-0000-0000-000000000002',
    actorNumber: {
      value: '5790001330584',
    },
    name: {
      value: 'Sort Strøm A/S',
    },
    marketRoles: ['EnergySupplier'],
    gridAreaCodes: [],
  },
];
