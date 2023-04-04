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

using System.Linq;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using GraphQL;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ProcessStepResultType : ObjectGraphType<ProcessStepResultDto>
    {
        public ProcessStepResultType()
        {
            Name = "ProcessStepResult";
            Field(x => x.Min);
            Field(x => x.Max);
            Field(x => x.Sum);
            Field<NonNullGraphType<ListGraphType<NonNullGraphType<TimeSeriesPointType>>>>("timeSeriesPoints")
                .Resolve(context => context.Source.TimeSeriesPoints);
            // TODO: LRN should be TimeSeriesType
            Field(x => x.Resolution).Name("timeSeriesType");

            Field<StringGraphType>("breadcrumb")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantClient>()
               .ResolveAsync(async (context, client) =>
               {
                   var parent = context.Parent!;
                   var gridArea = parent.Parent!.GetArgument<string>("gridArea");
                   var gln = parent.GetArgument<string>("gln");
                   return gln switch
                   {
                       // TODO: Inefficient request
                       "grid_area" => (await client.GetGridAreasAsync())
                           .Where(g => g.Code == gridArea)
                           .Select(g => $"({g.Code}) {g.Name}")
                           .First() ?? gridArea,
                       _ => gln,
                   };
               });
        }
    }
}
