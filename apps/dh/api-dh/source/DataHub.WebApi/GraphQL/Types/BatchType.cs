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
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class BatchType : ObjectGraphType<BatchDtoV2>
    {
        public BatchType()
        {
            Name = "Batch";
            Field(x => x.BatchNumber).Name("id").Description("The id of the batch.");
            Field(x => x.ExecutionState).Description("The execution state.");
            Field(x => x.ExecutionTimeStart, nullable: true).Description("The execution start time.");
            Field(x => x.ExecutionTimeEnd, nullable: true).Description("The execution end time.");
            Field(x => x.GridAreaCodes).Description("The grid area codes.");
            Field(x => x.IsBasisDataDownloadAvailable).Description("Whether basis data is downloadable.");
            Field<DateRangeType>("period")
              .Resolve(context => Tuple.Create(context.Source.PeriodStart, context.Source.PeriodEnd));
        }
    }
}
