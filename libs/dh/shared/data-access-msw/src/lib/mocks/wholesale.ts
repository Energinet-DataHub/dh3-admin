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
  WholesaleSearchBatchResponseDto,
  WholesaleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { rest } from 'msw';

export const wholesaleMocks = [postWholesaleBatch(), getWholesaleSearchBatch()];

function postWholesaleBatch() {
  return rest.post(
    'https://localhost:5001/v1/WholesaleBatch',
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  );
}

function getWholesaleSearchBatch() {
  const periodFrom = '2021-12-01T23:00:00Z';
  const periodTo = '2021-12-02T23:00:00Z';
  const executionTimeStart = '2021-12-01T23:00:00Z';
  const executionTimeEnd = '2021-12-02T23:00:00Z';

  const mockData: WholesaleSearchBatchResponseDto[] = [
    {
      batchNumber: 123,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Pending,
    },
    {
      batchNumber: 234,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Running,
    },
    {
      batchNumber: 345,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Finished,
    },
    {
      batchNumber: 567,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Failed,
    },
    {
      batchNumber: 123,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Pending,
    },
    {
      batchNumber: 234,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Running,
    },
    {
      batchNumber: 345,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Finished,
    },
    {
      batchNumber: 567,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Failed,
    },
    {
      batchNumber: 123,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Pending,
    },
    {
      batchNumber: 234,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd: null,
      status: WholesaleStatus.Running,
    },
    {
      batchNumber: 345,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Finished,
    },
    {
      batchNumber: 567,
      periodFrom,
      periodTo,
      executionTimeStart,
      executionTimeEnd,
      status: WholesaleStatus.Failed,
    }
  ];
  return rest.post(
    'https://localhost:5001/v1/WholesaleBatch/search',
    (req, res, ctx) => {
      return res(ctx.delay(300), ctx.status(200), ctx.json(mockData));
      //return res(ctx.delay(2000), ctx.status(500));
    }
  );
}