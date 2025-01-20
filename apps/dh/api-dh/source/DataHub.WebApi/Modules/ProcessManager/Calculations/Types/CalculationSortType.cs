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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;

public class CalculationSortType : SortInputType<IOrchestrationInstanceTypedDto<CalculationInputV1>>
{
    protected override void Configure(ISortInputTypeDescriptor<IOrchestrationInstanceTypedDto<CalculationInputV1>> descriptor)
    {
        descriptor
            .Name("CalculationSortInput")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.ParameterValue.CalculationType).Name("calculationType");
        descriptor.Field(f => f.Lifecycle.StartedAt ?? f.Lifecycle.ScheduledToRunAt).Name("executionTime");
        descriptor.Field(f => f.Lifecycle.ToProcessState()).Name("status");
        descriptor.Field(f => f.ParameterValue.PeriodStartDate).Name("period");
        descriptor
            .Field(f => f.ParameterValue.IsInternalCalculation
                ? CalculationExecutionType.Internal
                : CalculationExecutionType.External)
            .Name("executionType");
    }
}
