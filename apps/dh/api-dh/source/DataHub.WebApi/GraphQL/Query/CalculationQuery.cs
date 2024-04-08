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

using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL;

public partial class Query
{
    public async Task<CalculationDto> GetCalculationByIdAsync(
        Guid id,
        [Service] IWholesaleClient_V3 client) =>
        await client.GetCalculationAsync(id);

    public async Task<IEnumerable<CalculationDto>> GetCalculationsAsync(
        CalculationQueryInput input,
        [Service] IWholesaleClient_V3 client) =>
        await client.QueryCalculationsAsync(input);

    public async Task<CalculationDto> GetLatestBalanceFixingAsync(
        Interval period,
        [Service] IWholesaleClient_V3 client)
    {
        var input = new CalculationQueryInput
        {
            Period = period,
            CalculationTypes = [Clients.Wholesale.v3.CalculationType.BalanceFixing],
            ExecutionStates = [CalculationState.Completed],
        };

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.First();
    }
}
