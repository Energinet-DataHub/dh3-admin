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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Enums;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Extensions;

public static class OrchestrationInstanceStateExtensions
{
    public static OrchestrationInstanceLifecycleState ToLifecycleState(
        this OrchestrationInstanceState status) =>
        status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Completed => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Executing => OrchestrationInstanceLifecycleState.Running,
            OrchestrationInstanceState.Failed => OrchestrationInstanceLifecycleState.Terminated,
            OrchestrationInstanceState.Pending => OrchestrationInstanceLifecycleState.Pending,
            OrchestrationInstanceState.Queued => OrchestrationInstanceLifecycleState.Queued,
        };

    public static OrchestrationInstanceTerminationState? ToTerminationState(
        this OrchestrationInstanceState status) =>
        status switch
        {
            OrchestrationInstanceState.Canceled => OrchestrationInstanceTerminationState.UserCanceled,
            OrchestrationInstanceState.Completed => OrchestrationInstanceTerminationState.Succeeded,
            OrchestrationInstanceState.Executing => null,
            OrchestrationInstanceState.Failed => OrchestrationInstanceTerminationState.Failed,
            OrchestrationInstanceState.Pending => null,
            OrchestrationInstanceState.Queued => null,
        };

    public static OrchestrationInstanceState ToOrchestrationInstanceState(
        this OrchestrationInstanceLifecycleDto lifecycle) =>
        lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => OrchestrationInstanceState.Queued,
            { State: OrchestrationInstanceLifecycleState.Running } => OrchestrationInstanceState.Executing,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => OrchestrationInstanceState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => OrchestrationInstanceState.Completed,
                    OrchestrationInstanceTerminationState.Failed => OrchestrationInstanceState.Failed,
                },
        };

    public static OrchestrationInstanceState ToOrchestrationInstanceState(this StepInstanceLifecycleDto lifecycle) =>
        lifecycle switch
        {
            { State: StepInstanceLifecycleState.Pending } => OrchestrationInstanceState.Pending,
            { State: StepInstanceLifecycleState.Running } => OrchestrationInstanceState.Executing,
            { State: StepInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationStepTerminationState.Skipped => OrchestrationInstanceState.Canceled,
                    OrchestrationStepTerminationState.Succeeded => OrchestrationInstanceState.Completed,
                    OrchestrationStepTerminationState.Failed => OrchestrationInstanceState.Failed,
                },
        };
}
