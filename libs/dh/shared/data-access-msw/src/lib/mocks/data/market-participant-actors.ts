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
import {
  Actor,
  ActorStatus,
  EicFunction,
  GridArea,
  Organization,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const marketParticipantActors: Actor[] = [
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c16-08da5f28ddb1',
    glnOrEicNumber: '5790000555555',
    name: 'Test Actor 1',
    gridAreas: [
      {
        code: 'DK1',
      } as GridArea,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Active,
    organization: {
      name: 'Test Organization 1',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
    glnOrEicNumber: '5790000555465',
    name: 'Test Actor 2',
    gridAreas: [
      {
        code: 'DK1',
      } as GridArea,
    ],
    marketRole: EicFunction.BalanceResponsibleParty,
    status: ActorStatus.Inactive,
    organization: {
      name: 'Test Organization 2',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c18-08da5f28ddb1',
    glnOrEicNumber: '5790000555444',
    name: 'Test Actor 3',
    gridAreas: [
      {
        code: 'DK2',
      } as GridArea,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Inactive,
    organization: {
      name: 'Test Organization 2',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c19-08da5f28ddb1',
    glnOrEicNumber: '5790000555123',
    name: 'Test Actor 4',
    gridAreas: [
      {
        code: 'DK2',
      } as GridArea,
    ],
    marketRole: EicFunction.DanishEnergyAgency,
    status: ActorStatus.Active,
    organization: {
      name: 'Test Organization 3',
    } as Organization,
  },
  {
    __typename: 'Actor',
    id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
    glnOrEicNumber: '5790000555333',
    name: 'Test Actor 4',
    gridAreas: [
      {
        code: 'DK2',
      } as GridArea,
    ],
    marketRole: null,
    status: null,
    organization: undefined,
  },
];
