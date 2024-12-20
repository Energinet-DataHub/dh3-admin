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
using Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;

namespace Energinet.DataHub.WebApi.GraphQL.Extensions;

public static class ProcessManagerExtensions
{
    internal static IOrchestrationInstance<T> ToOrchestrationInstance<T>(
        this OrchestrationInstanceTypedDto<T> instance)
        where T : class, IInputParameterDto =>
        new OrchestrationInstance<T>(
            instance.Id, instance.Lifecycle, instance.Steps, instance.ParameterValue);
}
