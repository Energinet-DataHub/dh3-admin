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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports;

namespace Energinet.DataHub.WebApi.GraphQL.Resolvers;

public class WholesaleResolvers
{
    public async Task<string?> GetCreatedByUserNameAsync(
        [Parent] CalculationDto batch,
        UserBatchDataLoader dataLoader) =>
        (await dataLoader.LoadAsync(batch.CreatedByUserId)).Email;

    public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
        [Parent] CalculationDto batch,
        GridAreaByCodeBatchDataLoader dataLoader)
    {
        var gridAreas = await Task.WhenAll(batch.GridAreaCodes.Select(async c => await dataLoader.LoadAsync(c)));
        return gridAreas.Where(g => g != null);
    }

    public async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] RequestSettlementReportGridAreaCalculation result,
        GridAreaByCodeBatchDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);
}
