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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.Shared.BRS_026_028;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;
using EdiCalculationType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.CalculationType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests;

public static class RequestOperations
{
    [Query]
    [UsePaging]
    [UseSorting]
    // TODO: This query should be authorized
    public static Task<IEnumerable<IActorRequestQueryResult>> GetRequestsAsync(
        IRequestsClient client) => client.GetRequestsAsync();

    [Query]
    public static async Task<RequestOptions> GetRequestOptionsAsync(
        IHttpContextAccessor httpContextAccessor,
        IMarketParticipantClient_V1 marketParticipantClient)
    {
        // TODO: Create common functionality for this use case
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        var selectedActor = await marketParticipantClient.ActorGetAsync(associatedActor);
        return new RequestOptions(user, selectedActor.MarketRole.EicFunction);
    }

    [OneOf]
    public record RequestInput(
        RequestCalculatedEnergyTimeSeriesInput? RequestCalculatedEnergyTimeSeries,
        RequestCalculatedWholesaleServicesInput? RequestCalculatedWholesaleServices);

    [Mutation]
    // TODO: Remember to authorize this when implementing ProcessManager
    public static async Task<bool> RequestAsync(
        RequestInput input,
        [Service] Energinet.DataHub.Edi.B2CWebApp.Clients.v1.IEdiB2CWebAppClient_V1 client,
        IMarketParticipantClient_V1 marketParticipantClient,
        IHttpContextAccessor httpContextAccessor,
        CancellationToken ct)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var associatedActor = user?.GetAssociatedActor()
            ?? throw new InvalidOperationException("No associated actor found.");

        var selectedActor = await marketParticipantClient.ActorGetAsync(associatedActor);
        var eicFunction = selectedActor.MarketRole.EicFunction;
        var actorNumber = selectedActor.ActorNumber.Value;

        var toEdiCalculationType = (WholesaleAndEnergyCalculationType calculationType) => calculationType switch
        {
            WholesaleAndEnergyCalculationType.Aggregation => EdiCalculationType.PreliminaryAggregation,
            WholesaleAndEnergyCalculationType.BalanceFixing => EdiCalculationType.BalanceFixing,
            WholesaleAndEnergyCalculationType.WholesaleFixing => EdiCalculationType.WholesaleFixing,
            WholesaleAndEnergyCalculationType.FirstCorrectionSettlement => EdiCalculationType.FirstCorrection,
            WholesaleAndEnergyCalculationType.SecondCorrectionSettlement => EdiCalculationType.SecondCorrection,
            WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement => EdiCalculationType.ThirdCorrection,
        };

        if (input.RequestCalculatedEnergyTimeSeries is not null)
        {
            await client.RequestAggregatedMeasureDataAsync(
                "1.0",
                new Edi.B2CWebApp.Clients.v1.RequestAggregatedMeasureDataMarketRequest()
                {
                    CalculationType = toEdiCalculationType(input.RequestCalculatedEnergyTimeSeries.CalculationType),
                    GridArea = input.RequestCalculatedEnergyTimeSeries.GridArea,
                    StartDate = input.RequestCalculatedEnergyTimeSeries.Period.Start.ToString(),
                    EndDate = input.RequestCalculatedEnergyTimeSeries.Period.End.ToString(),
                    MeteringPointType = input.RequestCalculatedEnergyTimeSeries.MeteringPointType,
                    BalanceResponsibleId = eicFunction == EicFunction.BalanceResponsibleParty ? actorNumber : null,
                    EnergySupplierId = eicFunction == EicFunction.EnergySupplier ? actorNumber : null,
                });

            return true;
        }

        if (input.RequestCalculatedWholesaleServices is not null)
        {
            await client.RequestWholesaleSettlementAsync(
                "1.0",
                new Edi.B2CWebApp.Clients.v1.RequestWholesaleSettlementMarketRequest()
                {
                    CalculationType = toEdiCalculationType(input.RequestCalculatedWholesaleServices.CalculationType),
                    GridArea = input.RequestCalculatedWholesaleServices.GridArea,
                    StartDate = input.RequestCalculatedWholesaleServices.Period.Start.ToString(),
                    EndDate = input.RequestCalculatedWholesaleServices.Period.End.ToString(),
                    PriceType = input.RequestCalculatedWholesaleServices.PriceType,
                    EnergySupplierId = eicFunction == EicFunction.EnergySupplier ? actorNumber : null,
                });

            return true;
        }

        return false;
    }
}
