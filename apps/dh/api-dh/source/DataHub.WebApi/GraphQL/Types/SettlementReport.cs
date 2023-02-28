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
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.Wholesale.Contracts;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class SettlementReport
    {
        public ProcessType ProcessType { get; set; }

        public GridAreaDto GridArea { get; set; }

        public Tuple<DateTimeOffset, DateTimeOffset> Period { get; set; }

        public DateTimeOffset? ExecutionTime { get; set; }

        public SettlementReport(
            ProcessType processType,
            GridAreaDto gridArea,
            Tuple<DateTimeOffset, DateTimeOffset> period,
            DateTimeOffset? executionTime)
        {
            ProcessType = processType;
            GridArea = gridArea;
            Period = period;
            ExecutionTime = executionTime;
        }
    }
}
