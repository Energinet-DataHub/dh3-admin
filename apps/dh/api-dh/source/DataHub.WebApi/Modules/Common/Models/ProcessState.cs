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

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public enum ProcessState
{
    [GraphQLName("pending")]
    Pending,
    [GraphQLName("running")]
    Running,
    [GraphQLName("failed")]
    Failed,
    [GraphQLName("canceled")]
    Canceled,
    [GraphQLName("succeeded")]
    Succeeded,
}

public static class ProcessStateExtensions
{
    public static ProcessState ToProcessState(
        this OrchestrationInstanceLifecycleDto lifecycle) => lifecycle switch
        {
            { State: OrchestrationInstanceLifecycleState.Pending } => ProcessState.Pending,
            { State: OrchestrationInstanceLifecycleState.Queued } => ProcessState.Pending,
            { State: OrchestrationInstanceLifecycleState.Running } => ProcessState.Running,
            { State: OrchestrationInstanceLifecycleState.Terminated } =>
                lifecycle.TerminationState switch
                {
                    OrchestrationInstanceTerminationState.UserCanceled => ProcessState.Canceled,
                    OrchestrationInstanceTerminationState.Succeeded => ProcessState.Succeeded,
                    OrchestrationInstanceTerminationState.Failed => ProcessState.Failed,
                },
        };

    public static OrchestrationInstanceLifecycleState ToOrchestrationInstanceLifecycleState(
        this ProcessState status) => status switch
        {
            ProcessState.Canceled => OrchestrationInstanceLifecycleState.Terminated,
            ProcessState.Succeeded => OrchestrationInstanceLifecycleState.Terminated,
            ProcessState.Running => OrchestrationInstanceLifecycleState.Running,
            ProcessState.Failed => OrchestrationInstanceLifecycleState.Terminated,
            ProcessState.Pending => OrchestrationInstanceLifecycleState.Pending,
        };

    public static OrchestrationInstanceTerminationState? ToOrchestrationInstanceTerminationState(
        this ProcessState status) => status switch
        {
            ProcessState.Canceled => OrchestrationInstanceTerminationState.UserCanceled,
            ProcessState.Succeeded => OrchestrationInstanceTerminationState.Succeeded,
            ProcessState.Running => null,
            ProcessState.Failed => OrchestrationInstanceTerminationState.Failed,
            ProcessState.Pending => null,
        };
}
