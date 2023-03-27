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

using System;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL.DataLoader;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class SettlementReportType : ObjectGraphType<SettlementReport>
    {
        public SettlementReportType()
        {
            Name = "SettlementReport";
            Field(x => x.BatchNumber).Description("The batch number");
            Field(x => x.ProcessType).Description("The process type.");
            Field(x => x.GridArea).Description("The grid area.");
            Field<DateRangeType>("period")
              .Resolve(context => context.Source.Period);
            Field(x => x.ExecutionTime, nullable: true).Description("The execution time.");
        }
    }
}
