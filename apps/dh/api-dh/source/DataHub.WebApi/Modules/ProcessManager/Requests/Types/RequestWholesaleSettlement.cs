// Copyright 2020 Energinet DataHub A/S
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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;
using NodaTime;
using PriceType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.PriceType;
using RequestWholesaleSettlementMarketRequest = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.RequestWholesaleSettlementMarketRequest;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public record RequestWholesaleSettlement(
    CalculationType CalculationType,
    Interval Period,
    string? GridArea,
    string? EnergySupplierId,
    PriceType? PriceType) : IRequest
{
    public string MeteringPointTypeOrPriceTypeSortProperty
        => PriceType?.ToString() ?? string.Empty;

    public RequestWholesaleSettlementMarketRequest ToMarketRequest()
        => new()
        {
            CalculationType = CalculationType.ToEdiCalculationType(),
            StartDate = Period.Start.ToString(),
            EndDate = Period.End.ToString(),
            GridArea = GridArea,
            EnergySupplierId = EnergySupplierId,
            PriceType = PriceType,
        };
}
