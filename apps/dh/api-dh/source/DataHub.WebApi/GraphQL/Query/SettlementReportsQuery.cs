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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports;
using NodaTime;
using NodaTime.Extensions;
using CalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;
using SettlementReport = Energinet.DataHub.WebApi.GraphQL.Types.SettlementReports.SettlementReport;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<SettlementReport>> GetSettlementReportsAsync(
        [Service] IMarketParticipantClient_V1 marketParticipantClient,
        [Service] ISettlementReportsClient settlementReportsClient)
    {
        var settlementReports = new List<SettlementReport>();

        foreach (var report in await settlementReportsClient.GetAsync(default))
        {
            var actor = await marketParticipantClient.ActorGetAsync(report.RequestedByActorId);

            var settlementReportStatusType = report.Status switch
            {
                SettlementReportStatus.InProgress => SettlementReportStatusType.InProgress,
                SettlementReportStatus.Completed => SettlementReportStatusType.Completed,
                SettlementReportStatus.Failed => SettlementReportStatusType.Error,
                _ => SettlementReportStatusType.Error,
            };

            settlementReports.Add(new SettlementReport(
                report.RequestId.Id,
                actor,
                report.CalculationType,
                new Interval(report.PeriodStart.ToInstant(), report.PeriodEnd.ToInstant()),
                report.GridAreaCount,
                report.ContainsBasisData,
                string.Empty,
                report.Progress,
                settlementReportStatusType));
        }

        return settlementReports.OrderByDescending(x => x.Period.Start);
    }

    public async Task<Dictionary<string, List<RequestSettlementReportGridAreaCalculation>>> GetSettlementReportGridAreaCalculationsForPeriodAsync(
        CalculationType calculationType,
        string[] gridAreaId,
        Interval calculationPeriod,
        [Service] IWholesaleClient_V3 client)
    {
        var gridAreaCalculations = new Dictionary<string, List<RequestSettlementReportGridAreaCalculation>>();
        var calculations = await client.GetApplicableCalculationsAsync(
            calculationType,
            gridAreaId,
            calculationPeriod.Start.ToDateTimeOffset(),
            calculationPeriod.End.ToDateTimeOffset());

        foreach (var calculation in calculations)
        {
            if (!gridAreaCalculations.TryGetValue(calculation.GridAreaCode, out var list))
            {
                gridAreaCalculations[calculation.GridAreaCode] = list = [];
            }

            list.Add(new RequestSettlementReportGridAreaCalculation(
                calculation.CalculationId,
                calculation.CalculationTime,
                calculation.GridAreaCode));
        }

        return gridAreaCalculations;
    }
}
