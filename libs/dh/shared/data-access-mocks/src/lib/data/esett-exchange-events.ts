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
  DocumentStatus,
  ExchangeEventCalculationType,
  ExchangeEventSearchResult,
  PriceAreaCode,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const eSettExchangeEvents: ExchangeEventSearchResult[] = [
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161908',
    energySupplier: null,
    actorNumber: null,
    gridArea: {
      code: '007',
      name: 'DK1',
      displayName: '007 • DK1',
      id: '6c6d12ee',
      priceAreaCode: PriceAreaCode.Dk1,
      validFrom: new Date('2020-01-01T00:00:00.000Z'),
      __typename: 'GridAreaDto',
    },
    calculationType: ExchangeEventCalculationType.Aggregation,
    gridAreaCodeOut: null,
    documentStatus: DocumentStatus.Accepted,
    timeSeriesType: TimeSeriesType.Consumption,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161909',
    energySupplier: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier 2',
    },
    actorNumber: '222',
    gridArea: {
      code: '007',
      name: 'DK1',
      displayName: '007 • DK1',
      id: '6c6d12ee',
      priceAreaCode: PriceAreaCode.Dk1,
      validFrom: new Date('2020-01-01T00:00:00.000Z'),
      __typename: 'GridAreaDto',
    },
    calculationType: ExchangeEventCalculationType.Aggregation,
    gridAreaCodeOut: '111',
    documentStatus: DocumentStatus.Rejected,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(2023, 1, 1),
    documentId: '390161910',
    energySupplier: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier 3',
    },
    actorNumber: '333',
    gridArea: {
      code: '007',
      name: 'DK1',
      displayName: '007 • DK1',
      id: '6c6d12ee',
      priceAreaCode: PriceAreaCode.Dk1,
      validFrom: new Date('2020-01-01T00:00:00.000Z'),
      __typename: 'GridAreaDto',
    },
    calculationType: ExchangeEventCalculationType.Aggregation,
    gridAreaCodeOut: '222',
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
  {
    __typename: 'ExchangeEventSearchResult',
    created: new Date(),
    documentId: '390161911',
    energySupplier: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier 4',
    },
    actorNumber: '444',
    gridArea: {
      code: '007',
      name: 'DK1',
      displayName: '007 • DK1',
      id: '6c6d12ee',
      priceAreaCode: PriceAreaCode.Dk1,
      validFrom: new Date('2020-01-01T00:00:00.000Z'),
      __typename: 'GridAreaDto',
    },
    calculationType: ExchangeEventCalculationType.BalanceFixing,
    gridAreaCodeOut: '333',
    documentStatus: DocumentStatus.AwaitingReply,
    timeSeriesType: TimeSeriesType.Production,
  },
];
