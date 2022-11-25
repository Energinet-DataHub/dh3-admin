﻿// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.Collections.Generic;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.Dto;
using Energinet.DataHub.Wholesale.Contracts;

namespace Energinet.DataHub.WebApi.Controllers
{
    public class BatchDtoMapper : IBatchDtoMapper
    {
        public BatchDto Map(BatchDtoV2 batchDtoV2, List<GridAreaDto> gridAreas)
        {
            return new BatchDto(
                batchDtoV2.BatchNumber,
                batchDtoV2.PeriodStart,
                batchDtoV2.PeriodEnd,
                batchDtoV2.ExecutionTimeStart,
                batchDtoV2.ExecutionTimeEnd,
                batchDtoV2.ExecutionState,
                batchDtoV2.IsBasisDataDownloadAvailable,
                gridAreas.ToArray());
        }
    }
}
